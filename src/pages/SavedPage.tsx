import { useState } from 'react'
import { Copy, Trash2, Check, Bookmark, Search } from 'lucide-react'
import { useStore, platformLabels } from '../store/topics'
import { VIRAL_FORMATS } from '../lib/viral-formats'
import type { Platform } from '../types'

export default function SavedPage() {
  const { savedPosts, deletePost } = useStore()
  const [copied, setCopied] = useState<string | null>(null)
  const [filter, setFilter] = useState<Platform | 'all'>('all')
  const [search, setSearch] = useState('')

  const copy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = savedPosts
    .filter(p => filter === 'all' || p.platform === filter)
    .filter(p =>
      !search ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.hook.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-1">Saved Posts</h1>
        <p className="text-text-secondary text-sm">{savedPosts.length} posts saved across all topics</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="input pl-8 text-sm"
          />
        </div>
        <div className="flex gap-1 bg-surface p-1 rounded-lg border border-border">
          {(['all', 'twitter', 'linkedin', 'blog', 'newsletter'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === p
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {p === 'all' ? 'All' : platformLabels[p as Platform]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Bookmark size={40} className="text-text-muted" />
          <div className="text-center">
            <div className="font-semibold text-text-primary">
              {savedPosts.length === 0 ? 'No saved posts yet' : 'No posts match your filter'}
            </div>
            <div className="text-text-muted text-sm mt-1">
              {savedPosts.length === 0
                ? 'Generate posts and save the best ones to find them here.'
                : 'Try adjusting your search or filter.'}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(post => {
            const fmt = VIRAL_FORMATS.find(f => f.id === post.formatId)
            return (
              <div key={post.id} className="card hover:border-accent/20 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-accent">{platformLabels[post.platform]}</span>
                    {fmt && <span className="badge-gray">{fmt.name}</span>}
                    <span className="text-text-muted text-[10px]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copy(post.id, post.content)}
                      className="btn-ghost py-1.5 px-2 text-xs"
                    >
                      {copied === post.id ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="btn-ghost py-1.5 px-2 text-xs text-red hover:bg-red/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {post.hook && (
                  <div className="text-sm font-semibold text-text-primary mb-2 italic">
                    "{post.hook}"
                  </div>
                )}

                <pre className="text-sm text-text-secondary whitespace-pre-wrap font-sans leading-relaxed line-clamp-6">
                  {post.content}
                </pre>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-text-muted text-xs">{post.content.length} chars</span>
                  <button
                    onClick={() => copy(post.id, post.content)}
                    className="text-xs text-accent hover:text-accent-light transition-colors"
                  >
                    {copied === post.id ? '✓ Copied' : 'Copy full post →'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
