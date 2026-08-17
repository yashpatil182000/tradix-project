import {
  BookMarked,
  Clock3,
  Frown,
  LogIn,
  LogOut,
  TriangleAlert,
} from 'lucide-react'

export const CONFIG_PAGE_SIZE = 8

export const CONFIG_CATEGORIES = [
  {
    key: 'instruments',
    path: 'instruments',
    label: 'Instruments',
    singularLabel: 'Instrument',
    description: 'Your enabled symbols, plus the full master catalog.',
    storage: 'table',
    icon: BookMarked,
  },
  {
    key: 'entry_reasons',
    path: 'entry-reasons',
    label: 'Entry Reasons',
    singularLabel: 'Entry Reason',
    description: 'Common reasons to enter, plus any you add yourself.',
    storage: 'preferences',
    icon: LogIn,
    supportsValue: false,
  },
  {
    key: 'exit_reasons',
    path: 'exit-reasons',
    label: 'Exit Reasons',
    singularLabel: 'Exit Reason',
    description: 'Common reasons to exit, plus any you add yourself.',
    storage: 'preferences',
    icon: LogOut,
    supportsValue: false,
  },
  {
    key: 'timeframes',
    path: 'timeframes',
    label: 'Timeframes',
    singularLabel: 'Timeframe',
    description: 'Standard chart timeframes, plus any you add yourself.',
    storage: 'preferences',
    icon: Clock3,
    supportsValue: false,
  },
  {
    key: 'emotions',
    path: 'emotions',
    label: 'Emotions',
    singularLabel: 'Emotion',
    description: 'Common emotional states, plus any you add yourself.',
    storage: 'preferences',
    icon: Frown,
    supportsValue: false,
  },
  {
    key: 'mistakes',
    path: 'mistakes',
    label: 'Mistakes',
    singularLabel: 'Mistake',
    description: 'Common mistakes to track, plus any you add yourself.',
    storage: 'preferences',
    icon: TriangleAlert,
    supportsValue: false,
  },
]

export function getConfigCategoryByPath(path) {
  return CONFIG_CATEGORIES.find((category) => category.path === path)
}

export function getConfigCategoryByKey(key) {
  return CONFIG_CATEGORIES.find((category) => category.key === key)
}
