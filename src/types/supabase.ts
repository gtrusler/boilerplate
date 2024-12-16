export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      videos: {
        Row: {
          id: string // uuid
          youtube_id: string
          title: string
          channel_name: string | null
          channel_id: string | null
          description: string | null
          thumbnail_url: string | null
          tags: string[] | null
          upload_date: string | null // date
          created_at: string | null // timestamp without time zone
        }
        Insert: {
          id?: string // uuid
          youtube_id: string
          title: string
          channel_name?: string | null
          channel_id?: string | null
          description?: string | null
          thumbnail_url?: string | null
          tags?: string[] | null
          upload_date?: string | null // date
          created_at?: string | null // timestamp without time zone
        }
        Update: {
          id?: string // uuid
          youtube_id?: string
          title?: string
          channel_name?: string | null
          channel_id?: string | null
          description?: string | null
          thumbnail_url?: string | null
          tags?: string[] | null
          upload_date?: string | null // date
          created_at?: string | null // timestamp without time zone
        }
      }
      transcripts: {
        Row: {
          id: string // uuid
          video_id: string // uuid
          content: string | null
          summary: string | null
          created_at: string | null // timestamp without time zone
        }
        Insert: {
          id?: string // uuid
          video_id: string // uuid
          content?: string | null
          summary?: string | null
          created_at?: string | null // timestamp without time zone
        }
        Update: {
          id?: string // uuid
          video_id?: string // uuid
          content?: string | null
          summary?: string | null
          created_at?: string | null // timestamp without time zone
        }
      }
      tags: {
        Row: {
          id: string // uuid
          name: string
          created_at: string | null // timestamp without time zone
        }
        Insert: {
          id?: string // uuid
          name: string
          created_at?: string | null // timestamp without time zone
        }
        Update: {
          id?: string // uuid
          name?: string
          created_at?: string | null // timestamp without time zone
        }
      }
      alerts: {
        Row: {
          id: string // uuid
          user_id: string // uuid
          search_query: string
          folder_path: string | null
          date_filter: string | null
          last_checked: string | null // timestamp without time zone
          created_at: string | null // timestamp without time zone
        }
        Insert: {
          id?: string // uuid
          user_id: string // uuid
          search_query: string
          folder_path?: string | null
          date_filter?: string | null
          last_checked?: string | null // timestamp without time zone
          created_at?: string | null // timestamp without time zone
        }
        Update: {
          id?: string // uuid
          user_id?: string // uuid
          search_query?: string
          folder_path?: string | null
          date_filter?: string | null
          last_checked?: string | null // timestamp without time zone
          created_at?: string | null // timestamp without time zone
        }
      }
      users: {
        Row: {
          id: string // uuid
          email: string
          created_at: string | null // timestamp without time zone
        }
        Insert: {
          id?: string // uuid
          email: string
          created_at?: string | null // timestamp without time zone
        }
        Update: {
          id?: string // uuid
          email?: string
          created_at?: string | null // timestamp without time zone
        }
      }
    }
  }
}

// Convenience types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type Video = Tables<'videos'>
export type Transcript = Tables<'transcripts'>
export type Tag = Tables<'tags'>
export type Alert = Tables<'alerts'>
export type User = Tables<'users'>
