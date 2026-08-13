import { NavLink } from 'react-router-dom'
import { CONFIG_CATEGORIES } from '@/features/settings/constants/configCategories'
import { ROUTES } from '@/routes/paths'
import { cn } from '@/lib/utils'

export function SettingsSidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-border md:w-60 md:border-r md:border-b-0">
      <div className="px-4 py-4 md:px-3">
        <p className="mb-3 text-caption font-medium tracking-wide text-muted-foreground uppercase">
          Configuration
        </p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {CONFIG_CATEGORIES.map((category) => {
            const Icon = category.icon
            const to = `${ROUTES.SETTINGS}/${category.path}`

            return (
              <NavLink
                key={category.key}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-control px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-hover hover:text-foreground',
                  )
                }
              >
                <Icon className="size-4 shrink-0" />
                <span>{category.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
