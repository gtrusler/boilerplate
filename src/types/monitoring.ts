export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down'
  services: {
    database: boolean
    storage: boolean
    email: boolean
    ai: boolean
    stripe: boolean
  }
  latency: {
    database: number
    api: number
  }
}

export interface UserActivity {
  userId: string
  action: string
  timestamp: Date
  metadata: Record<string, any>
}

export interface ErrorLog {
  message: string
  stack?: string
  timestamp: Date
  userId?: string
  metadata?: Record<string, any>
} 