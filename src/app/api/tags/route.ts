import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { dbOperations } from '@/lib/supabase/client'
import { z } from 'zod'
import { InsertTables } from '@/types/supabase'

/**
 * Validation schema for tag creation
 */
const createTagSchema = z.object({
  name: z.string().min(1).max(50),
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
 * Handle GET requests to list all tags
 * @route GET /api/tags
 * @returns List of all tags
 */
export async function GET() {
  const supabase = createServerSupabaseClient()

  try {
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (error) {
      throw error
    }

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return errorResponse(
      'Failed to fetch tags',
      500
    )
  }
}

/**
 * Handle POST requests to create a new tag
 * @route POST /api/tags
 * @param request Request object containing tag data
 * @returns Created tag data
 */
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()
    const result = createTagSchema.safeParse(body)

    if (!result.success) {
      return errorResponse(
        'Invalid request body: name is required and must be between 1 and 50 characters',
        400
      )
    }

    // Check for existing tag with same name
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('name', result.data.name)
      .single()

    if (existingTag) {
      return errorResponse(
        'Tag with this name already exists',
        409,
        'TAG_EXISTS'
      )
    }

    const tagData: InsertTables<'tags'> = {
      name: result.data.name,
    }

    const tag = await dbOperations.createTag(supabase, tagData)

    return NextResponse.json({ tag })
  } catch (error) {
    console.error('Error creating tag:', error)
    return errorResponse(
      'Failed to create tag',
      500
    )
  }
}
