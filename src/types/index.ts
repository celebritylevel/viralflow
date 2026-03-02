export interface Topic {
  id: string
  name: string
  description: string
  keywords: string[]
  targetAudience: string
  brandVoice: 'professional' | 'casual' | 'bold' | 'educational' | 'storytelling'
  platforms: Platform[]
  createdAt: string
  updatedAt: string
}

export type Platform = 'twitter' | 'linkedin' | 'blog' | 'newsletter'

export interface Trend {
  title: string
  description: string
  momentum: 'high' | 'medium' | 'low'
  why_trending: string
  content_angle: string
  sources?: string[]
}

export interface TrendsResult {
  trends: Trend[]
  summary: string
  researched_at: string
}

export interface PainPoint {
  pain: string
  severity: 'critical' | 'high' | 'medium'
  audience: string
  opportunity: string
  solution_angle: string
}

export interface PainPointsResult {
  pain_points: PainPoint[]
  key_frustrations: string[]
  market_gaps: string[]
  summary: string
  researched_at: string
}

export interface ViralFormatResearch {
  format_name: string
  why_it_works: string
  best_for: string[]
  template: string
  example_hook: string
}

export interface ViralFormatsResult {
  trending_formats: ViralFormatResearch[]
  insights: string
  researched_at: string
}

export interface GeoTactic {
  tactic: string
  description: string
  implementation: string
  why_effective: string
}

export interface GeoTacticsResult {
  tactics: GeoTactic[]
  key_principles: string[]
  summary: string
  researched_at: string
}

export interface GeneratedPost {
  id: string
  topicId: string
  platform: Platform
  formatId: string
  content: string
  hook: string
  createdAt: string
  saved: boolean
}

export interface GenerateRequest {
  topicId: string
  topic: Topic
  trends: string[]
  painPoints: string[]
  formatId: string
  platform: Platform
  contentType: 'short-post' | 'thread' | 'long-post' | 'article'
  geoOptimized: boolean
  customContext?: string
}

export interface ResearchCache {
  trends?: TrendsResult
  painPoints?: PainPointsResult
  viralFormats?: ViralFormatsResult
  geoTactics?: GeoTacticsResult
}
