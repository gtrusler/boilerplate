'use client'

import { useState, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics/client'
import type { SystemHealth } from '@/types/monitoring'

export function AnalyticsDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHealth() {
      try {
        const response = await fetch('/api/system/health')
        const data = await response.json()
        setHealth(data)
      } catch (error) {
        console.error('Failed to fetch health status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">System Status</h2>
      {health && (
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">System Health</h3>
            <div className={`text-${health.status === 'healthy' ? 'green' : 'red'}-500`}>
              {health.status}
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Services</h3>
            {Object.entries(health.services).map(([service, status]) => (
              <div key={service} className="flex justify-between">
                <span>{service}</span>
                <span className={`text-${status ? 'green' : 'red'}-500`}>
                  {status ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 