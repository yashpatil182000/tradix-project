import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createCapitalEntry,
  getCapitalEntries,
} from '@/features/capital/api/capitalApi'
import { buildCapitalSummary } from '@/services/capitalServices'

export const capitalKeys = {
  all: ['capital'],
  lists: () => [...capitalKeys.all, 'list'],
  list: () => [...capitalKeys.lists()],
}

export function useCapitalEntries() {
  return useQuery({
    queryKey: capitalKeys.list(),
    queryFn: getCapitalEntries,
  })
}

export function useCapitalSummary() {
  const query = useCapitalEntries()

  return {
    ...query,
    summary: buildCapitalSummary(query.data ?? []),
  }
}

export function useCreateCapitalEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCapitalEntry,
    onSuccess: () => {
      toast.success('Transaction added')
      queryClient.invalidateQueries({ queryKey: capitalKeys.lists() })
    },
    onError: (error) => {
      toast.error(error.message || 'Unable to add transaction')
    },
  })
}
