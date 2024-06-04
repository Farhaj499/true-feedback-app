import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(3, {message:'Username must be at least 3 characters long'})
    .max(20, {message:'Username must not exceed 20 characters'})
    .regex(/^[a-zA-Z0-9_]+$/, {message:"Username must not contain special characters"})   

export const emailValidation = z
    .string()
    .email({message: 'Please enter a valid email'})
    
export const passwordValidation = z
    .string()
    .min(8, {message:'Password must be at least 8 characters long'})

export const signUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation
})