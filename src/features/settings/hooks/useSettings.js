import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { invalidateSettingsRelatedQueries } from '@/lib/queryInvalidation'
import {
  createConfigOption,
  deleteConfigOption,
  getSettings,
  updateConfigOption,
} from '@/features/settings/api/settingsApi'

export const settingsKeys = {
  all: ['settings'],
  detail: () => [...settingsKeys.all, 'detail'],
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

function updatePreferencesCache(queryClient, settings) {
  queryClient.setQueryData(settingsKeys.detail(), settings)
}

export function useCreateConfigOption(categoryKey) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => createConfigOption(categoryKey, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: settingsKeys.detail() })
      const previous = queryClient.getQueryData(settingsKeys.detail())

      if (previous) {
        const optimisticItem = {
          id: `temp-${crypto.randomUUID()}`,
          label: payload.label.trim(),
          description: payload.description?.trim() || null,
          value: payload.value?.trim?.() ? payload.value.trim() : null,
          is_active: payload.is_active ?? true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        queryClient.setQueryData(settingsKeys.detail(), {
          ...previous,
          preferences: {
            ...previous.preferences,
            [categoryKey]: [
              ...(previous.preferences?.[categoryKey] ?? []),
              optimisticItem,
            ],
          },
        })
      }

      return { previous }
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(settingsKeys.detail(), context.previous)
      }
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
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: settingsKeys.detail() })
      const previous = queryClient.getQueryData(settingsKeys.detail())

      if (previous) {
        const list = previous.preferences?.[categoryKey] ?? []
        queryClient.setQueryData(settingsKeys.detail(), {
          ...previous,
          preferences: {
            ...previous.preferences,
            [categoryKey]: list.map((item) =>
              item.id === id
                ? {
                    ...item,
                    label: payload.label.trim(),
                    description: payload.description?.trim() || null,
                    value: payload.value?.trim?.()
                      ? payload.value.trim()
                      : null,
                    is_active: payload.is_active ?? true,
                    updated_at: new Date().toISOString(),
                  }
                : item,
            ),
          },
        })
      }

      return { previous }
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(settingsKeys.detail(), context.previous)
      }
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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: settingsKeys.detail() })
      const previous = queryClient.getQueryData(settingsKeys.detail())

      if (previous) {
        queryClient.setQueryData(settingsKeys.detail(), {
          ...previous,
          preferences: {
            ...previous.preferences,
            [categoryKey]: (previous.preferences?.[categoryKey] ?? []).filter(
              (item) => item.id !== id,
            ),
          },
        })
      }

      return { previous }
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(settingsKeys.detail(), context.previous)
      }
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
