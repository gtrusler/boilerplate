import { Resend } from 'resend'
import { render } from '@react-email/render'
import type { EmailTemplate, EmailData } from '@/types/email'
import { WelcomeEmail } from './templates/WelcomeEmail'
import { logger } from '@/lib/utils/logger'

const resend = new Resend(process.env.RESEND_API_KEY)

const templates: Record<EmailTemplate, any> = {
  welcome: WelcomeEmail,
  // Add other email templates here
}

export async function sendEmail({
  to,
  subject,
  template,
  data,
}: EmailData) {
  try {
    const Template = templates[template]
    const html = render(<Template {...data} />)

    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to,
      subject,
      html,
    })

    logger.info('Email sent successfully', { template, to })
  } catch (error) {
    logger.error('Email sending failed', { error, template, to })
    throw error
  }
} 