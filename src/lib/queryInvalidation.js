/**
 * Shared query invalidation helpers so mutations stay consistent.
 */
export function invalidateAppDataQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  queryClient.invalidateQueries({ queryKey: ['analytics'] })
  queryClient.invalidateQueries({ queryKey: ['reports'] })
  queryClient.invalidateQueries({ queryKey: ['trades'] })
  queryClient.invalidateQueries({ queryKey: ['capital'] })
}

export function invalidateTradeRelatedQueries(queryClient, tradeId) {
  queryClient.invalidateQueries({ queryKey: ['trades'] })
  queryClient.invalidateQueries({ queryKey: ['capital'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  queryClient.invalidateQueries({ queryKey: ['analytics'] })
  queryClient.invalidateQueries({ queryKey: ['reports'] })
  if (tradeId) {
    queryClient.invalidateQueries({ queryKey: ['trades', 'detail', tradeId] })
  }
}

export function invalidateCapitalRelatedQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['capital'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  queryClient.invalidateQueries({ queryKey: ['analytics'] })
  queryClient.invalidateQueries({ queryKey: ['reports'] })
}

export function invalidateInstrumentRelatedQueries(queryClient, instrumentId) {
  queryClient.invalidateQueries({ queryKey: ['instruments'] })
  queryClient.invalidateQueries({ queryKey: ['trades'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  queryClient.invalidateQueries({ queryKey: ['analytics'] })
  queryClient.invalidateQueries({ queryKey: ['reports'] })
  if (instrumentId) {
    queryClient.invalidateQueries({
      queryKey: ['instruments', 'detail', instrumentId],
    })
  }
  queryClient.invalidateQueries({ queryKey: ['instruments', 'catalog'] })
}

export function invalidateSettingsRelatedQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['settings'] })
  queryClient.invalidateQueries({ queryKey: ['analytics'] })
  queryClient.invalidateQueries({ queryKey: ['reports'] })
}
