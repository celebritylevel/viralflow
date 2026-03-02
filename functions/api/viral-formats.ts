import type { PagesFunction } from '@cloudflare/workers-types'
import { Env, corsOptions, jsonResponse, errorResponse, callPerplexity, parseJSON } from './_shared'

export const onRequestOptions: PagesFunction = async () => corsOptions()

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { topic, platform = 'linkedin' } = await context.request.json<{
      topic: string
      platform: string
    }>()

    const system = `You are an expert viral content strategist and social media analyst who studies what makes posts go viral on professional platforms. You analyze engagement patterns, share triggers, and content formats that consistently outperform.

Always respond with ONLY valid JSON matching this exact schema:
{
  "trending_formats": [
    {
      "format_name": "name of the format",
      "why_it_works": "psychological or behavioral reason for high engagement",
      "best_for": ["use case 1", "use case 2"],
      "template": "the actual post template with [placeholders]",
      "example_hook": "example opening line for this topic"
    }
  ],
  "insights": "key insight about what's working in this niche right now"
}

Return 4-6 formats. Focus on what's CURRENTLY performing well in 2024-2025, not outdated tactics.`

    const user = `Research which content formats and post structures are currently going viral on ${platform} in the "${topic}" niche.

What types of posts are getting the most:
- Saves and bookmarks
- Shares and reposts
- Comments and debate
- Follower growth

Include formats that are specific to what's working NOW for this topic area. Give real template structures and example hooks.`

    const raw = await callPerplexity(context.env.PERPLEXITY_API_KEY, [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ], { recencyFilter: 'month' })

    const parsed = parseJSON(raw, { trending_formats: [], insights: raw })
    return jsonResponse({ ...parsed, researched_at: new Date().toISOString() })
  } catch (e) {
    return errorResponse(e instanceof Error ? e.message : 'Unknown error')
  }
}
