'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/client'
import type { SubscriptionPlan } from '@/types/stripe'

export function PricingTable() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          returnUrl: window.location.origin + '/dashboard',
        }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      {SUBSCRIPTION_PLANS.map(plan => (
        <div
          key={plan.priceId}
          className="border rounded-lg p-8 shadow-sm"
        >
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <p className="text-gray-500 mt-2">{plan.description}</p>
          <div className="mt-4">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="mt-6 space-y-4">
            {plan.features.map(feature => (
              <li key={feature} className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe(plan)}
            disabled={loading}
            className="w-full mt-8 bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition-colors"
          >
            {loading ? 'Processing...' : 'Subscribe'}
          </button>
        </div>
      ))}
    </div>
  )
} 