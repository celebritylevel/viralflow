import { useState } from 'react'
import {
  Wand2, Copy, BookmarkPlus, Check, AlertCircle,
  ChevronDown, ChevronUp, Sparkles, Target, RefreshCw
} from 'lucide-react'
import { useStore } from '../store/topics'
import { VIRAL_FORMATS } from '../lib/viral-formats'
import { api } from '../lib/api'
import type { Platform } from '../types'
import clsx from 'clsx'

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'blog', label: 'Blog Post' },
  { id: 'newsletter', label: 'Newsletter' },
]

const CONTENT_TYPES = [
  { id: 'short-post', label: 'Short Post' },
  { id: 'thread', label: 'Thread' },
  { id: 'long-post', label: 'Long Post' },
  { id: 'article', label: 'Article' },
]

export default function GeneratePage() {
  const { topics, activeTopic, researchCache, savePost } = useStore()

  const topic = topics.find(t => t.id === activeTopic)
  const cache = activeTopic ? researchCache[activeTopic] : null

  const [platform, setPlatform] = useState<Platform>('linkedin')
  const [contentType, setContentType] = useState('short-post')
  const [formatId, setFormatId] = useState('hot-take')
  const [selectedTrends, setSelectedTrends] = useState<string[]>([])
  const [selectedPains, setSelectedPains] = useState<string[]>([])
  const [geoOptimized, setGeoOptimized] = useState(false)
  const [customContext, setCustomContext] = useState('')
  const [showFormatPreview, setShowFormatPreview] = useState(false)

  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<{ content: string; hook: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const selectedFormat = VIRAL_FORMATS.find(f => f.id === formatId)
  const availablePlatformFormats = VIRAL_FORMATS.filter(f => f.platforms.includes(platform))

  const trends = cache?.trends?.trends || []
  const painPoints = cache?.painPoints?.pain_points || []

  const toggleTrend = (t: string) =>
    setSelectedTrends(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const togglePain = (p: string) =>
    setSelectedPains(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  const generate = async () => {
    if (!topic) return
    setGenerating(true)
    setError(null)
    setResult(null)
    setSaved(false)
    try {
      const res = await api.generate({
        topicId: topic.id,
        topic,
        trends: selectedTrends,
        painPoints: selectedPains,
        formatId,
        platform,
        contentType: contentType as 'short-post' | 'thread' | 'long-post' | 'article',
        geoOptimized,
        customContext: customContext || undefined,
      })
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const copy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const save = () => {
    if (!result || !topic) return
    savePost({
      topicId: topic.id,
      platform,
      formatId,
      content: result.content,
      hook: result.hook,
    })
    setSaved(true)
  }

  if (!topic) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Target size={40} className="text-text-muted" />
        <div className="text-center">
          <div className="font-semibold text-text-primary">No topic selected</div>
          <div className="text-text-secondary text-sm mt-1">Select a topic from the sidebar to generate content.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-1">Post Generator</h1>
        <p className="text-text-secondary text-sm">
          Combine research insights with proven formats to generate viral content.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left: Config */}
        <div className="col-span-2 space-y-5">

          {/* Platform */}
          <div className="card">
            <label className="label">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={clsx(
                    'py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-150',
                    platform === p.id
                      ? 'bg-accent/15 border-accent/30 text-accent'
                      : 'bg-surface-2 border-border text-text-secondary hover:text-text-primary'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div className="card">
            <label className="label">Content Type</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map(ct => (
                <button
                  key={ct.id}
                  onClick={() => setContentType(ct.id)}
                  className={clsx(
                    'py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-150',
                    contentType === ct.id
                      ? 'bg-accent/15 border-accent/30 text-accent'
                      : 'bg-surface-2 border-border text-text-secondary hover:text-text-primary'
                  )}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="card">
            <label className="label">Viral Format</label>
            <select
              value={formatId}
              onChange={e => setFormatId(e.target.value)}
              className="input mb-2"
            >
              {availablePlatformFormats.map(fmt => (
                <option key={fmt.id} value={fmt.id}>{fmt.name}</option>
              ))}
            </select>
            {selectedFormat && (
              <>
                <p className="text-text-muted text-xs mb-2">{selectedFormat.description}</p>
                <button
                  onClick={() => setShowFormatPreview(!showFormatPreview)}
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent-light transition-colors"
                >
                  {showFormatPreview ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showFormatPreview ? 'Hide' : 'Show'} template
                </button>
                {showFormatPreview && (
                  <pre className="mt-2 text-[11px] text-text-secondary bg-surface-3 rounded-lg p-3 whitespace-pre-wrap overflow-x-auto font-mono leading-relaxed">
                    {selectedFormat.template}
                  </pre>
                )}
              </>
            )}
          </div>

          {/* Trending Topics to inject */}
          {trends.length > 0 && (
            <div className="card">
              <label className="label">Include Trends ({selectedTrends.length} selected)</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {trends.slice(0, 6).map((t, i) => (
                  <button
                    key={i}
                    onClick={() => toggleTrend(t.title)}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded-lg text-xs border transition-all duration-150',
                      selectedTrends.includes(t.title)
                        ? 'bg-amber/10 border-amber/30 text-amber'
                        : 'bg-surface-2 border-border text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <div className="font-medium">{t.title}</div>
                    <div className="text-text-muted mt-0.5 line-clamp-1">{t.content_angle}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pain Points to inject */}
          {painPoints.length > 0 && (
            <div className="card">
              <label className="label">Address Pain Points ({selectedPains.length} selected)</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {painPoints.slice(0, 5).map((pp, i) => (
                  <button
                    key={i}
                    onClick={() => togglePain(pp.pain)}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded-lg text-xs border transition-all duration-150',
                      selectedPains.includes(pp.pain)
                        ? 'bg-red/10 border-red/30 text-red'
                        : 'bg-surface-2 border-border text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <div className="font-medium line-clamp-2">{pp.pain}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GEO + Custom */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text-primary">GEO Optimized</div>
                <div className="text-text-muted text-xs">Structure for AI engine citability</div>
              </div>
              <button
                onClick={() => setGeoOptimized(!geoOptimized)}
                className={clsx(
                  'w-10 h-5 rounded-full transition-all duration-200 relative',
                  geoOptimized ? 'bg-accent' : 'bg-surface-3'
                )}
              >
                <div className={clsx(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200',
                  geoOptimized ? 'left-5' : 'left-0.5'
                )} />
              </button>
            </div>
            <div>
              <label className="label">Custom Context (optional)</label>
              <textarea
                value={customContext}
                onChange={e => setCustomContext(e.target.value)}
                placeholder="Add any specific context, personal story, stats, or angle..."
                className="textarea h-20 text-xs"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={generating}
            className="btn-primary w-full justify-center py-3 text-base"
          >
            {generating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Post
              </>
            )}
          </button>
        </div>

        {/* Right: Output */}
        <div className="col-span-3">
          {error && (
            <div className="p-4 rounded-xl bg-red/10 border border-red/20 text-red text-sm flex items-start gap-2 mb-4">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {generating && (
            <div className="card h-96 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              <div>
                <div className="text-text-primary font-medium text-center">Crafting your post...</div>
                <div className="text-text-muted text-sm text-center mt-1">
                  Combining trends, pain points & format
                </div>
              </div>
            </div>
          )}

          {result && !generating && (
            <div className="animate-slide-up space-y-4">
              {/* Hook */}
              {result.hook && (
                <div className="card bg-gradient-to-r from-accent/10 to-violet/10 border-accent/20">
                  <div className="text-[10px] text-accent uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles size={10} />
                    Opening Hook
                  </div>
                  <p className="text-text-primary font-semibold leading-snug">{result.hook}</p>
                </div>
              )}

              {/* Full post */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wand2 size={16} className="text-accent" />
                    <span className="font-semibold text-text-primary">Generated Post</span>
                    <span className="badge-accent">{platform}</span>
                    <span className="badge-gray">{selectedFormat?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={generate}
                      className="btn-ghost text-xs"
                      title="Regenerate"
                    >
                      <RefreshCw size={13} />
                    </button>
                    <button
                      onClick={save}
                      disabled={saved}
                      className={clsx('btn-secondary text-xs', saved && 'text-green border-green/30')}
                    >
                      {saved ? <Check size={13} /> : <BookmarkPlus size={13} />}
                      {saved ? 'Saved' : 'Save'}
                    </button>
                    <button onClick={copy} className={clsx('btn-primary text-xs', copied && 'bg-green')}>
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="bg-surface-2 rounded-xl p-4 border border-border">
                  <pre className="text-sm text-text-primary whitespace-pre-wrap font-sans leading-relaxed">
                    {result.content}
                  </pre>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-text-muted">
                  <span>{result.content.length} characters</span>
                  <span>{result.content.split('\n').filter(Boolean).length} paragraphs</span>
                </div>
              </div>

              {/* Insights used */}
              {(selectedTrends.length > 0 || selectedPains.length > 0) && (
                <div className="card bg-surface-2/50">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Context Used</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrends.map((t, i) => (
                      <span key={i} className="badge-amber">{t}</span>
                    ))}
                    {selectedPains.map((p, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-red/10 text-red border border-red/20">
                        {p.slice(0, 40)}{p.length > 40 ? '...' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!result && !generating && !error && (
            <div className="card h-96 flex flex-col items-center justify-center gap-4 border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Wand2 size={28} className="text-accent" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-text-primary">Ready to generate</div>
                <div className="text-text-muted text-sm mt-1 max-w-xs">
                  Configure your options on the left and hit Generate. For best results, run Research first to add trend & pain point context.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
