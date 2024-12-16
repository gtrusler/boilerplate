import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { dbOperations } from '@/lib/supabase/client'
import { z } from 'zod'

/**
 * Validation schema for alert updates
 */
const updateAlertSchema = z.object({
  search_query: z.string().min(1).max(200).optional(),
  folder_path: z.string().optional(),
  date_filter: z.string().optional(),
})

/**
 * Error response helper
 */
function errorResponse(
  message: string,
  status: number = 400,
  code?: string
) {
  return NextResponse.json(
    { error: message, code },
    { status }
  )
}

/**
 * Verify alert ownership
 */
async function verifyAlertOwnership(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  alertId: string
) {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    throw new Error('Authentication required')
  }

  const { data: alert } = await supabase
    .from('alerts')
    .select('user_id')
    .eq('id', alertId)
    .single()

  if (!alert) {
    throw new Error('Alert not found')
  }

  if (alert.user_id !== session.user.id) {
    throw new Error('Access denied')
  }

  return session.user
}

/**
 * Handle GET requests to fetch a single alert
 * @route GET /api/alerts/[id]
 * @param request Request object
 * @param params Route parameters containing alert ID
 * @returns Alert data
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const alertId = params.id

  try {
    // Verify ownership
    await verifyAlertOwnership(supabase, alertId)

    const { data: alert, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('id', alertId)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ alert })
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case 'Authentication required':
          return errorResponse(error.message, 401, 'AUTH_REQUIRED')
        case 'Alert not found':
          return errorResponse(error.message, 404, 'NOT_FOUND')
        case 'Access denied':
          return errorResponse(error.message, 403, 'ACCESS_DENIED')
      }
    }

    console.error('Error fetching alert:', error)
    return errorResponse(
      'Failed to fetch alert',
      500
    )
  }
}

/**
 * Handle PUT requests to update an alert
 * @route PUT /api/alerts/[id]
 * @param request Request object containing updated alert data
 * @param params Route parameters containing alert ID
 * @returns Updated alert data
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const alertId = params.id

  try {
    // Verify ownership
    await verifyAlertOwnership(supabase, alertId)

    const body = await request.json()
    const result = updateAlertSchema.safeParse(body)

    if (!result.success) {
      return errorResponse(
        'Invalid request body',
        400
      )
    }

    // Check for duplicate search query if it's being updated
    if (result.data.search_query) {
      const { data: existingAlert } = await supabase
        .from('alerts')
        .select('id')
        .eq('search_query', result.data.search_query)
        .neq('id', alertId)
        .single()

      if (existingAlert) {
        return errorResponse(
          'Alert with this search query already exists',
          409,
          'ALERT_EXISTS'
        )
      }
    }

    const alert = await dbOperations.updateAlert(
      supabase,
      alertId,
      result.data
    )

    return NextResponse.json({ alert })
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case 'Authentication required':
          return errorResponse(error.message, 401, 'AUTH_REQUIRED')
        case 'Alert not found':
          return errorResponse(error.message, 404, 'NOT_FOUND')
        case 'Access denied':
          return errorResponse(error.message, 403, 'ACCESS_DENIED')
      }
    }

    console.error('Error updating alert:', error)
    return errorResponse(
      'Failed to update alert',
      500
    )
  }
}

/**
 * Handle DELETE requests to remove an alert
 * @route DELETE /api/alerts/[id]
 * @param request Request object
 * @param params Route parameters containing alert ID
 * @returns Success message
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const alertId = params.id

  try {
    // Verify ownership
    await verifyAlertOwnership(supabase, alertId)

    await dbOperations.deleteAlert(supabase, alertId)

    return NextResponse.json({
      message: 'Alert deleted successfully'
    })
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case 'Authentication required':
          return errorResponse(error.message, 401, 'AUTH_REQUIRED')
        case 'Alert not found':
          return errorResponse(error.message, 404, 'NOT_FOUND')
        case 'Access denied':
          return errorResponse(error.message, 403, 'ACCESS_DENIED')
      }
    }

    console.error('Error deleting alert:', error)
    return errorResponse(
      'Failed to delete alert',
      500
    )
  }
}
