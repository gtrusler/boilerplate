import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { dbOperations } from '@/lib/supabase/client'
import {
  YouTubeError,
  YouTubeErrorCodes,
  extractVideoId,
  fetchVideoMetadata,
  fetchTranscript,
  withRetry,
  youtubeUrlSchema,
} from '@/lib/youtube'
import { InsertTables } from '@/types/supabase'

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
 * Handle POST requests for YouTube video submissions
 * @route POST /api/videos
 * @param request Request object containing youtubeUrl
 * @returns Processed video data or error response
 */
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  
  try {
    // Validate request body
    const body = await request.json()
    const result = youtubeUrlSchema.safeParse(body)
    
    if (!result.success) {
      return errorResponse(
        'Invalid request body: youtubeUrl is required',
        400
      )
    }

    // Extract video ID from URL
    const videoId = extractVideoId(result.data.youtubeUrl)

    // Check if video already exists
    const existingVideo = await withRetry(() =>
      dbOperations.getVideoByYoutubeId(supabase, videoId)
    )

    if (existingVideo) {
      return NextResponse.json({ video: existingVideo })
    }

    // Fetch video metadata and transcript in parallel
    const [metadata, transcript] = await Promise.all([
      withRetry(() => fetchVideoMetadata(videoId)),
      withRetry(() => fetchTranscript(videoId)).catch(() => null), // Transcript is optional
    ])

    // Prepare video data
    const videoData: InsertTables<'videos'> = {
      youtube_id: metadata.id,
      title: metadata.title,
      channel_id: metadata.channelId,
      channel_name: metadata.channelTitle,
      description: metadata.description,
      thumbnail_url: metadata.thumbnailUrl,
      tags: metadata.tags,
      upload_date: new Date(metadata.publishedAt).toISOString().split('T')[0],
    }

    // Insert video
    const video = await dbOperations.insertVideo(supabase, videoData)

    // Insert transcript if available
    if (transcript) {
      const transcriptData: InsertTables<'transcripts'> = {
        video_id: video.id,
        content: transcript,
      }
      await dbOperations.insertTranscript(supabase, transcriptData)
    }

    return NextResponse.json({
      video,
      hasTranscript: Boolean(transcript)
    })

  } catch (error) {
    if (error instanceof YouTubeError) {
      switch (error.code) {
        case YouTubeErrorCodes.INVALID_URL:
          return errorResponse(
            'Invalid YouTube URL format',
            400,
            error.code
          )
        case YouTubeErrorCodes.VIDEO_NOT_FOUND:
          return errorResponse(
            'Video not found',
            404,
            error.code
          )
        case YouTubeErrorCodes.API_ERROR:
          return errorResponse(
            'Failed to fetch video data',
            500,
            error.code
          )
        default:
          return errorResponse(
            error.message,
            500,
            error.code
          )
      }
    }

    console.error('Error processing video:', error)
    return errorResponse(
      'An unexpected error occurred while processing the video',
      500
    )
  }
}

/**
 * Handle GET requests to fetch a video by ID
 * @route GET /api/videos?id={videoId}
 * @param request Request object containing video ID
 * @returns Video data with transcript or error response
 */
export async function GET(request: Request) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get('id')

  if (!videoId) {
    return errorResponse('Video ID is required', 400)
  }

  try {
    const video = await dbOperations.getVideoWithTranscript(supabase, videoId)
    
    if (!video) {
      return errorResponse('Video not found', 404)
    }

    return NextResponse.json({ video })
  } catch (error) {
    console.error('Error fetching video:', error)
    return errorResponse(
      'An unexpected error occurred while fetching the video',
      500
    )
  }
}
