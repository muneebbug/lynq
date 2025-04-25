import { v4 as uuidv4 } from 'uuid'
import { hash } from 'bcryptjs'
import { sendVerificationEmail, sendPasswordResetEmail, sendTwoFactorTokenEmail, sendEmailChangeVerification } from './mail'
import { prisma } from '@/server/prisma'

/**
 * Generate a verification token and send it via email
 */
export const generateVerificationToken = async (email: string) => {
  try {
    // Delete any existing verification token
    const existingToken = await prisma.verificationToken.findFirst({
      where: { email },
    })

    if (existingToken) {
      await prisma.verificationToken.delete({
        where: { id: existingToken.id },
      })
    }

    // Generate a new token with 24 hour expiry
    const token = uuidv4()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const verificationToken = await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    await sendVerificationEmail(email, verificationToken.token)

    return verificationToken
  }
  catch (error) {
    console.error('Error generating verification token:', error)
    throw new Error('Failed to generate verification token')
  }
}

/**
 * Generate a password reset token and send it via email
 */
export const generatePasswordResetToken = async (email: string) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // We throw an error here, but the caller should handle it silently
      // to prevent email enumeration attacks
      throw new Error('User not found')
    }

    // Delete any existing password reset token
    const existingToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    })

    if (existingToken) {
      await prisma.passwordResetToken.delete({
        where: { id: existingToken.id },
      })
    }

    // Generate a new token with 1 hour expiry
    const token = uuidv4()
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    const passwordResetToken = await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    await sendPasswordResetEmail(email, passwordResetToken.token)

    return passwordResetToken
  }
  catch (error) {
    console.error('Error generating password reset token:', error)
    throw error
  }
}

/**
 * Generate a new random two-factor authentication token
 */
export const generateTwoFactorToken = async (email: string) => {
  try {
    // Delete any existing two factor token
    const existingToken = await prisma.twoFactorToken.findFirst({
      where: { email },
    })

    if (existingToken) {
      await prisma.twoFactorToken.delete({
        where: { id: existingToken.id },
      })
    }

    // Generate a random 6-digit token
    const token = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const twoFactorToken = await prisma.twoFactorToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    await sendTwoFactorTokenEmail(email, twoFactorToken.token)

    return twoFactorToken
  }
  catch (error) {
    console.error('Error generating two-factor token:', error)
    throw new Error('Failed to generate two-factor token')
  }
}

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string) => {
  try {
    return await hash(password, 12)
  }
  catch (error) {
    console.error('Error hashing password:', error)
    throw new Error('Failed to hash password')
  }
}

/**
 * Generate an email change verification token and send it via email
 */
export const generateEmailChangeToken = async (userId: string, currentEmail: string, newEmail: string) => {
  try {
    // Delete any existing email change token
    const existingToken = await prisma.emailChangeToken.findFirst({
      where: { userId },
    })

    if (existingToken) {
      await prisma.emailChangeToken.delete({
        where: { id: existingToken.id },
      })
    }

    // Generate a new token with 24 hour expiry
    const token = uuidv4()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const emailChangeToken = await prisma.emailChangeToken.create({
      data: {
        userId,
        email: currentEmail,
        newEmail,
        token,
        expires,
      },
    })

    await sendEmailChangeVerification(newEmail, emailChangeToken.token)

    return emailChangeToken
  }
  catch (error) {
    console.error('Error generating email change token:', error)
    throw new Error('Failed to generate email change token')
  }
}
