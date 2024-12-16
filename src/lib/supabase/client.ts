import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

/**
 * Environment variable validation
 */
const validateEnvVariables = () => {
  const requiredEnvVars = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
  }

  return requiredEnvVars as { [K in keyof typeof requiredEnvVars]: string }
}

/**
 * Create a Supabase client for server-side operations with service role
 * @throws {Error} If environment variables are missing
 */
export const createServerSupabaseClient = () => {
  const env = validateEnvVariables()
  
  return createClient<Database>(
    env.url,
    env.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

/**
 * Create a Supabase client for client-side operations with anonymous role
 * @throws {Error} If environment variables are missing
 */
export const createClientSupabaseClient = () => {
  validateEnvVariables()
  return createClientComponentClient<Database>()
}

/**
 * Helper function to handle Supabase errors
 * @param error The error object from Supabase
 * @returns A user-friendly error message
 */
export const handleSupabaseError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return error.message as string
  }
  return 'An unexpected error occurred'
}

/**
 * Type guard for Supabase data responses
 * @param response The response from a Supabase query
 * @returns True if the response contains data
 */
export const hasData = <T>(
  response: { data: T | null; error: unknown } | undefined
): response is { data: T; error: null } => {
  return !!response && !response.error && !!response.data
}

// Common database operations
export const dbOperations = {
  // Video Operations
  /**
   * Fetch a video by its YouTube ID
   */
  getVideoByYoutubeId: async (client: ReturnType<typeof createServerSupabaseClient>, youtubeId: string) => {
    const response = await client
      .from('videos')
      .select('*')
      .eq('youtube_id', youtubeId)
      .single()
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  /**
   * Get video with its transcript
   */
  getVideoWithTranscript: async (client: ReturnType<typeof createServerSupabaseClient>, videoId: string) => {
    const response = await client
      .from('videos')
      .select(`
        *,
        transcripts (*)
      `)
      .eq('id', videoId)
      .single()
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  /**
   * Get videos by tag
   */
  getVideosByTag: async (client: ReturnType<typeof createServerSupabaseClient>, tagName: string) => {
    const response = await client
      .from('videos')
      .select('*')
      .contains('tags', [tagName])
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  /**
   * Insert a new video
   */
  insertVideo: async (
    client: ReturnType<typeof createServerSupabaseClient>,
    video: Database['public']['Tables']['videos']['Insert']
  ) => {
    const response = await client
      .from('videos')
      .insert(video)
      .select()
      .single()
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  /**
   * Update a video
   */
  updateVideo: async (
    client: ReturnType<typeof createServerSupabaseClient>,
    videoId: string,
    updates: Database['public']['Tables']['videos']['Update']
  ) => {
    const response = await client
      .from('videos')
      .update(updates)
      .eq('id', videoId)
      .select()
      .single()
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  /**
   * Delete a video
   */
  deleteVideo: async (client: ReturnType<typeof createServerSupabaseClient>, videoId: string) => {
    const response = await client
      .from('videos')
      .delete()
      .eq('id', videoId)
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return true
  },

  // Transcript Operations
  /**
   * Insert a transcript
   */
  insertTranscript: async (
    client: ReturnType<typeof createServerSupabaseClient>,
    transcript: Database['public']['Tables']['transcripts']['Insert']
  ) => {
    const response = await client
      .from('transcripts')
      .insert(transcript)
      .select()
      .single()
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  // Tag Operations
  /**
   * Create a new tag
   */
  createTag: async (
    client: ReturnType<typeof createServerSupabaseClient>,
    tag: Database['public']['Tables']['tags']['Insert']
  ) => {
    const response = await client
      .from('tags')
      .insert(tag)
      .select()
      .single()
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  /**
   * Get tags for a video
   */
  getTagsByVideo: async (client: ReturnType<typeof createServerSupabaseClient>, videoId: string) => {
    const response = await client
      .from('videos')
      .select('tags')
      .eq('id', videoId)
      .single()
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data.tags
  },

  /**
   * Update a tag
   */
  updateTag: async (
    client: ReturnType<typeof createServerSupabaseClient>,
    tagId: string,
    updates: Database['public']['Tables']['tags']['Update']
  ) => {
    const response = await client
      .from('tags')
      .update(updates)
      .eq('id', tagId)
      .select()
      .single()
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  /**
   * Delete a tag
   */
  deleteTag: async (client: ReturnType<typeof createServerSupabaseClient>, tagId: string) => {
    const response = await client
      .from('tags')
      .delete()
      .eq('id', tagId)
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return true
  },

  // Alert Operations
  /**
   * Create a new alert
   */
  createAlert: async (
    client: ReturnType<typeof createServerSupabaseClient>,
    alert: Database['public']['Tables']['alerts']['Insert']
  ) => {
    const response = await client
      .from('alerts')
      .insert(alert)
      .select()
      .single()
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  /**
   * Get alerts for a user
   */
  getAlertsByUser: async (client: ReturnType<typeof createServerSupabaseClient>, userId: string) => {
    const response = await client
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  /**
   * Update an alert
   */
  updateAlert: async (
    client: ReturnType<typeof createServerSupabaseClient>,
    alertId: string,
    updates: Database['public']['Tables']['alerts']['Update']
  ) => {
    const response = await client
      .from('alerts')
      .update(updates)
      .eq('id', alertId)
      .select()
      .single()
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return response.data
  },

  /**
   * Delete an alert
   */
  deleteAlert: async (client: ReturnType<typeof createServerSupabaseClient>, alertId: string) => {
    const response = await client
      .from('alerts')
      .delete()
      .eq('id', alertId)
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error))
    }
    
    return true
  }
}