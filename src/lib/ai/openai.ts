import OpenAI from 'openai'
import { rateLimit } from '@/lib/utils/rate-limit'
import { AIResponse, AIError } from '@/types/ai'
import { logger } from '@/lib/utils/logger'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateOpenAIResponse(
  prompt: string,
  config = AI_CONFIGS[DEFAULT_AI_MODEL]
): Promise<AIResponse> {
  try {
    await rateLimit.check()

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      top_p: config.topP,
    })

    return {
      content: response.choices[0].message.content || '',
      usage: {
        tokens: response.usage?.total_tokens || 0,
        cost: calculateOpenAICost(response.usage?.total_tokens || 0, config.model),
        timestamp: new Date(),
      },
      model: config.model,
    }
  } catch (error) {
    logger.error('OpenAI API error:', error)
    throw handleAIError(error)
  }
} 