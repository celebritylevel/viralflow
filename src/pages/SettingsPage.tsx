import { useState } from 'react'
import { Plus, Trash2, Save, X, Edit2, AlertCircle } from 'lucide-react'
import { useStore } from '../store/topics'
import type { Topic, Platform } from '../types'
import clsx from 'clsx'

const VOICE_OPTIONS = [
  { id: 'professional', label: 'Professional', desc: 'Authoritative, data-driven, no fluff' },
  { id: 'casual', label: 'Casual', desc: 'Conversational, friendly, approachable' },
  { id: 'bold', label: 'Bold', desc: 'Direct, strong opinions, contrarian' },
  { id: 'educational', label: 'Educational', desc: 'Teaching-focused, clear, structured' },
  { id: 'storytelling', label: 'Storytelling', desc: 'Narrative, emotional, human' },
] as const

const PLATFORM_OPTIONS: { id: Platform; label: string }[] = [
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'blog', label: 'Blog' },
  { id: 'newsletter', label: 'Newsletter' },
]

const EMPTY_FORM = {
  name: '',
  description: '',
  keywords: '',
  targetAudience: '',
  brandVoice: 'bold' as Topic['brandVoice'],
  platforms: ['linkedin', 'twitter'] as Platform[],
}

export default function SettingsPage() {
  const { topics, addTopic, updateTopic, deleteTopic, activeTopic, setActiveTopic, clearCache } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const startEdit = (topic: Topic) => {
    setForm({
      name: topic.name,
      description: topic.description,
      keywords: topic.keywords.join(', '),
      targetAudience: topic.targetAudience,
      brandVoice: topic.brandVoice,
      platforms: topic.platforms,
    })
    setEditingId(topic.id)
    setShowAdd(false)
  }

  const startAdd = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowAdd(true)
  }

  const cancel = () => {
    setEditingId(null)
    setShowAdd(false)
    setForm(EMPTY_FORM)
  }

  const save = () => {
    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
      targetAudience: form.targetAudience.trim(),
      brandVoice: form.brandVoice,
      platforms: form.platforms,
    }
    if (!data.name) return

    if (editingId) {
      updateTopic(editingId, data)
    } else {
      addTopic(data)
    }
    cancel()
  }

  const togglePlatform = (p: Platform) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p],
    }))
  }

  const handleDelete = (id: string) => {
    deleteTopic(id)
    clearCache(id)
    setDeleteConfirm(null)
  }

  const TopicForm = () => (
    <div className="card border-accent/20 bg-accent/5 mt-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <label className="label">Topic Name *</label>
          <input
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="e.g. AI Agents for GTM Teams"
            className="input"
          />
        </div>
        <div className="col-span-2">
          <label className="label">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="What is this topic about? What makes it unique?"
            className="textarea h-20"
          />
        </div>
        <div className="col-span-2">
          <label className="label">Keywords (comma-separated)</label>
          <input
            value={form.keywords}
            onChange={e => setForm(p => ({ ...p, keywords: e.target.value }))}
            placeholder="Claude Code, AI agents, GTM, sales automation..."
            className="input"
          />
        </div>
        <div className="col-span-2">
          <label className="label">Target Audience</label>
          <input
            value={form.targetAudience}
            onChange={e => setForm(p => ({ ...p, targetAudience: e.target.value }))}
            placeholder="e.g. VP of Sales, RevOps leaders, GTM founders"
            className="input"
          />
        </div>
        <div>
          <label className="label">Brand Voice</label>
          <select
            value={form.brandVoice}
            onChange={e => setForm(p => ({ ...p, brandVoice: e.target.value as Topic['brandVoice'] }))}
            className="input"
          >
            {VOICE_OPTIONS.map(v => (
              <option key={v.id} value={v.id}>{v.label} — {v.desc}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePlatform(p.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  form.platforms.includes(p.id)
                    ? 'bg-accent/15 border-accent/30 text-accent'
                    : 'bg-surface-2 border-border text-text-secondary hover:text-text-primary'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={save} disabled={!form.name.trim()} className="btn-primary">
          <Save size={14} />
          {editingId ? 'Save Changes' : 'Create Topic'}
        </button>
        <button onClick={cancel} className="btn-secondary">
          <X size={14} />
          Cancel
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-text-primary mb-1">Settings</h1>
        <p className="text-text-secondary text-sm">Manage your research topics and content preferences.</p>
      </div>

      {/* Topics */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Research Topics</h2>
            <p className="section-subtitle mt-0.5">Define the areas you want to create content about</p>
          </div>
          <button onClick={startAdd} className="btn-primary text-sm">
            <Plus size={15} />
            New Topic
          </button>
        </div>

        {showAdd && !editingId && <TopicForm />}

        <div className="space-y-3 mt-4">
          {topics.map(topic => (
            <div key={topic.id}>
              <div className={clsx(
                'card transition-all',
                activeTopic === topic.id && 'border-accent/30'
              )}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {activeTopic === topic.id && (
                        <span className="badge-accent text-[10px]">Active</span>
                      )}
                      <h3 className="font-semibold text-text-primary">{topic.name}</h3>
                    </div>
                    <p className="text-text-secondary text-sm mb-2 line-clamp-1">{topic.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge-gray">{topic.brandVoice}</span>
                      {topic.platforms.map(p => (
                        <span key={p} className="badge-accent text-[10px]">{p}</span>
                      ))}
                      {topic.keywords.slice(0, 3).map(k => (
                        <span key={k} className="badge-gray text-[10px]">{k}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {activeTopic !== topic.id && (
                      <button
                        onClick={() => setActiveTopic(topic.id)}
                        className="btn-secondary text-xs py-1.5"
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(topic)}
                      className="btn-ghost py-1.5 px-2"
                    >
                      <Edit2 size={13} />
                    </button>
                    {topics.length > 1 && (
                      <button
                        onClick={() => setDeleteConfirm(topic.id)}
                        className="btn-ghost py-1.5 px-2 text-red hover:bg-red/10"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {deleteConfirm === topic.id && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-3">
                    <AlertCircle size={14} className="text-red flex-shrink-0" />
                    <span className="text-sm text-text-secondary flex-1">
                      Delete "{topic.name}" and all its research cache?
                    </span>
                    <button onClick={() => handleDelete(topic.id)} className="btn-danger text-xs">
                      Delete
                    </button>
                    <button onClick={() => setDeleteConfirm(null)} className="btn-secondary text-xs">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {editingId === topic.id && <TopicForm />}
            </div>
          ))}
        </div>
      </section>

      {/* Brand Voice Guide */}
      <section className="card">
        <h2 className="section-title mb-1">Brand Voice Guide</h2>
        <p className="section-subtitle mb-4">How each voice style affects your generated content</p>
        <div className="space-y-3">
          {VOICE_OPTIONS.map(v => (
            <div key={v.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-2">
              <span className="badge-accent text-[10px] flex-shrink-0 mt-0.5">{v.label}</span>
              <span className="text-text-secondary text-sm">{v.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
