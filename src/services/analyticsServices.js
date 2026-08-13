import { getCapitalEntries, buildCapitalSummary } from '@/services/capitalServices'
import { getTrades } from '@/services/tradeServices'

export async function getAnalyticsSourceData() {
  const [trades, capitalEntries] = await Promise.all([
    getTrades(),
    getCapitalEntries(),
  ])

  return {
    trades,
    capitalEntries,
    capitalSummary: buildCapitalSummary(capitalEntries),
  }
}
