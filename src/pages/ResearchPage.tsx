import { useState } from 'react'
import {
  TrendingUp, AlertCircle, Layout, Globe, RefreshCw,
  ChevronRight, ExternalLink, Flame, Target, Lightbulb, Zap
} from 'lucide-react'
import { useStore } from '../store/topics'
import { api } from '../lib/api'
import { VIRAL_FORMATS } from '../lib/viral-formats'
import clsx from 'clsx'

type Tab = 'trends' | 'painPoints' | 'viralFormats' | 'geoTactics'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'painPoints', label: 'Pain Points', icon: AlertCircle },
  { id: 'viralFormats', label: 'Viral Formats', icon: Layout },
  { id: 'geoTactics', label: 'GEO Tactics', icon: Globe },
]

const MOMENTUM_BADGE: Record<string, string> = {
  high: 'badge-red',
  medium: 'badge-amber',
  low: 'badge-gray',
}

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'badge-red',
  high: 'badge-amber',
  medium: 'badge-gray',
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      <div className="text-text-secondary text-sm">Researching with Perplexity AI...</div>
    </div>
  )
}

function EmptyState({ tab, onResearch, loading }: { tab: Tab; onResearch: () => void; loading: boolean }) {
  const labels: Record<Tab, { title: string; desc: string }> = {
    trends: { title: "What's trending now?", desc: "Research live trends in your topic area using Perplexity's real-time web search." },
    painPoints: { title: 'What keeps them up at night?', desc: 'Uncover the real frustrations your audience faces — the fuel for viral content.' },
    viralFormats: { title: 'What formats are crushing it?', desc: 'Discover which post structures are driving engagement in your niche right now.' },
    geoTactics: { title: 'Optimize for AI engines', desc: 'Learn the latest GEO tactics to make your content citable by ChatGPT, Perplexity, and more.' },
  }
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center">
        <Zap size={28} className="text-text-muted" />
      </div>
      <div className="text-center">
        <div className="font-semibold text-text-primary mb-1">{labels[tab].title}</div>
        <div className="text-text-secondary text-sm max-w-sm">{labels[tab].desc}</div>
      </div>
      <button onClick={onResearch} disabled={loading} className="btn-primary">
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        Run Research
      </button>
    </div>
  )
}

export default function ResearchPage() {
  const { topics, activeTopic, researchCache, setTrendsCache, setPainPointsCache, setViralFormatsCache, setGeoTacticsCache } = useStore()
  const [activeTab, setActiveTab] = useState<Tab>('trends')
  const [loading, setLoading] = useState<Tab | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week')

  const topic = topics.find(t => t.id === activeTopic)
  const cache = activeTopic ? researchCache[activeTopic] : null

  const research = async (tab: Tab) => {
    if (!topic) return
    setLoading(tab)
    setError(null)
    try {
      if (tab === 'trends') {
        const res = await api.trends(topic, timeframe)
        setTrendsCache(topic.id, res)
      } else if (tab === 'painPoints') {
        const res = await api.painPoints(topic)
        setPainPointsCache(topic.id, res)
      } else if (tab === 'viralFormats') {
        const res = await api.viralFormats(topic)
        setViralFormatsCache(topic.id, res)
      } else {
        const res = await api.geoTactics(topic)
        setGeoTacticsCache(topic.id, res)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Research failed')
    } finally {
      setLoading(null)
    }
  }

  if (!topic) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Target size={40} className="text-text-muted" />
        <div className="text-center">
          <div className="font-semibold text-text-primary">No topic selected</div>
          <div className="text-text-secondary text-sm mt-1">Select a topic from the sidebar or create one in Settings.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
            <Target size={12} />
            <span>Research Hub</span>
            <ChevronRight size={12} />
            <span className="text-text-secondary">{topic.name}</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary">{topic.name}</h1>
          <p className="text-text-secondary text-sm mt-1">{topic.targetAudience}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={e => setTimeframe(e.target.value as typeof timeframe)}
            className="input w-auto text-xs py-1.5"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={() => research(activeTab)}
            disabled={loading !== null}
            className="btn-primary text-xs"
          >
            <RefreshCw size={13} className={loading === activeTab ? 'animate-spin' : ''} />
            {cache?.[activeTab] ? 'Refresh' : 'Research'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface p-1 rounded-xl border border-border mb-6">
        {TABS.map(({ id, label, icon: Icon }) => {
          const hasData = !!cache?.[id]
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150',
                activeTab === id
                  ? 'bg-accent text-white shadow-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
              )}
            >
              <Icon size={14} />
              {label}
              {hasData && (
                <span className={clsx(
                  'w-1.5 h-1.5 rounded-full',
                  activeTab === id ? 'bg-white/50' : 'bg-green'
                )} />
              )}
            </button>
          )
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red/10 border border-red/20 text-red text-sm flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Content */}
      {loading === activeTab ? (
        <Spinner />
      ) : (
        <>
          {/* TRENDS TAB */}
          {activeTab === 'trends' && (
            cache?.trends ? (
              <div className="animate-slide-up space-y-4">
                <div className="card bg-surface-2/50">
                  <p className="text-text-secondary text-sm leading-relaxed">{cache.trends.summary}</p>
                  <div className="text-text-muted text-xs mt-2">
                    Researched: {new Date(cache.trends.researched_at).toLocaleString()}
                  </div>
                </div>
                {cache.trends.trends.map((trend, i) => (
                  <div key={i} className="card hover:border-accent/20 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Flame size={14} className="text-amber flex-shrink-0" />
                        <h3 className="font-semibold text-text-primary">{trend.title}</h3>
                      </div>
                      <span className={`${MOMENTUM_BADGE[trend.momentum] || 'badge-gray'} flex-shrink-0`}>
                        {trend.momentum} momentum
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm mb-3">{trend.description}</p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-surface-3 rounded-lg p-3">
                        <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Why Trending</div>
                        <div className="text-sm text-text-secondary">{trend.why_trending}</div>
                      </div>
                      <div className="bg-accent/5 border border-accent/15 rounded-lg p-3">
                        <div className="text-[10px] text-accent uppercase tracking-wider mb-1">Content Angle</div>
                        <div className="text-sm text-text-secondary">{trend.content_angle}</div>
                      </div>
                    </div>
                    {trend.sources && trend.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {trend.sources.slice(0, 3).map((s, si) => (
                          <span key={si} className="flex items-center gap-1 text-[10px] text-text-muted bg-surface-3 px-2 py-1 rounded-full">
                            <ExternalLink size={9} />
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState tab="trends" onResearch={() => research('trends')} loading={loading !== null} />
            )
          )}

          {/* PAIN POINTS TAB */}
          {activeTab === 'painPoints' && (
            cache?.painPoints ? (
              <div className="animate-slide-up space-y-4">
                <div className="card bg-surface-2/50">
                  <p className="text-text-secondary text-sm leading-relaxed">{cache.painPoints.summary}</p>
                </div>

                {cache.painPoints.key_frustrations.length > 0 && (
                  <div className="card">
                    <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Top Frustrations</div>
                    <div className="flex flex-wrap gap-2">
                      {cache.painPoints.key_frustrations.map((f, i) => (
                        <span key={i} className="badge-amber">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {cache.painPoints.pain_points.map((pp, i) => (
                  <div key={i} className="card hover:border-red/20 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={14} className="text-red flex-shrink-0" />
                        <h3 className="font-semibold text-text-primary text-sm">{pp.pain}</h3>
                      </div>
                      <span className={`${SEVERITY_BADGE[pp.severity] || 'badge-gray'} flex-shrink-0`}>
                        {pp.severity}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted mb-3">Audience: {pp.audience}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-3 rounded-lg p-3">
                        <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Opportunity</div>
                        <div className="text-sm text-text-secondary">{pp.opportunity}</div>
                      </div>
                      <div className="bg-green/5 border border-green/15 rounded-lg p-3">
                        <div className="text-[10px] text-green uppercase tracking-wider mb-1">Solution Angle</div>
                        <div className="text-sm text-text-secondary">{pp.solution_angle}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {cache.painPoints.market_gaps.length > 0 && (
                  <div className="card border-violet/20">
                    <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Market Gaps</div>
                    <div className="space-y-2">
                      {cache.painPoints.market_gaps.map((g, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <Lightbulb size={14} className="text-violet flex-shrink-0 mt-0.5" />
                          {g}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState tab="painPoints" onResearch={() => research('painPoints')} loading={loading !== null} />
            )
          )}

          {/* VIRAL FORMATS TAB */}
          {activeTab === 'viralFormats' && (
            <div className="animate-slide-up">
              {/* Library formats */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">Format Library</h3>
                  <span className="text-text-muted text-xs">{VIRAL_FORMATS.length} proven formats</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {VIRAL_FORMATS.slice(0, 6).map((fmt) => (
                    <div key={fmt.id} className="card hover:border-accent/20 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-text-primary text-sm">{fmt.name}</span>
                            <span className="badge-gray text-[10px]">{fmt.engagementType}</span>
                          </div>
                          <p className="text-text-secondary text-xs leading-relaxed mb-2">{fmt.description}</p>
                          <div className="flex items-center gap-2">
                            {fmt.platforms.map(p => (
                              <span key={p} className="badge-accent text-[10px]">{p}</span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-text-muted group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI-Researched formats */}
              {cache?.viralFormats ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="section-title">AI-Researched Formats</h3>
                    <div className="text-text-muted text-xs">
                      {new Date(cache.viralFormats.researched_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="card bg-surface-2/50 mb-4">
                    <p className="text-text-secondary text-sm">{cache.viralFormats.insights}</p>
                  </div>
                  {cache.viralFormats.trending_formats.map((fmt, i) => (
                    <div key={i} className="card mb-3 hover:border-accent/20 transition-colors">
                      <div className="font-semibold text-text-primary mb-2">{fmt.format_name}</div>
                      <p className="text-text-secondary text-sm mb-3">{fmt.why_it_works}</p>
                      <div className="bg-surface-3 rounded-lg p-3 mb-3">
                        <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Template</div>
                        <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono">{fmt.template}</pre>
                      </div>
                      <div className="bg-accent/5 border border-accent/15 rounded-lg p-3">
                        <div className="text-[10px] text-accent uppercase tracking-wider mb-1">Example Hook</div>
                        <div className="text-sm text-text-secondary italic">"{fmt.example_hook}"</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card border-dashed flex items-center justify-between">
                  <div>
                    <div className="font-medium text-text-primary text-sm">Research niche-specific formats</div>
                    <div className="text-text-muted text-xs mt-0.5">Get AI-researched formats trending in your specific topic</div>
                  </div>
                  <button
                    onClick={() => research('viralFormats')}
                    disabled={loading !== null}
                    className="btn-primary text-xs flex-shrink-0"
                  >
                    <RefreshCw size={13} className={loading === 'viralFormats' ? 'animate-spin' : ''} />
                    Research
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GEO TACTICS TAB */}
          {activeTab === 'geoTactics' && (
            cache?.geoTactics ? (
              <div className="animate-slide-up space-y-4">
                <div className="card bg-surface-2/50">
                  <p className="text-text-secondary text-sm">{cache.geoTactics.summary}</p>
                </div>

                {cache.geoTactics.key_principles.length > 0 && (
                  <div className="card border-cyan/20">
                    <div className="text-xs font-semibold text-cyan uppercase tracking-wider mb-3">Key Principles</div>
                    <div className="space-y-2">
                      {cache.geoTactics.key_principles.map((p, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <div className="w-5 h-5 rounded-full bg-cyan/10 text-cyan text-[10px] flex items-center justify-center flex-shrink-0 font-bold">
                            {i + 1}
                          </div>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cache.geoTactics.tactics.map((tactic, i) => (
                  <div key={i} className="card hover:border-cyan/20 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <Globe size={16} className="text-cyan flex-shrink-0 mt-0.5" />
                      <h3 className="font-semibold text-text-primary text-sm">{tactic.tactic}</h3>
                    </div>
                    <p className="text-text-secondary text-sm mb-3">{tactic.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-3 rounded-lg p-3">
                        <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">How to Implement</div>
                        <div className="text-sm text-text-secondary">{tactic.implementation}</div>
                      </div>
                      <div className="bg-cyan/5 border border-cyan/15 rounded-lg p-3">
                        <div className="text-[10px] text-cyan uppercase tracking-wider mb-1">Why AI Engines Love It</div>
                        <div className="text-sm text-text-secondary">{tactic.why_effective}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState tab="geoTactics" onResearch={() => research('geoTactics')} loading={loading !== null} />
            )
          )}
        </>
      )}
    </div>
  )
}
