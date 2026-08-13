import { z } from 'zod'

export const TRADE_STATUSES = ['open', 'closed', 'cancelled']
export const TRADE_DIRECTIONS = ['long', 'short']
export const TRADE_STYLES = ['scalp', 'intraday', 'swing']

const optionalNumber = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? undefined : value),
  z.coerce.number().optional(),
)

const requiredNumber = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? undefined : value),
  z.coerce.number({ required_error: 'This field is required' }),
)

export const tradeSchema = z
  .object({
    entry_at: z.string().min(1, 'Date and time is required'),
    instrument_id: z.string().min(1, 'Instrument is required'),
    status: z.enum(TRADE_STATUSES),
    direction: z.enum(TRADE_DIRECTIONS),
    style: z.enum(TRADE_STYLES, { required_error: 'Trade style is required' }),
    entry_price: requiredNumber.refine((value) => value > 0, 'Entry must be greater than 0'),
    stop_loss: optionalNumber,
    take_profit: optionalNumber,
    exit_price: optionalNumber,
    quantity: requiredNumber.refine((value) => value > 0, 'Position size must be greater than 0'),
    fees: optionalNumber,
    entry_reason: z.string().optional().or(z.literal('')),
    emotion: z.string().optional().or(z.literal('')),
    mistakes: z.array(z.string()).optional().default([]),
    timeframe: z.string().optional().or(z.literal('')),
    exit_reason: z.string().optional().or(z.literal('')),
    followed_rules: z.union([z.boolean(), z.literal(''), z.undefined()]).optional(),
    lesson_learned: z.string().optional().or(z.literal('')),
    exit_at: z.string().optional().or(z.literal('')),
  })
  .superRefine((values, ctx) => {
    if (values.status === 'closed' && (values.exit_price === undefined || values.exit_price === null)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['exit_price'],
        message: 'Exit price is required for closed trades',
      })
    }
  })
