import { YoutubeTranscript } from 'youtube-transcript'
import { z } from 'zod'

/**
 * YouTube URL patterns for different formats
 */
const URL_PATTERNS = {
  STANDARD: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  SHORTS: /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  EMBED: /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
}

/**
 * YouTube API response types
 */
export interface YouTubeVideoMetadata {
  id: string
  title: string
  channelId: string
  channelTitle: string
  description: string
  thumbnailUrl: string
  tags: string[]
  publishedAt: string
}

export interface YouTubeTranscript {
  text: string
  duration: number
  offset: number
}

/**
 * Error types for YouTube operations
 */
export class YouTubeError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'YouTubeError'
  }
}

export const YouTubeErrorCodes = {
  INVALID_URL: 'INVALID_URL',
  VIDEO_NOT_FOUND: 'VIDEO_NOT_FOUND',
  TRANSCRIPT_NOT_AVAILABLE: 'TRANSCRIPT_NOT_AVAILABLE',
  API_ERROR: 'API_ERROR',
} as const

/**
 * Input validation schema for YouTube URLs
 */
export const youtubeUrlSchema = z.object({
  youtubeUrl: z.string().url(),
})

export type YouTubeUrlInput = z.infer<typeof youtubeUrlSchema>

/**
 * Extract YouTube video ID from various URL formats
 * @throws {YouTubeError} If URL is invalid
 */
export function extractVideoId(url: string): string {
  for (const [format, pattern] of Object.entries(URL_PATTERNS)) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  throw new YouTubeError('Invalid YouTube URL format', YouTubeErrorCodes.INVALID_URL)
}

/**
 * Fetch video metadata from YouTube API
 * @throws {YouTubeError} If video not found or API error occurs
 */
export async function fetchVideoMetadata(videoId: string): Promise<YouTubeVideoMetadata> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    throw new Error('YouTube API key not configured')
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`
  
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new YouTubeError(
        'Failed to fetch video metadata',
        YouTubeErrorCodes.API_ERROR
      )
    }

    const data = await response.json()
    if (!data.items || data.items.length === 0) {
      throw new YouTubeError(
        'Video not found',
        YouTubeErrorCodes.VIDEO_NOT_FOUND
      )
    }

    const snippet = data.items[0].snippet
    return {
      id: videoId,
      title: snippet.title,
      channelId: snippet.channelId,
      channelTitle: snippet.channelTitle,
      description: snippet.description,
      thumbnailUrl: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
      tags: snippet.tags || [],
      publishedAt: snippet.publishedAt,
    }
  } catch (error) {
    if (error instanceof YouTubeError) {
      throw error
    }
    throw new YouTubeError(
      'Failed to fetch video metadata',
      YouTubeErrorCodes.API_ERROR
    )
  }
}

/**
 * Fetch video transcript
 * @throws {YouTubeError} If transcript not available or fetch fails
 */
export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    if (!transcript || transcript.length === 0) {
      throw new YouTubeError(
        'Transcript not available',
        YouTubeErrorCodes.TRANSCRIPT_NOT_AVAILABLE
      )
    }

    // Combine transcript segments into a single text
    return transcript
      .map((segment: YouTubeTranscript) => segment.text)
      .join(' ')
      .trim()
  } catch (error) {
    if (error instanceof YouTubeError) {
      throw error
    }
    throw new YouTubeError(
      'Failed to fetch transcript',
      YouTubeErrorCodes.TRANSCRIPT_NOT_AVAILABLE
    )
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}
