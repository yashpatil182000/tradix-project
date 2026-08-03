import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 px-4 py-10">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-2xl font-semibold tracking-tight">Tradix</p>
          <p className="text-sm text-muted-foreground">Trading Journal</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
