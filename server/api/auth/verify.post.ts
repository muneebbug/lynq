import { prisma } from '@/server/prisma'
import { VerifyPasswordSchema } from '~/server/schemas'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event)

    // Validate token
    const validationResult = VerifyPasswordSchema.safeParse(body)

    if (!validationResult.success) {
      return {
        success: false,
        status: 'error',
        message: 'Invalid verification token',
      }
    }

    const { token } = validationResult.data

    // Find verification token in database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return {
        success: false,
        status: 'error',
        message: 'Invalid verification token',
      }
    }

    // Check if token is expired
    const isExpired = new Date() > new Date(verificationToken.expires)

    if (isExpired) {
      // Delete expired token
      try {
        await prisma.verificationToken.delete({
          where: { id: verificationToken.id },
        })
      }
      catch (deleteError) {
        console.error('Error deleting expired token:', deleteError)
      }

      return {
        success: false,
        status: 'error',
        message: 'Verification token has expired',
      }
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.email },
    })

    if (!user) {
      return {
        success: false,
        status: 'error',
        message: 'Account not found',
      }
    }

    try {
      // Update user's email verification status
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })

      // Delete the verification token
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      })
    }
    catch (updateError) {
      console.error('Error updating verification status:', updateError)
      return {
        success: false,
        status: 'error',
        message: 'Failed to verify email',
      }
    }

    return {
      success: true,
      status: 'success',
      message: 'Email verified successfully',
    }
  }
  catch (error) {
    console.error('Verification error:', error)

    return {
      success: false,
      status: 'error',
      message: 'An error occurred during verification',
    }
  }
})
