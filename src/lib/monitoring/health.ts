import { SystemHealth } from '@/types/monitoring'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { stripe } from '@/lib/stripe/client'
import { resend } from '@/lib/email/client'

export async function checkSystemHealth(): Promise<SystemHealth> {
  const startTime = Date.now()
  const supabase = createServerSupabaseClient()
  
  try {
    const [dbHealth] = await Promise.all([
      supabase.from('health_check').select('*').limit(1),
      stripe.customers.list({ limit: 1 }),
      resend.emails.get('test'),
    ])

    const endTime = Date.now()
    const latency = endTime - startTime

    return {
      status: 'healthy',
      services: {
        database: true,
        storage: true,
        email: true,
        ai: true,
        stripe: true,
      },
      latency: {
        database: latency,
        api: latency,
      },
    }
  } catch (error) {
    console.error('Health check failed:', error)
    return {
      status: 'degraded',
      services: {
        database: false,
        storage: false,
        email: false,
        ai: false,
        stripe: false,
      },
      latency: {
        database: 0,
        api: 0,
      },
    }
  }
} 