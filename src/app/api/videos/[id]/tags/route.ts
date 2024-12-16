import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { dbOperations } from '@/lib/supabase/client'
import { z } from 'zod'

/**
 * Validation schema for adding tags
 */
const addTagsSchema = z.object({
  tags: z.array(z.string()).min(1).max(20),
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
 * Handle GET requests to fetch tags for a video
 * @route GET /api/videos/[id]/tags
 * @param request Request object
 * @param params Route parameters containing video ID
 * @returns List of video tags
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const videoId = params.id

  try {
    const tags = await dbOperations.getTagsByVideo(supabase, videoId)
    
    if (!tags) {
      return errorResponse('Video not found', 404)
    }

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Error fetching video tags:', error)
    return errorResponse(
      'Failed to fetch video tags',
      500
    )
  }
}

/**
 * Handle POST requests to add tags to a video
 * @route POST /api/videos/[id]/tags
 * @param request Request object containing tags array
 * @param params Route parameters containing video ID
 * @returns Updated video tags
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const videoId = params.id

  try {
    const body = await request.json()
    const result = addTagsSchema.safeParse(body)

    if (!result.success) {
      return errorResponse(
        'Invalid request body: tags array is required',
        400
      )
    }

    // Get current video
    const { data: video } = await supabase
      .from('videos')
      .select('tags')
      .eq('id', videoId)
      .single()

    if (!video) {
      return errorResponse('Video not found', 404)
    }

    // Merge existing and new tags, remove duplicates
    const currentTags = video.tags || []
    const uniqueTags = [...new Set([...currentTags, ...result.data.tags])]

    // Update video tags
    const { error: updateError } = await supabase
      .from('videos')
      .update({ tags: uniqueTags })
      .eq('id', videoId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ tags: uniqueTags })
  } catch (error) {
    console.error('Error adding video tags:', error)
    return errorResponse(
      'Failed to add video tags',
      500
    )
  }
}

/**
 * Handle DELETE requests to remove tags from a video
 * @route DELETE /api/videos/[id]/tags
 * @param request Request object containing tags to remove
 * @param params Route parameters containing video ID
 * @returns Updated video tags
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const videoId = params.id

  try {
    const body = await request.json()
    const result = addTagsSchema.safeParse(body)

    if (!result.success) {
      return errorResponse(
        'Invalid request body: tags array is required',
        400
      )
    }

    // Get current video
    const { data: video } = await supabase
      .from('videos')
      .select('tags')
      .eq('id', videoId)
      .single()

    if (!video) {
      return errorResponse('Video not found', 404)
    }

    // Remove specified tags
    const currentTags = video.tags || []
    const updatedTags = currentTags.filter(
      tag => !result.data.tags.includes(tag)
    )

    // Update video tags
    const { error: updateError } = await supabase
      .from('videos')
      .update({ tags: updatedTags })
      .eq('id', videoId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ tags: updatedTags })
  } catch (error) {
    console.error('Error removing video tags:', error)
    return errorResponse(
      'Failed to remove video tags',
      500
    )
  }
}
