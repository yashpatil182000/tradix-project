import {
  BookMarked,
  Clock3,
  Frown,
  LogIn,
  LogOut,
  Scale,
  TriangleAlert,
} from 'lucide-react'

export const CONFIG_PAGE_SIZE = 8

export const CONFIG_CATEGORIES = [
  {
    key: 'instruments',
    path: 'instruments',
    label: 'Instruments',
    singularLabel: 'Instrument',
    description: 'Enable markets and symbols from the master catalog.',
    storage: 'table',
    icon: BookMarked,
  },
  {
    key: 'entry_reasons',
    path: 'entry-reasons',
    label: 'Entry Reasons',
    singularLabel: 'Entry Reason',
    description: 'Why you entered a trade.',
    storage: 'preferences',
    icon: LogIn,
    supportsValue: false,
  },
  {
    key: 'exit_reasons',
    path: 'exit-reasons',
    label: 'Exit Reasons',
    singularLabel: 'Exit Reason',
    description: 'Why you exited a trade.',
    storage: 'preferences',
    icon: LogOut,
    supportsValue: false,
  },
  {
    key: 'timeframes',
    path: 'timeframes',
    label: 'Timeframes',
    singularLabel: 'Timeframe',
    description: 'Chart and trade timeframes.',
    storage: 'preferences',
    icon: Clock3,
    supportsValue: false,
  },
  {
    key: 'emotions',
    path: 'emotions',
    label: 'Emotions',
    singularLabel: 'Emotion',
    description: 'Emotional states during trades.',
    storage: 'preferences',
    icon: Frown,
    supportsValue: false,
  },
  {
    key: 'mistakes',
    path: 'mistakes',
    label: 'Mistakes',
    singularLabel: 'Mistake',
    description: 'Common trading mistakes to track.',
    storage: 'preferences',
    icon: TriangleAlert,
    supportsValue: false,
  },
  {
    key: 'position_sizes',
    path: 'position-sizes',
    label: 'Position Sizes',
    singularLabel: 'Position Size',
    description: 'Reusable position size presets.',
    storage: 'preferences',
    icon: Scale,
    supportsValue: true,
  },
]

export function getConfigCategoryByPath(path) {
  return CONFIG_CATEGORIES.find((category) => category.path === path)
}

export function getConfigCategoryByKey(key) {
  return CONFIG_CATEGORIES.find((category) => category.key === key)
}
