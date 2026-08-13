import { z } from 'zod'

export const configOptionSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, 'Label is required')
    .max(80, 'Label is too long'),
  description: z
    .string()
    .trim()
    .max(240, 'Description is too long')
    .optional()
    .or(z.literal('')),
  value: z
    .string()
    .trim()
    .max(64, 'Value is too long')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean().default(true),
})
