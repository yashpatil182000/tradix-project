import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getInstrumentById,
  getInstruments,
  getMasterInstrumentsCatalog,
  setInstrumentEnabled,
} from '@/features/instruments/api/instrumentsApi'
import { invalidateInstrumentRelatedQueries } from '@/lib/queryInvalidation'

export const instrumentKeys = {
  all: ['instruments'],
  lists: () => [...instrumentKeys.all, 'list'],
  list: () => [...instrumentKeys.lists()],
  catalog: () => [...instrumentKeys.all, 'catalog'],
  details: () => [...instrumentKeys.all, 'detail'],
  detail: (id) => [...instrumentKeys.details(), id],
}

/** Enabled instruments for Trade Journal selects. */
export function useInstruments() {
  return useQuery({
    queryKey: instrumentKeys.list(),
    queryFn: getInstruments,
  })
}

/** Full master catalog with enable state for Instrument Management. */
export function useMasterInstrumentsCatalog() {
  return useQuery({
    queryKey: instrumentKeys.catalog(),
    queryFn: getMasterInstrumentsCatalog,
  })
}

export function useInstrument(id) {
  return useQuery({
    queryKey: instrumentKeys.detail(id),
    queryFn: () => getInstrumentById(id),
    enabled: Boolean(id),
  })
}

export function useSetInstrumentEnabled() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ masterInstrumentId, isEnabled }) =>
      setInstrumentEnabled(masterInstrumentId, isEnabled),
    onSuccess: (data) => {
      invalidateInstrumentRelatedQueries(queryClient, data?.id)
      queryClient.invalidateQueries({ queryKey: instrumentKeys.catalog() })
    },
  })
}
