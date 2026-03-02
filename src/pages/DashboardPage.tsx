import { useNavigate } from 'react-router-dom'
import { Search, Wand2, TrendingUp, Zap, Target, BookOpen, ArrowRight, Plus } from 'lucide-react'
import { useStore } from '../store/topics'

export default function DashboardPage() {
  const { topics, activeTopic, setActiveTopic, researchCache, savedPosts } = useStore()
  const navigate = useNavigate()

  const activeTopic_ = topics.find(t => t.id === activeTopic)
  const cache = activeTopic ? researchCache[activeTopic] : null

  const researchedCount = cache
    ? [cache.trends, cache.painPoints, cache.viralFormats, cache.geoTactics].filter(Boolean).length
    : 0

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Command Center</h1>
        <p className="text-text-secondary text-sm">
          Research trends, study virality, and generate content that converts.
        </p>
      </div>

      {/* Active Topic Banner */}
      {activeTopic_ && (
        <div className="card mb-8 bg-gradient-to-r from-accent/10 to-violet/10 border-accent/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Target size={20} className="text-accent" />
              </div>
              <div>
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Active Topic</div>
                <h2 className="text-lg font-bold text-text-primary">{activeTopic_.name}</h2>
                <p className="text-text-secondary text-sm mt-1">{activeTopic_.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeTopic_.keywords.slice(0, 5).map(kw => (
                    <span key={kw} className="badge-accent">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-accent">{researchedCount}/4</div>
              <div className="text-xs text-text-muted">areas researched</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate('/research')}
          className="card hover:border-accent/30 hover:shadow-accent transition-all duration-200 text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
              <Search size={20} className="text-cyan" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-text-primary mb-1">Research Hub</div>
              <p className="text-text-secondary text-sm">
                Find trends, pain points, viral formats & GEO tactics with live Perplexity research.
              </p>
            </div>
            <ArrowRight size={16} className="text-text-muted group-hover:text-accent transition-colors mt-1" />
          </div>
        </button>

        <button
          onClick={() => navigate('/generate')}
          className="card hover:border-accent/30 hover:shadow-accent transition-all duration-200 text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Wand2 size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-text-primary mb-1">Post Generator</div>
              <p className="text-text-secondary text-sm">
                Generate viral posts using trending insights + proven formats for your platform.
              </p>
            </div>
            <ArrowRight size={16} className="text-text-muted group-hover:text-accent transition-colors mt-1" />
          </div>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Topics Defined', value: topics.length, icon: Target, color: 'text-accent' },
          { label: 'Research Runs', value: Object.values(researchCache).reduce((a, c) => a + [c?.trends, c?.painPoints, c?.viralFormats, c?.geoTactics].filter(Boolean).length, 0), icon: Search, color: 'text-cyan' },
          { label: 'Posts Saved', value: savedPosts.length, icon: BookOpen, color: 'text-green' },
          { label: 'Viral Formats', value: 15, icon: TrendingUp, color: 'text-amber' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-text-muted text-xs">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <div className="text-2xl font-bold text-text-primary">{value}</div>
          </div>
        ))}
      </div>

      {/* Topics Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="section-title">Your Topics</h3>
            <p className="section-subtitle mt-0.5">Click to switch active topic for research & generation</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="btn-secondary text-xs"
          >
            <Plus size={14} />
            Add Topic
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {topics.map((topic) => {
            const c = researchCache[topic.id]
            const done = c ? [c.trends, c.painPoints, c.viralFormats, c.geoTactics].filter(Boolean).length : 0
            return (
              <div
                key={topic.id}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                  activeTopic === topic.id
                    ? 'border-accent/30 bg-accent/5'
                    : 'border-border hover:border-border/80 hover:bg-surface-2'
                }`}
                onClick={() => {
                  setActiveTopic(topic.id)
                  navigate('/research')
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activeTopic === topic.id ? 'bg-accent' : 'bg-text-muted'}`} />
                  <div>
                    <div className="font-medium text-text-primary text-sm">{topic.name}</div>
                    <div className="text-text-muted text-xs mt-0.5">
                      {topic.targetAudience} · {topic.platforms.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-text-primary">{done}/4</div>
                    <div className="text-text-muted text-[10px]">researched</div>
                  </div>
                  <div className="flex gap-1">
                    {(['trends', 'painPoints', 'viralFormats', 'geoTactics'] as const).map(key => (
                      <div
                        key={key}
                        className={`w-2 h-2 rounded-full ${c?.[key] ? 'bg-green' : 'bg-surface-3'}`}
                        title={key}
                      />
                    ))}
                  </div>
                  <Zap
                    size={16}
                    className={activeTopic === topic.id ? 'text-accent' : 'text-text-muted'}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
