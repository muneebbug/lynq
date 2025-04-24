import { generatePasswordResetToken } from '@/server/lib/tokens'
import { ResetRequestSchema } from '~/server/schemas'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event)

    // Validate input data
    const validationResult = ResetRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return {
        success: false,
        status: 'error',
        message: 'Please enter a valid email address',
      }
    }

    const { email } = validationResult.data

    // Important security practice: Always return a success message
    // regardless of whether the email exists or not
    // This prevents user enumeration attacks

    try {
      // Generate reset token and send email
      await generatePasswordResetToken(email)
    }
    catch (error) {
      // Don't expose whether the email exists or not for security
      // Log the error server-side only
      console.error('Error generating password reset token:', error)
      // We do not rethrow - we continue to return success
    }

    // Return success regardless of outcome to prevent email enumeration
    return {
      success: true,
      status: 'success',
      message: 'If your email is registered, you will receive a password reset link shortly.',
    }
  }
  catch (error) {
    console.error('Password reset request error:', error)

    return {
      success: false,
      status: 'error',
      message: 'An error occurred while processing your request',
    }
  }
})
