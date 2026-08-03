import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { ROUTES } from '@/routes/paths'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Loading session...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
