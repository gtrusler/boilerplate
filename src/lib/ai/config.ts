import { AIConfig, AIModel } from '@/types/ai'

export const AI_CONFIGS: Record<AIModel, AIConfig> = {
  'gpt-4': {
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
    topP: 1,
  },
  'gpt-3.5-turbo': {
    model: 'gpt-3.5-turbo',
    maxTokens: 2000,
    temperature: 0.7,
    topP: 1,
  },
  'claude-3-opus': {
    model: 'claude-3-opus',
    maxTokens: 2000,
    temperature: 0.7,
    topP: 1,
  },
  'claude-3-sonnet': {
    model: 'claude-3-sonnet',
    maxTokens: 2000,
    temperature: 0.7,
    topP: 1,
  },
}

export const DEFAULT_AI_MODEL: AIModel = 'gpt-3.5-turbo' 