import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { dbOperations } from '@/lib/supabase/client'
import { z } from 'zod'
import { InsertTables } from '@/types/supabase'

/**
 * Validation schema for alert creation
 */
const createAlertSchema = z.object({
  search_query: z.string().min(1).max(200),
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
 * Handle GET requests to list user's alerts
 * @route GET /api/alerts
 * @returns List of user's alerts
 */
export async function GET() {
  const supabase = createServerSupabaseClient()

  try {
    // Get current user from session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return errorResponse(
        'Authentication required',
        401,
        'AUTH_REQUIRED'
      )
    }

    const alerts = await dbOperations.getAlertsByUser(
      supabase,
      session.user.id
    )

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return errorResponse(
      'Failed to fetch alerts',
      500
    )
  }
}

/**
 * Handle POST requests to create a new alert
 * @route POST /api/alerts
 * @param request Request object containing alert data
 * @returns Created alert data
 */
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    // Get current user from session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return errorResponse(
        'Authentication required',
        401,
        'AUTH_REQUIRED'
      )
    }

    const body = await request.json()
    const result = createAlertSchema.safeParse(body)

    if (!result.success) {
      return errorResponse(
        'Invalid request body: search_query is required',
        400
      )
    }

    // Check for duplicate alert
    const { data: existingAlert } = await supabase
      .from('alerts')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('search_query', result.data.search_query)
      .single()

    if (existingAlert) {
      return errorResponse(
        'Alert with this search query already exists',
        409,
        'ALERT_EXISTS'
      )
    }

    const alertData: InsertTables<'alerts'> = {
      user_id: session.user.id,
      search_query: result.data.search_query,
      folder_path: result.data.folder_path,
      date_filter: result.data.date_filter,
    }

    const alert = await dbOperations.createAlert(supabase, alertData)

    return NextResponse.json({ alert })
  } catch (error) {
    console.error('Error creating alert:', error)
    return errorResponse(
      'Failed to create alert',
      500
    )
  }
}
