import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Topic, ResearchCache, GeneratedPost, Platform } from '../types'

interface AppState {
  topics: Topic[]
  researchCache: Record<string, ResearchCache>
  savedPosts: GeneratedPost[]
  activeTopic: string | null

  addTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTopic: (id: string, updates: Partial<Topic>) => void
  deleteTopic: (id: string) => void
  setActiveTopic: (id: string | null) => void

  setTrendsCache: (topicId: string, data: ResearchCache['trends']) => void
  setPainPointsCache: (topicId: string, data: ResearchCache['painPoints']) => void
  setViralFormatsCache: (topicId: string, data: ResearchCache['viralFormats']) => void
  setGeoTacticsCache: (topicId: string, data: ResearchCache['geoTactics']) => void
  clearCache: (topicId: string) => void

  savePost: (post: Omit<GeneratedPost, 'id' | 'createdAt' | 'saved'>) => void
  deletePost: (id: string) => void
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const DEFAULT_TOPIC: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'AI Agents for GTM Teams',
  description: 'How AI agents are transforming go-to-market strategies, sales prospecting, and revenue operations.',
  keywords: ['AI agents', 'GTM', 'sales automation', 'revenue ops', 'Claude Code', 'AI SDR'],
  targetAudience: 'VP of Sales, RevOps leaders, GTM founders',
  brandVoice: 'bold',
  platforms: ['linkedin', 'twitter'],
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      topics: [
        {
          ...DEFAULT_TOPIC,
          id: 'default',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      researchCache: {},
      savedPosts: [],
      activeTopic: 'default',

      addTopic: (data) => {
        const topic: Topic = {
          ...data,
          id: uid(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(s => ({ topics: [...s.topics, topic] }))
      },

      updateTopic: (id, updates) => {
        set(s => ({
          topics: s.topics.map(t =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }))
      },

      deleteTopic: (id) => {
        const { topics, activeTopic } = get()
        const remaining = topics.filter(t => t.id !== id)
        set({
          topics: remaining,
          activeTopic: activeTopic === id ? (remaining[0]?.id ?? null) : activeTopic,
        })
      },

      setActiveTopic: (id) => set({ activeTopic: id }),

      setTrendsCache: (topicId, data) =>
        set(s => ({
          researchCache: {
            ...s.researchCache,
            [topicId]: { ...s.researchCache[topicId], trends: data },
          },
        })),

      setPainPointsCache: (topicId, data) =>
        set(s => ({
          researchCache: {
            ...s.researchCache,
            [topicId]: { ...s.researchCache[topicId], painPoints: data },
          },
        })),

      setViralFormatsCache: (topicId, data) =>
        set(s => ({
          researchCache: {
            ...s.researchCache,
            [topicId]: { ...s.researchCache[topicId], viralFormats: data },
          },
        })),

      setGeoTacticsCache: (topicId, data) =>
        set(s => ({
          researchCache: {
            ...s.researchCache,
            [topicId]: { ...s.researchCache[topicId], geoTactics: data },
          },
        })),

      clearCache: (topicId) =>
        set(s => {
          const next = { ...s.researchCache }
          delete next[topicId]
          return { researchCache: next }
        }),

      savePost: (data) => {
        const post: GeneratedPost = {
          ...data,
          id: uid(),
          createdAt: new Date().toISOString(),
          saved: true,
        }
        set(s => ({ savedPosts: [post, ...s.savedPosts] }))
      },

      deletePost: (id) =>
        set(s => ({ savedPosts: s.savedPosts.filter(p => p.id !== id) })),
    }),
    { name: 'viralflow-store' }
  )
)

export const platformLabels: Record<Platform, string> = {
  twitter: 'X / Twitter',
  linkedin: 'LinkedIn',
  blog: 'Blog Post',
  newsletter: 'Newsletter',
}
