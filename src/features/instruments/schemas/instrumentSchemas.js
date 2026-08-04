import { z } from 'zod'

export const INSTRUMENT_TYPES = [
  'stock',
  'forex',
  'crypto',
  'futures',
  'options',
  'index',
  'other',
]

export const instrumentSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1, 'Symbol is required')
    .max(32, 'Symbol is too long'),
  name: z.string().trim().max(120, 'Name is too long').optional().or(z.literal('')),
  type: z.enum(INSTRUMENT_TYPES, {
    required_error: 'Type is required',
  }),
  exchange: z
    .string()
    .trim()
    .max(64, 'Exchange is too long')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean().default(true),
})
