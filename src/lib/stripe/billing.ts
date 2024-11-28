import { stripe } from './client'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { resend } from '@/lib/email/client'

export async function createOrRetrieveCustomer(userId: string, email: string) {
  const supabase = createServerSupabaseClient()

  // Check if customer exists in Supabase
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  if (profile?.stripe_customer_id) {
    const customer = await stripe.customers.retrieve(profile.stripe_customer_id)
    if (customer.deleted) {
      throw new Error('Customer deleted in Stripe')
    }
    return customer
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabaseUUID: userId,
    },
  })

  // Update Supabase profile
  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId)

  return customer
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  returnUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}?canceled=true`,
  })

  return session
}

export async function getBillingDetails(userId: string): Promise<BillingDetails> {
  const supabase = createServerSupabaseClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  if (!profile?.stripe_customer_id) {
    return {
      subscription: null,
      customer: null,
      currentUsage: {
        aiRequests: 0,
        storage: 0,
        teamMembers: 0,
      },
    }
  }

  const [customer, subscriptions] = await Promise.all([
    stripe.customers.retrieve(profile.stripe_customer_id),
    stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1,
    }),
  ])

  return {
    subscription: subscriptions.data[0] || null,
    customer: customer as StripeCustomer,
    currentUsage: await getCurrentUsage(userId),
  }
} 