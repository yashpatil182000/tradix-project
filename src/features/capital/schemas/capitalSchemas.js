import { z } from 'zod'

export const CAPITAL_ENTRY_TYPES = [
  'starting',
  'deposit',
  'withdrawal',
  'adjustment',
]

export const capitalTransactionSchema = z
  .object({
    entry_type: z.enum(CAPITAL_ENTRY_TYPES, {
      required_error: 'Transaction type is required',
    }),
    amount: z.coerce
      .number({ invalid_type_error: 'Amount is required' })
      .positive('Amount must be greater than 0'),
    recorded_at: z.string().min(1, 'Date is required'),
    note: z.string().trim().max(240, 'Note is too long').optional().or(z.literal('')),
    direction: z.enum(['in', 'out']).default('in'),
    currency: z.string().trim().min(1).default('USD'),
  })
  .superRefine((values, ctx) => {
    if (values.entry_type === 'adjustment' && !values.direction) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['direction'],
        message: 'Choose whether this adjustment increases or decreases capital',
      })
    }
  })
