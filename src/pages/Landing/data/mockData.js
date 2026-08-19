export const SAMPLE_TRADE = {
  instrument: 'XAUUSD',
  direction: 'BUY',
  entry: 3365.2,
  stopLoss: 3360.2,
  target: 3375.2,
  exit: 3372.8,
  positionSize: '0.10 lot',
  risk: 50,
  reward: 100,
  rr: '1:2',
  emotion: 'Confident',
  entryReason: 'London breakout retest',
  mistakes: 'None',
  followedRules: true,
  lesson: 'Waited for confirmation — plan held.',
  pnl: 75,
}

export const DASHBOARD_METRICS = {
  capital: 24850,
  todayPnl: 125,
  winRate: 58.3,
  avgRr: 1.85,
  totalTrades: 142,
  monthlyPnl: 1840,
}

export const RECENT_TRADES = [
  { instrument: 'XAUUSD', direction: 'BUY', pnl: 75, rr: '1:2' },
  { instrument: 'EURUSD', direction: 'SELL', pnl: -45, rr: '1:1.5' },
  { instrument: 'NAS100', direction: 'BUY', pnl: 120, rr: '1:3' },
  { instrument: 'GBPUSD', direction: 'SELL', pnl: 55, rr: '1:2' },
]

export const CAPITAL_GROWTH = [
  { month: 'Sep', capital: 18200 },
  { month: 'Oct', capital: 19100 },
  { month: 'Nov', capital: 20500 },
  { month: 'Dec', capital: 19800 },
  { month: 'Jan', capital: 22100 },
  { month: 'Feb', capital: 23600 },
  { month: 'Mar', capital: 24850 },
]

export const WIN_RATE_DATA = [
  { label: 'Wins', value: 58, color: 'var(--chart-profit)' },
  { label: 'Losses', value: 42, color: 'var(--chart-loss)' },
]

export const PNL_BY_MONTH = [
  { month: 'Oct', pnl: 420 },
  { month: 'Nov', pnl: 680 },
  { month: 'Dec', pnl: -320 },
  { month: 'Jan', pnl: 890 },
  { month: 'Feb', pnl: 540 },
  { month: 'Mar', pnl: 720 },
]

export const INSTRUMENT_PERFORMANCE = [
  { name: 'XAUUSD', pnl: 1240 },
  { name: 'EURUSD', pnl: 680 },
  { name: 'NAS100', pnl: 420 },
  { name: 'GBPUSD', pnl: -180 },
]

export const SETUP_PERFORMANCE = [
  { name: 'Breakout', pnl: 980 },
  { name: 'Pullback', pnl: 640 },
  { name: 'Range', pnl: 210 },
  { name: 'Reversal', pnl: -90 },
]

export const BEHAVIORAL_INSIGHTS = [
  {
    title: 'Planned setups perform better',
    insight:
      'You perform better when trading your planned setups.',
    metric: '+18% win rate',
    trend: [42, 48, 52, 55, 58],
  },
  {
    title: 'Revenge trading pattern',
    insight:
      'Your largest losses happen after consecutive losing trades.',
    metric: '3-trade streak',
    trend: [20, 35, 55, 40, 25],
  },
  {
    title: 'Late entries in volatility',
    insight:
      'You tend to enter late during high-volatility sessions.',
    metric: 'London open',
    trend: [30, 45, 62, 58, 50],
  },
]

export const HERO_CHART_POINTS = [
  { x: 0, y: 42 },
  { x: 1, y: 38 },
  { x: 2, y: 45 },
  { x: 3, y: 41 },
  { x: 4, y: 48 },
  { x: 5, y: 44 },
  { x: 6, y: 52 },
  { x: 7, y: 49 },
  { x: 8, y: 55 },
  { x: 9, y: 58 },
]
