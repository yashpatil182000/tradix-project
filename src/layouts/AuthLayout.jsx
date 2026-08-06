import { Outlet } from 'react-router-dom'
import { SkipLink } from '@/components/shared/PageStates'
import { TradixLogo } from '@/components/shared/TradixLogo'

export function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 px-4 py-10">
      <SkipLink />
      <div className="flex w-full flex-col items-center gap-6">
        <div className="text-center">
          <TradixLogo as="p" size="xl" />
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Trading Journal
          </p>
        </div>
        <main id="main-content" className="w-full max-w-md" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
