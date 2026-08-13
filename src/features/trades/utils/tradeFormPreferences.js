const DIRECTION_KEY = 'tradix-last-trade-direction'
const STYLE_KEY = 'tradix-last-trade-style'
const LOT_STEP_KEY = 'tradix-lot-step'
const LOT_MIN_KEY = 'tradix-lot-min'
const LOT_MAX_KEY = 'tradix-lot-max'

export function getLastTradeDirection(fallback = 'long') {
  const value = localStorage.getItem(DIRECTION_KEY)
  return value === 'long' || value === 'short' ? value : fallback
}

export function setLastTradeDirection(value) {
  localStorage.setItem(DIRECTION_KEY, value)
}

export function getLastTradeStyle(fallback = 'intraday') {
  const value = localStorage.getItem(STYLE_KEY)
  return value === 'scalp' || value === 'intraday' || value === 'swing'
    ? value
    : fallback
}

export function setLastTradeStyle(value) {
  localStorage.setItem(STYLE_KEY, value)
}

export function getLotConfig() {
  return {
    step: Number(localStorage.getItem(LOT_STEP_KEY)) || 0.01,
    min: Number(localStorage.getItem(LOT_MIN_KEY)) || 0.01,
    max: Number(localStorage.getItem(LOT_MAX_KEY)) || 100,
  }
}

export function saveLotConfig({ step, min, max }) {
  if (step != null) localStorage.setItem(LOT_STEP_KEY, String(step))
  if (min != null) localStorage.setItem(LOT_MIN_KEY, String(min))
  if (max != null) localStorage.setItem(LOT_MAX_KEY, String(max))
}
