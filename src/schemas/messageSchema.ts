import { z } from 'zod'

export const contentValidation = z
    .string()
    .min(10, {message:'Content must be at least 10 character long'})
    .max(300, {message:'Content must be no longer than 300 characters'})

export const messageSchema = z.object({
    content: contentValidation
})