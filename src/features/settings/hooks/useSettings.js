import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { invalidateSettingsRelatedQueries } from '@/lib/queryInvalidation'
import {
  createConfigOption,
  deleteConfigOption,
  getMasterConfigCatalog,
  getSettings,
  getYourConfigOptions,
  setConfigOptionEnabled,
  updateConfigOption,
} from '@/features/settings/api/settingsApi'

export const settingsKeys = {
  all: ['settings'],
  detail: () => [...settingsKeys.all, 'detail'],
  catalog: (categoryKey) => [...settingsKeys.all, 'catalog', categoryKey],
  yours: (categoryKey) => [...settingsKeys.all, 'yours', categoryKey],
}

export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: getSettings,
  })
}

export function useConfigOptions(categoryKey) {
  const query = useSettings()

  return {
    ...query,
    data: query.data?.preferences?.[categoryKey] ?? [],
  }
}

export function useYourConfigOptions(categoryKey) {
  return useQuery({
    queryKey: settingsKeys.yours(categoryKey),
    queryFn: () => getYourConfigOptions(categoryKey),
    enabled: Boolean(categoryKey),
  })
}

export function useMasterConfigCatalog(categoryKey) {
  return useQuery({
    queryKey: settingsKeys.catalog(categoryKey),
    queryFn: () => getMasterConfigCatalog(categoryKey),
    enabled: Boolean(categoryKey),
  })
}

function updatePreferencesCache(queryClient, settings) {
  queryClient.setQueryData(settingsKeys.detail(), settings)
}

export function useCreateConfigOption(categoryKey) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => createConfigOption(categoryKey, payload),
    onError: (error) => {
      toast.error(error.message || 'Unable to create item')
    },
    onSuccess: (result) => {
      updatePreferencesCache(queryClient, result.settings)
      toast.success('Item created')
    },
    onSettled: () => {
      invalidateSettingsRelatedQueries(queryClient)
    },
  })
}

export function useUpdateConfigOption(categoryKey) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) =>
      updateConfigOption(categoryKey, id, payload),
    onError: (error) => {
      toast.error(error.message || 'Unable to update item')
    },
    onSuccess: (result) => {
      updatePreferencesCache(queryClient, result.settings)
      toast.success('Item updated')
    },
    onSettled: () => {
      invalidateSettingsRelatedQueries(queryClient)
    },
  })
}

export function useDeleteConfigOption(categoryKey) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deleteConfigOption(categoryKey, id),
    onError: (error) => {
      toast.error(error.message || 'Unable to delete item')
    },
    onSuccess: (result) => {
      updatePreferencesCache(queryClient, result.settings)
      toast.success('Item deleted')
    },
    onSettled: () => {
      invalidateSettingsRelatedQueries(queryClient)
    },
  })
}

export function useSetConfigOptionEnabled(categoryKey) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ masterId, isEnabled }) =>
      setConfigOptionEnabled(categoryKey, masterId, isEnabled),
    onSettled: () => {
      invalidateSettingsRelatedQueries(queryClient)
    },
  })
}
