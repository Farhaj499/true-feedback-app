import { z } from 'zod'
import { usernameValidation, passwordValidation } from './signUpSchema'

export const signUpSchema = z.object({
    username: usernameValidation,
    password: passwordValidation
})