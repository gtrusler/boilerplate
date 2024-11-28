import { checkSystemHealth } from '@/lib/monitoring/health'

export async function GET() {
  try {
    const health = await checkSystemHealth()
    return Response.json(health)
  } catch (error) {
    return Response.json(
      {
        status: 'down',
        error: 'Failed to check system health',
      },
      { status: 500 }
    )
  }
} 