import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: 'Basic',
    description: 'Perfect for small projects',
    priceId: process.env.STRIPE_PRICE_ID_BASIC!,
    price: 9,
    features: [
      '1,000 AI requests/month',
      '10GB storage',
      'Up to 3 team members',
    ],
    limits: {
      aiRequests: 1000,
      storage: 10,
      teamMembers: 3,
    },
  },
  // Add Pro and Enterprise plans
] 