import { useQuery } from '@tanstack/react-query'
import { getAnalyticsSourceData } from '@/features/analytics/api/analyticsApi'

export const analyticsKeys = {
  all: ['analytics'],
  source: () => [...analyticsKeys.all, 'source'],
}

export function useAnalyticsSource() {
  return useQuery({
    queryKey: analyticsKeys.source(),
    queryFn: getAnalyticsSourceData,
  })
}
