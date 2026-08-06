import { getCapitalEntries, buildCapitalSummary } from '@/services/capitalServices'
import { getTrades } from '@/services/tradeServices'
import {
  buildCapitalGrowthSeries,
  buildDashboardMetrics,
  buildInstrumentPerformance,
  buildMonthlyProfitSeries,
  buildSetupPerformance,
  getOpenTrades,
  getRecentTrades,
} from '@/features/dashboard/utils/dashboardMetrics'

export async function getDashboardData() {
  const [trades, capitalEntries] = await Promise.all([
    getTrades(),
    getCapitalEntries(),
  ])

  const capitalSummary = buildCapitalSummary(capitalEntries)

  return {
    metrics: buildDashboardMetrics(trades, capitalSummary),
    capitalGrowth: buildCapitalGrowthSeries(capitalEntries),
    monthlyProfit: buildMonthlyProfitSeries(trades),
    instrumentPerformance: buildInstrumentPerformance(trades),
    setupPerformance: buildSetupPerformance(trades),
    recentTrades: getRecentTrades(trades),
    openTrades: getOpenTrades(trades),
  }
}
