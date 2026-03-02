import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Wand2,
  Bookmark,
  Settings,
  Plus,
  Zap,
  Target,
} from 'lucide-react'
import { useStore } from '../../store/topics'
import clsx from 'clsx'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/research', icon: Search, label: 'Research' },
  { to: '/generate', icon: Wand2, label: 'Generate' },
  { to: '/saved', icon: Bookmark, label: 'Saved Posts' },
]

export default function Sidebar() {
  const { topics, activeTopic, setActiveTopic } = useStore()
  const navigate = useNavigate()

  const handleAddTopic = () => {
    navigate('/settings')
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-surface border-r border-border h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-accent">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-text-primary text-sm leading-none">ViralFlow</div>
            <div className="text-text-muted text-[10px] mt-0.5">AI Social Marketer</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 border-b border-border space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-accent/15 text-accent-light border border-accent/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Topics */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            Topics
          </span>
          <button
            onClick={handleAddTopic}
            className="w-5 h-5 rounded flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
            title="Add topic"
          >
            <Plus size={13} />
          </button>
        </div>

        <div className="space-y-1">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                setActiveTopic(topic.id)
                navigate('/research')
              }}
              className={clsx(
                'w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group',
                activeTopic === topic.id
                  ? 'bg-surface-2 border border-border'
                  : 'hover:bg-surface-2'
              )}
            >
              <Target
                size={14}
                className={clsx(
                  'mt-0.5 flex-shrink-0',
                  activeTopic === topic.id ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                )}
              />
              <div className="min-w-0">
                <div
                  className={clsx(
                    'text-xs font-medium leading-snug truncate',
                    activeTopic === topic.id ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                  )}
                >
                  {topic.name}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5 truncate">
                  {topic.platforms.join(', ')}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-3 py-3 border-t border-border">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-accent/15 text-accent-light'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
            )
          }
        >
          <Settings size={16} />
          Settings
        </NavLink>
      </div>
    </aside>
  )
}
