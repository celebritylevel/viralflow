import type { PagesFunction } from '@cloudflare/workers-types'
import { Env, corsOptions, jsonResponse, errorResponse, callPerplexity, parseJSON } from './_shared'

interface GenerateBody {
  topic: {
    name: string
    description: string
    targetAudience: string
    brandVoice: string
  }
  trends: string[]
  painPoints: string[]
  formatId: string
  formatTemplate: string
  platform: string
  contentType: string
  geoOptimized: boolean
  customContext?: string
}

const PLATFORM_RULES: Record<string, string> = {
  twitter: 'Twitter/X: Max 280 chars per tweet. For threads, number each tweet (1/, 2/, etc.). Keep each tweet punchy and standalone. Use line breaks for readability.',
  linkedin: 'LinkedIn: 1200-3000 characters optimal. Use line breaks every 1-2 sentences. No hashtag spam (max 3). Strong hook in first line (before "see more" cut). Use white space generously.',
  blog: 'Blog post: 800-2000 words. Use H2 and H3 headers. Include a TL;DR at top. Use bullet points and numbered lists. Add a strong conclusion with CTA.',
  newsletter: 'Newsletter: 600-1500 words. Conversational tone. Use short paragraphs. Include a personal story angle. End with one clear call-to-action.',
}

const VOICE_RULES: Record<string, string> = {
  professional: 'Tone: Professional, authoritative, data-driven. No slang. Confident but not arrogant.',
  casual: 'Tone: Conversational, friendly, approachable. Use contractions. Write like you talk.',
  bold: 'Tone: Bold, direct, no fluff. Strong opinions. Confident claims. Challenge the status quo.',
  educational: 'Tone: Clear, teaching-focused, structured. Use examples and analogies. Make complex simple.',
  storytelling: 'Tone: Narrative-driven, emotional, human. Use scenes and moments. Make the reader feel something.',
}

export const onRequestOptions: PagesFunction = async () => corsOptions()

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<GenerateBody>()
    const { topic, trends, painPoints, formatTemplate, platform, contentType, geoOptimized, customContext } = body

    const platformRule = PLATFORM_RULES[platform] || PLATFORM_RULES.linkedin
    const voiceRule = VOICE_RULES[topic.brandVoice] || VOICE_RULES.professional

    const trendsContext = trends.length
      ? `Current trends to incorporate: ${trends.join(' | ')}`
      : ''
    const painContext = painPoints.length
      ? `Pain points to address: ${painPoints.join(' | ')}`
      : ''
    const geoNote = geoOptimized
      ? `\nGEO OPTIMIZATION REQUIRED: Structure with clear headers, include at least one specific stat/data point, use direct Q&A format where relevant, make it highly citable by AI engines.`
      : ''

    const system = `You are an elite social media copywriter and content strategist who creates viral, high-engagement posts for B2B audiences. Your writing is sharp, specific, and drives real business results.

${platformRule}
${voiceRule}

Output ONLY valid JSON:
{
  "hook": "the opening line / headline (the most powerful line)",
  "content": "the complete post content ready to copy-paste"
}

Never add commentary. Return only the JSON.`

    const user = `Write a ${contentType} post for ${platform} about: "${topic.name}"

Target audience: ${topic.targetAudience}
Post format to follow: ${formatTemplate}

${trendsContext}
${painContext}
${customContext ? `Additional context: ${customContext}` : ''}${geoNote}

Requirements:
- Use the provided format as a structural guide, not a literal template
- Make the hook impossible to scroll past
- Be specific with numbers, tools, and examples where possible
- Connect the trending topic to the pain point for maximum relevance
- Sound like a human expert, not an AI writing tool

Write the complete, publish-ready post now.`

    const raw = await callPerplexity(context.env.PERPLEXITY_API_KEY, [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ], { model: 'sonar-pro', temperature: 0.7 })

    const parsed = parseJSON<{ hook: string; content: string }>(raw, {
      hook: '',
      content: raw,
    })

    return jsonResponse(parsed)
  } catch (e) {
    return errorResponse(e instanceof Error ? e.message : 'Unknown error')
  }
}
