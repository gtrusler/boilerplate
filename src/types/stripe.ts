export interface StripeCustomer {
  id: string
  email: string
  metadata: {
    supabaseUUID: string
  }
}

export interface StripeSubscription {
  id: string
  customer: string
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing'
  current_period_end: number
  items: {
    data: Array<{
      price: {
        id: string
        product: string
      }
    }>
  }
}

export interface PriceWithProduct extends Stripe.Price {
  product: Stripe.Product
}

export type SubscriptionPlan = {
  name: string
  description: string
  priceId: string
  price: number
  features: string[]
  limits: {
    aiRequests: number
    storage: number
    teamMembers: number
  }
}

export interface BillingDetails {
  subscription: StripeSubscription | null
  customer: StripeCustomer | null
  currentUsage: {
    aiRequests: number
    storage: number
    teamMembers: number
  }
} 