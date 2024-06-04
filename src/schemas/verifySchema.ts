import { z } from 'zod'

export const codeValidation = z
    .string()
    .length(6, {message:'Code must be at least 6 digits long'})
    
export const verifySchema = z.object({
    code: codeValidation
})