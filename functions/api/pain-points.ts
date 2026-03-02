import type { PagesFunction } from '@cloudflare/workers-types'
import { Env, corsOptions, jsonResponse, errorResponse, callPerplexity, parseJSON } from './_shared'

export const onRequestOptions: PagesFunction = async () => corsOptions()

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { topic, targetAudience, keywords = [] } = await context.request.json<{
      topic: string
      targetAudience: string
      keywords: string[]
    }>()

    const system = `You are an expert qualitative market researcher specializing in uncovering the real frustrations, blockers, and unmet needs of professional audiences. You analyze forums, social media, reviews, and industry discussions to surface what people genuinely struggle with.

Always respond with ONLY valid JSON matching this exact schema:
{
  "pain_points": [
    {
      "pain": "specific, visceral description of the pain",
      "severity": "critical|high|medium",
      "audience": "which segment of the audience feels this most",
      "opportunity": "what content or solution angle this opens up",
      "solution_angle": "how trending tools/approaches can solve this"
    }
  ],
  "key_frustrations": ["frustration 1", "frustration 2", "frustration 3"],
  "market_gaps": ["gap 1", "gap 2"],
  "summary": "executive summary of the pain landscape"
}

Return 6-8 pain points. Be specific and visceral — use language people actually use when venting.`

    const keywordStr = keywords.length ? ` Key terms: ${keywords.join(', ')}.` : ''
    const user = `Research the real pain points and frustrations that ${targetAudience || 'professionals'} face in the area of "${topic}".${keywordStr}

Find what they're complaining about on LinkedIn, Reddit, Twitter, Slack communities, G2 reviews, and industry forums. What keeps them up at night? What makes their job harder? What are they desperate to solve?

Focus on CURRENT pain points (2024-2025), not generic challenges.`

    const raw = await callPerplexity(context.env.PERPLEXITY_API_KEY, [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ], { recencyFilter: 'month' })

    const parsed = parseJSON(raw, { pain_points: [], key_frustrations: [], market_gaps: [], summary: raw })
    return jsonResponse({ ...parsed, researched_at: new Date().toISOString() })
  } catch (e) {
    return errorResponse(e instanceof Error ? e.message : 'Unknown error')
  }
}
