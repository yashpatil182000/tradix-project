import { useQuery } from '@tanstack/react-query'
import { getReportsSourceData } from '@/features/reports/api/reportsApi'

export const reportKeys = {
  all: ['reports'],
  source: () => [...reportKeys.all, 'source'],
}

export function useReportsSource() {
  return useQuery({
    queryKey: reportKeys.source(),
    queryFn: getReportsSourceData,
  })
}
