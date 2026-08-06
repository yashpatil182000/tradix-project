import { useQuery } from '@tanstack/react-query'
import { getDashboardData } from '@/features/dashboard/api/dashboardApi'

export const dashboardKeys = {
  all: ['dashboard'],
  detail: () => [...dashboardKeys.all, 'detail'],
}

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.detail(),
    queryFn: getDashboardData,
  })
}
