import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { z } from 'zod'

/**
 * Validation schema for transcript updates
 */
const updateTranscriptSchema = z.object({
  content: z.string().min(1),
  summary: z.string().optional(),
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
 * Verify admin role
 */
async function verifyAdmin(supabase: ReturnType<typeof createServerSupabaseClient>) {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    throw new Error('Authentication required')
  }

  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  return session.user
}

/**
 * Handle GET requests to fetch a transcript
 * @route GET /api/transcripts/[id]
 * @param request Request object
 * @param params Route parameters containing transcript ID
 * @returns Transcript data
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const transcriptId = params.id

  try {
    const { data: transcript, error } = await supabase
      .from('transcripts')
      .select('*, videos!inner(*)')
      .eq('id', transcriptId)
      .single()

    if (error) {
      throw error
    }

    if (!transcript) {
      return errorResponse('Transcript not found', 404)
    }

    return NextResponse.json({ transcript })
  } catch (error) {
    console.error('Error fetching transcript:', error)
    return errorResponse(
      'Failed to fetch transcript',
      500
    )
  }
}

/**
 * Handle PUT requests to update a transcript
 * @route PUT /api/transcripts/[id]
 * @param request Request object containing updated transcript data
 * @param params Route parameters containing transcript ID
 * @returns Updated transcript data
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const transcriptId = params.id

  try {
    // Verify admin access
    await verifyAdmin(supabase)

    const body = await request.json()
    const result = updateTranscriptSchema.safeParse(body)

    if (!result.success) {
      return errorResponse(
        'Invalid request body: content is required',
        400
      )
    }

    const { data: transcript, error } = await supabase
      .from('transcripts')
      .update(result.data)
      .eq('id', transcriptId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ transcript })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return errorResponse(error.message, 401, 'AUTH_REQUIRED')
    }
    if (error instanceof Error && error.message === 'Admin access required') {
      return errorResponse(error.message, 403, 'ADMIN_REQUIRED')
    }

    console.error('Error updating transcript:', error)
    return errorResponse(
      'Failed to update transcript',
      500
    )
  }
}

/**
 * Handle DELETE requests to remove a transcript
 * @route DELETE /api/transcripts/[id]
 * @param request Request object
 * @param params Route parameters containing transcript ID
 * @returns Success message
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const transcriptId = params.id

  try {
    // Verify admin access
    await verifyAdmin(supabase)

    const { error } = await supabase
      .from('transcripts')
      .delete()
      .eq('id', transcriptId)

    if (error) {
      throw error
    }

    return NextResponse.json({
      message: 'Transcript deleted successfully'
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return errorResponse(error.message, 401, 'AUTH_REQUIRED')
    }
    if (error instanceof Error && error.message === 'Admin access required') {
      return errorResponse(error.message, 403, 'ADMIN_REQUIRED')
    }

    console.error('Error deleting transcript:', error)
    return errorResponse(
      'Failed to delete transcript',
      500
    )
  }
}
