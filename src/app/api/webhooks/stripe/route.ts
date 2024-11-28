import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { resend } from '@/lib/email/client'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    const supabase = createServerSupabaseClient()

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Update subscription status in database
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: subscription.status,
              subscription_id: subscription.id,
              subscription_price_id: subscription.items.data[0].price.id,
            })
            .eq('id', profile.id)

          // Send email notification
          await resend.emails.send({
            from: 'billing@yourdomain.com',
            to: profile.email,
            subject: 'Subscription Updated',
            html: `Your subscription has been ${subscription.status}`,
          })
        }
        break

      // Add more webhook handlers as needed
    }

    return new Response(null, { status: 200 })
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return new Response('Webhook Error', { status: 400 })
  }
} 