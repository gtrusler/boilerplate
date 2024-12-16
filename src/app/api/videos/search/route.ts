import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { z } from 'zod'

/**
 * Validation schema for search parameters
 */
const searchParamsSchema = z.object({
  keyword: z.string().optional(),
  tags: z.string().transform(s => s.split(',')).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
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
 * Handle GET requests for video search
 * @route GET /api/videos/search
 * @param request Request object containing search parameters
 * @returns Paginated list of matching videos
 */
export async function GET(request: Request) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)

  try {
    const result = searchParamsSchema.safeParse(Object.fromEntries(searchParams))

    if (!result.success) {
      return errorResponse('Invalid search parameters', 400)
    }

    const { keyword, tags, dateFrom, dateTo, page, limit } = result.data

    // Start building the query
    let query = supabase
      .from('videos')
      .select('*, transcripts!inner(*)', { count: 'exact' })

    // Apply filters
    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,description.ilike.%${keyword}%,transcripts.content.ilike.%${keyword}%`
      )
    }

    if (tags && tags.length > 0) {
      query = query.contains('tags', tags)
    }

    if (dateFrom) {
      query = query.gte('upload_date', dateFrom)
    }

    if (dateTo) {
      query = query.lte('upload_date', dateTo)
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: videos, count, error } = await query
      .order('upload_date', { ascending: false })
      .range(from, to)

    if (error) {
      throw error
    }

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    })

  } catch (error) {
    console.error('Error searching videos:', error)
    return errorResponse(
      'Failed to search videos',
      500
    )
  }
}
