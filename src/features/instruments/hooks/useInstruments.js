import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createInstrument,
  deleteInstrument,
  getInstrumentById,
  getInstruments,
  updateInstrument,
} from '@/features/instruments/api/instrumentsApi'

export const instrumentKeys = {
  all: ['instruments'],
  lists: () => [...instrumentKeys.all, 'list'],
  list: () => [...instrumentKeys.lists()],
  details: () => [...instrumentKeys.all, 'detail'],
  detail: (id) => [...instrumentKeys.details(), id],
}

export function useInstruments() {
  return useQuery({
    queryKey: instrumentKeys.list(),
    queryFn: getInstruments,
  })
}

export function useInstrument(id) {
  return useQuery({
    queryKey: instrumentKeys.detail(id),
    queryFn: () => getInstrumentById(id),
    enabled: Boolean(id),
  })
}

export function useCreateInstrument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instrumentKeys.lists() })
    },
  })
}

export function useUpdateInstrument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) => updateInstrument(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: instrumentKeys.lists() })
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: instrumentKeys.detail(data.id),
        })
      }
    },
  })
}

export function useDeleteInstrument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instrumentKeys.lists() })
    },
  })
}
