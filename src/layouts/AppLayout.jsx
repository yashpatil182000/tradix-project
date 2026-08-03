import { Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/UserContext'

export function AppLayout() {
  const { user, logout } = useUser()

  return (
    <div className="min-h-svh bg-background">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <p className="font-semibold tracking-tight">Tradix</p>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user?.email}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
