export type AnalyticsEvent =
  | 'signup'
  | 'login'
  | 'subscription_created'
  | 'subscription_cancelled'
  | 'ai_request'
  | 'file_upload'
  | 'payment_success'
  | 'payment_failed'

export interface EventProperties {
  userId?: string
  plan?: string
  value?: number
  error?: string
  metadata?: Record<string, any>
}

export interface AnalyticsConfig {
  domain: string
  apiHost: string
  trackLocalhost: boolean
  enabled: boolean
} 