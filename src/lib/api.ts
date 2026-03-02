import type {
  Topic,
  TrendsResult,
  PainPointsResult,
  ViralFormatsResult,
  GeoTacticsResult,
  GenerateRequest,
} from '../types'

const BASE = '/api'

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API error ${res.status}: ${err}`)
  }
  return res.json()
}

export const api = {
  trends: (topic: Topic, timeframe: 'day' | 'week' | 'month' = 'week') =>
    post<TrendsResult>('/trends', { topic: topic.name, keywords: topic.keywords, timeframe }),

  painPoints: (topic: Topic) =>
    post<PainPointsResult>('/pain-points', {
      topic: topic.name,
      targetAudience: topic.targetAudience,
      keywords: topic.keywords,
    }),

  viralFormats: (topic: Topic) =>
    post<ViralFormatsResult>('/viral-formats', {
      topic: topic.name,
      platform: topic.platforms[0] || 'linkedin',
    }),

  geoTactics: (topic: Topic) =>
    post<GeoTacticsResult>('/geo-tactics', { topic: topic.name }),

  generate: (req: GenerateRequest) => post<{ content: string; hook: string }>('/generate', req),
}
