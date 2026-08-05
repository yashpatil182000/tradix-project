import { Link, NavLink, Outlet } from 'react-router-dom'
import { PanelLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import {
  AppContent,
  AppHeader,
  AppShell,
  AppSidebar,
  useSidebar,
} from '@/components/shared/layout/AppShell'
import { useUser } from '@/context/UserContext'
import { ROUTES } from '@/routes/paths'
import { cn } from '@/lib/utils'

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Home' },
  { to: ROUTES.CAPITAL, label: 'Capital' },
  { to: ROUTES.INSTRUMENTS, label: 'Instruments' },
  { to: ROUTES.SETTINGS, label: 'Settings' },
]

function SidebarNav() {
  const { collapsed } = useSidebar()

  return (
    <nav className="flex flex-1 flex-col gap-1 p-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          data-nav-item="true"
          className={cn(
            'rounded-control px-3 py-2 text-sm font-medium transition-colors',
            collapsed && 'px-0 text-center',
          )}
          title={item.label}
        >
          {collapsed ? item.label.charAt(0) : item.label}
        </NavLink>
      ))}
    </nav>
  )
}

function HeaderActions() {
  const { user, logout } = useUser()
  const { toggle } = useSidebar()

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hidden md:inline-flex"
        onClick={toggle}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="size-4" />
      </Button>

      <Link to={ROUTES.DASHBOARD} className="text-heading-4">
        Tradix
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-small text-muted-foreground sm:inline">
          {user?.email}
        </span>
        <ThemeToggle />
        <Button type="button" variant="outline" size="sm" onClick={logout}>
          Log out
        </Button>
      </div>
    </>
  )
}

export function AppLayout() {
  return (
    <AppShell>
      <AppSidebar>
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <span className="text-heading-4">Tradix</span>
        </div>
        <SidebarNav />
      </AppSidebar>

      <AppContent>
        <AppHeader>
          <HeaderActions />
        </AppHeader>

        <div className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-control px-3 py-1.5 text-small font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="min-h-0 flex-1">
          <Outlet />
        </div>
      </AppContent>
    </AppShell>
  )
}
