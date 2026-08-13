import { Outlet } from 'react-router-dom'
import { SettingsSidebar } from '@/features/settings/components/SettingsSidebar'

export function SettingsLayout() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col md:min-h-[calc(100svh-3.5rem)] md:flex-row">
      <SettingsSidebar />
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </div>
    </div>
  )
}
