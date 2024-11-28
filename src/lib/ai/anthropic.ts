import Anthropic from '@anthropic-ai/sdk'
import { rateLimit } from '@/lib/utils/rate-limit'
import { AIResponse, AIError } from '@/types/ai'
import { logger } from '@/lib/utils/logger'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateClaudeResponse(
  prompt: string,
  config = AI_CONFIGS['claude-3-sonnet']
): Promise<AIResponse> {
  try {
    await rateLimit.check()

    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      messages: [{ role: 'user', content: prompt }],
    })

    return {
      content: response.content[0].text,
      usage: {
        tokens: response.usage?.input_tokens || 0,
        cost: calculateClaudeCost(response.usage?.input_tokens || 0, config.model),
        timestamp: new Date(),
      },
      model: config.model,
    }
  } catch (error) {
    logger.error('Anthropic API error:', error)
    throw handleAIError(error)
  }
} 