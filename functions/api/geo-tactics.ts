import type { PagesFunction } from '@cloudflare/workers-types'
import { Env, corsOptions, jsonResponse, errorResponse, callPerplexity, parseJSON } from './_shared'

export const onRequestOptions: PagesFunction = async () => corsOptions()

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { topic } = await context.request.json<{ topic: string }>()

    const system = `You are a GEO (Generative Engine Optimization) and LLM-content specialist. You understand how to make content highly citable and rankable by AI engines like ChatGPT, Perplexity, Claude, and Google's AI overviews.

Always respond with ONLY valid JSON matching this exact schema:
{
  "tactics": [
    {
      "tactic": "short tactic name",
      "description": "what it is",
      "implementation": "exactly how to implement it in content",
      "why_effective": "why AI engines prefer this"
    }
  ],
  "key_principles": ["principle 1", "principle 2", "principle 3"],
  "summary": "overview of the GEO strategy for this topic"
}

Return 6-8 tactics. Be practical and specific — include actual content structure advice, not theory.`

    const user = `Research the latest GEO (Generative Engine Optimization) and LLM-friendly content tactics for the topic: "${topic}"

What content formats, structures, and techniques make content more likely to be:
- Cited by Perplexity, ChatGPT, Claude, and Gemini
- Featured in AI overview results
- Used as source material for AI-generated answers
- Ranked highly in semantic search

Focus on 2024-2025 best practices. Include specific structural techniques (Q&A sections, how headers should be formatted, what stats to include, etc.)`

    const raw = await callPerplexity(context.env.PERPLEXITY_API_KEY, [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ], { recencyFilter: 'month' })

    const parsed = parseJSON(raw, { tactics: [], key_principles: [], summary: raw })
    return jsonResponse({ ...parsed, researched_at: new Date().toISOString() })
  } catch (e) {
    return errorResponse(e instanceof Error ? e.message : 'Unknown error')
  }
}
