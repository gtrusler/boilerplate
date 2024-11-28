import { createClient } from 'redis'
import { logger } from './logger'

const redis = createClient({
  url: process.env.REDIS_URL,
})

export const rateLimit = {
  async check(key = 'default') {
    const requests = await redis.incr(`ratelimit:${key}`)
    
    if (requests === 1) {
      await redis.expire(
        `ratelimit:${key}`,
        parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS!) / 1000
      )
    }

    if (requests > parseInt(process.env.AI_RATE_LIMIT_REQUESTS!)) {
      throw new Error('RATE_LIMIT_EXCEEDED')
    }
  },
} 