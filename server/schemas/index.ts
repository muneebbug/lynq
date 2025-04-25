import z from 'zod'

export const CreateLinkSchema = z.object({
  url: z
    .string()
    .min(1, { message: 'URL is required.' })
    .url({
      message: 'Please enter a valid URL. Include http:// or https://',
    })
    .regex(/^(?!.*(?:http|https):\/\/(?:slug|slugr)\.vercel\.app).*$/, {
      message: 'You cannot redirect to the Slug url.',
    })
  // not contain any blank spaces
    .regex(/^\S+$/, {
      message: 'URL must not contain any blank spaces.',
    }),
  slug: z
    .string()
    .min(4, {
      message: 'Short link is required and must be at least 4 characters long.',
    })
    .regex(/^[a-zA-Z0-9_-]*$/, {
      message:
                'Custom short link must not contain any blank spaces or special characters.',
    })
    .regex(/^(?!.*&c$)/, {
      message: 'Custom short link can\'t end with &c.',
    }),

  description: z
    .string()
    .max(100, { message: 'The description must be less than 100 characters.' })
    .optional(),
})

export const EditLinkSchema = z.object({
  id: z.string(),
  url: z
    .string()
    .min(1, { message: 'URL is required.' })
    .regex(/^(?!.*(?:http|https):\/\/(?:slug|slugr)\.vercel\.app).*$/, {
      message: 'You cannot redirect to the Slug url.',
    })
  // not contain any blank spaces
    .regex(/^\S+$/, {
      message: 'URL must not contain any blank spaces.',
    }),
  slug: z
    .string()
    .min(4, {
      message: 'Short link is required and must be at least 4 characters long.',
    })
    .regex(/^[a-zA-Z0-9_-]*$/, {
      message: 'Custom short link must not contain any blank spaces.',
    })
    .regex(/^(?!.*&c$)/, {
      message: 'Custom short link can\'t end with &c.',
    }),
  description: z
    .string()
    .max(100, { message: 'The description must be less than 100 characters.' }),
})

export const DeleteLinkSchema = z.object({
  slug: z.string().min(1, { message: 'Slug is required.' }),
})

export const CreateTagSchema = z.object({
  name: z.string().min(1, { message: 'Tag name is required.' }).max(15, {
    message: 'Tag name must be less than 15 characters.',
  }),
  color: z.string().min(1, { message: 'Tag color is required.' }),
})

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }).max(40, {
    message: 'Name must be less than 40 characters.',
  }),
  username: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }).optional(),
})

export const EmailChangeSchema = z.object({
  newEmail: z.string().email({ message: 'Invalid email address.' }),
})

// AUTH SCHEMAS

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
})

export const NewPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
})

export const ResetRequestSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

export const VerifyPasswordSchema = z.object({
  token: z.string(),
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
})

export const SetupPasswordSchema = z.object({
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
})

export const DeleteAccountSchema = z.object({
  password: z.string().optional(),
})
