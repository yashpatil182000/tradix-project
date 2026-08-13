import { createContext, useContext, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const SidebarContext = createContext(null)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within AppShell')
  }
  return context
}

export function AppShell({
  children,
  className,
  defaultCollapsed = false,
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
      toggle: () => setCollapsed((prev) => !prev),
    }),
    [collapsed],
  )

  return (
    <SidebarContext.Provider value={value}>
      <div
        className={cn(
          'flex min-h-svh w-full bg-background text-foreground',
          className,
        )}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function AppSidebar({ children, className }) {
  const { collapsed } = useSidebar()

  return (
    <aside
      data-slot="sidebar"
      data-collapsed={collapsed ? 'true' : 'false'}
      className={cn(
        'sticky top-0 hidden h-svh shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex md:flex-col',
        collapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      {children}
    </aside>
  )
}

export function AppHeader({ children, className }) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-none sm:px-6',
        className,
      )}
    >
      {children}
    </header>
  )
}

export function AppContent({ children, className }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className={cn('flex-1 overflow-y-auto', className)}>{children}</div>
    </div>
  )
}
