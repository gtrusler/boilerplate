export type EmailTemplate =
  | 'welcome'
  | 'verify_email'
  | 'reset_password'
  | 'subscription_created'
  | 'subscription_cancelled'
  | 'payment_failed'
  | 'usage_alert'

export interface EmailData {
  to: string
  subject: string
  template: EmailTemplate
  data: Record<string, any>
}

export interface EmailConfig {
  from: string
  replyTo: string
  baseUrl: string
} 