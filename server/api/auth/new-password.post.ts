import { prisma } from '@/server/prisma'
import { hashPassword } from '@/server/lib/tokens'
import { NewPasswordSchema } from '~/server/schemas'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event)

    // Validate input data
    const validationResult = NewPasswordSchema.safeParse(body)

    if (!validationResult.success) {
      return {
        success: false,
        status: 'error',
        message: 'Invalid password format',
        errors: validationResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      }
    }

    const { token, password } = validationResult.data

    // Find password reset token in database
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!passwordResetToken) {
      return {
        success: false,
        status: 'error',
        message: 'Invalid or expired token',
      }
    }

    // Check if token is expired
    const isExpired = new Date() > new Date(passwordResetToken.expires)

    if (isExpired) {
      // Delete expired token
      try {
        await prisma.passwordResetToken.delete({
          where: { id: passwordResetToken.id },
        })
      }
      catch (deleteError) {
        console.error('Error deleting expired token:', deleteError)
      }

      return {
        success: false,
        status: 'error',
        message: 'Password reset token has expired',
      }
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: passwordResetToken.email },
      include: {
        accounts: true,
      },
    })

    if (!user) {
      return {
        success: false,
        status: 'error',
        message: 'Account not found',
      }
    }

    try {
      // Hash the new password
      const hashedPassword = await hashPassword(password)

      // Update user's password
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          // Also set emailVerified if not already set (for OAuth users)
          emailVerified: user.emailVerified || new Date(),
        },
      })

      // Delete the password reset token
      await prisma.passwordResetToken.delete({
        where: { id: passwordResetToken.id },
      })
    }
    catch (updateError) {
      console.error('Error updating password:', updateError)
      return {
        success: false,
        status: 'error',
        message: 'Failed to update password',
      }
    }

    return {
      success: true,
      status: 'success',
      message: 'Password updated successfully',
    }
  }
  catch (error) {
    console.error('New password error:', error)

    return {
      success: false,
      status: 'error',
      message: 'An error occurred while resetting your password',
    }
  }
})
