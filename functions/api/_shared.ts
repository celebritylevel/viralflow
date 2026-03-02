export interface Env {
  PERPLEXITY_API_KEY: string
}

export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function corsOptions() {
  return new Response(null, { headers: CORS })
}

export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

export function errorResponse(message: string, status = 500) {
  return jsonResponse({ error: message }, status)
}

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface PerplexityOptions {
  model?: string
  recencyFilter?: 'day' | 'week' | 'month' | 'year'
  temperature?: number
}

export async function callPerplexity(
  apiKey: string,
  messages: PerplexityMessage[],
  options: PerplexityOptions = {}
): Promise<string> {
  const {
    model = 'sonar-pro',
    recencyFilter,
    temperature = 0.2,
  } = options

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature,
    return_citations: true,
  }

  if (recencyFilter) {
    body.search_recency_filter = recencyFilter
  }

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Perplexity error ${res.status}: ${txt}`)
  }

  const data = await res.json<{ choices: Array<{ message: { content: string } }> }>()
  return data.choices[0].message.content
}

export function parseJSON<T>(raw: string, fallback: T): T {
  // Try direct parse
  try {
    return JSON.parse(raw) as T
  } catch {
    // Try to extract JSON block from markdown
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\})/)
    if (match) {
      try {
        return JSON.parse(match[1] || match[0]) as T
      } catch {
        return fallback
      }
    }
    return fallback
  }
}
