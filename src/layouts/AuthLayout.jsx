import { Outlet } from 'react-router-dom'
import { SkipLink } from '@/components/shared/PageStates'
import { TradixLogo } from '@/components/shared/TradixLogo'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/40 px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_42%,rgba(59,130,246,0.08),transparent_70%)]"
      />
      <SkipLink />
      <div className="relative z-10 flex w-full flex-col items-center gap-6">
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
