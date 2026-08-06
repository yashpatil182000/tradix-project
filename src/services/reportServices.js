import { getTrades } from '@/services/tradeServices'

export async function getReportsSourceData() {
  const trades = await getTrades()
  return { trades }
}
