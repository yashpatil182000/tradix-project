import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { ROUTES } from '@/routes/paths'

export function LandingRoute() {
  const { isAuthenticated, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#0B0B0C] text-sm text-[#A1A1AA]">
        Loading...
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}
