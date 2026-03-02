import type { PagesFunction } from '@cloudflare/workers-types'
import { Env, CORS, corsOptions, jsonResponse, errorResponse, callPerplexity, parseJSON } from './_shared'

export const onRequestOptions: PagesFunction = async () => corsOptions()

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { topic, keywords = [], timeframe = 'week' } = await context.request.json<{
      topic: string
      keywords: string[]
      timeframe: 'day' | 'week' | 'month'
    }>()

    const keywordStr = keywords.length ? ` (key terms: ${keywords.join(', ')})` : ''

    const system = `You are an expert market research analyst specializing in identifying emerging trends, viral topics, and industry movements. You provide accurate, current intelligence about what's generating buzz RIGHT NOW.

Always respond with ONLY valid JSON matching this exact schema:
{
  "trends": [
    {
      "title": "short trend name",
      "description": "2-3 sentence description of what's happening",
      "momentum": "high|medium|low",
      "why_trending": "specific reason this is gaining traction now",
      "content_angle": "how a content creator could use this trend",
      "sources": ["source 1", "source 2"]
    }
  ],
  "summary": "2-3 sentence executive summary of the overall trend landscape"
}

Return 6-8 trends. Focus on what is ACTUALLY happening NOW, not generic evergreen topics.`

    const user = `Research what's trending this ${timeframe} in: "${topic}"${keywordStr}

Find the top trending topics including:
- New tool launches or major product updates
- Viral discussions or debates
- Emerging methodologies or approaches
- Key influencer conversations
- Industry shifts or news events

Be specific with names, tools, companies, and events. This is for a content creator who needs to jump on real, timely trends.`

    const raw = await callPerplexity(context.env.PERPLEXITY_API_KEY, [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ], { recencyFilter: timeframe })

    const parsed = parseJSON(raw, { trends: [], summary: raw })
    return jsonResponse({ ...parsed, researched_at: new Date().toISOString() })
  } catch (e) {
    return errorResponse(e instanceof Error ? e.message : 'Unknown error')
  }
}
