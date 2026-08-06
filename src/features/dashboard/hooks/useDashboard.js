import { useQuery } from '@tanstack/react-query'
import { getDashboardData } from '@/features/dashboard/api/dashboardApi'
import { capitalKeys } from '@/features/capital/hooks/useCapital'
import { tradeKeys } from '@/features/trades/hooks/useTrades'

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

export function invalidateDashboardQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
  queryClient.invalidateQueries({ queryKey: tradeKeys.lists() })
  queryClient.invalidateQueries({ queryKey: capitalKeys.lists() })
}
