import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createTrade,
  deleteTrade,
  getTradeById,
  getTrades,
  updateTrade,
} from '@/features/trades/api/tradesApi'
import { capitalKeys } from '@/features/capital/hooks/useCapital'

export const tradeKeys = {
  all: ['trades'],
  lists: () => [...tradeKeys.all, 'list'],
  list: () => [...tradeKeys.lists()],
  details: () => [...tradeKeys.all, 'detail'],
  detail: (id) => [...tradeKeys.details(), id],
}

export function useTrades() {
  return useQuery({
    queryKey: tradeKeys.list(),
    queryFn: getTrades,
  })
}

export function useTrade(id) {
  return useQuery({
    queryKey: tradeKeys.detail(id),
    queryFn: () => getTradeById(id),
    enabled: Boolean(id),
  })
}

function invalidateTradeQueries(queryClient, id) {
  queryClient.invalidateQueries({ queryKey: tradeKeys.lists() })
  queryClient.invalidateQueries({ queryKey: capitalKeys.lists() })
  if (id) {
    queryClient.invalidateQueries({ queryKey: tradeKeys.detail(id) })
  }
}

export function useCreateTrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ payload, files }) => createTrade(payload, files),
    onSuccess: () => {
      toast.success('Trade created')
      invalidateTradeQueries(queryClient)
    },
    onError: (error) => {
      toast.error(error.message || 'Unable to create trade')
    },
  })
}

export function useUpdateTrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload, files }) => updateTrade(id, payload, files),
    onSuccess: (data) => {
      toast.success('Trade updated')
      invalidateTradeQueries(queryClient, data?.id)
    },
    onError: (error) => {
      toast.error(error.message || 'Unable to update trade')
    },
  })
}

export function useDeleteTrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTrade,
    onSuccess: () => {
      toast.success('Trade deleted')
      invalidateTradeQueries(queryClient)
    },
    onError: (error) => {
      toast.error(error.message || 'Unable to delete trade')
    },
  })
}
