import { Resend } from 'resend'
import { env } from '@/config'

const resend = new Resend(env.RESEND_API_KEY)
const domain = env.NUXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000'

export const sendVerificationEmail = async (
  email: string,
  token: string,
) => {
  const confirmLink = `${domain}/auth/verify?token=${token}`

  await resend.emails.send({
    from: `Lynq <noreply@${env.RESEND_DOMAIN}>`,
    to: email,
    subject: 'Confirm your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111; margin-bottom: 24px;">Verify your email address</h2>
        <p style="color: #555; margin-bottom: 20px;">Thank you for signing up for Lynq. Please confirm your email address by clicking the link below:</p>
        <a href="${confirmLink}" style="display: inline-block; background-color: #3b82f6; color: white; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
        <p style="color: #555; margin-top: 20px;">If you didn't sign up for Lynq, you can safely ignore this email.</p>
        <p style="color: #555; margin-top: 20px;">This link will expire in 24 hours.</p>
      </div>
    `,
  })
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: `Lynq <noreply@${env.RESEND_DOMAIN}>`,
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111; margin-bottom: 24px;">Reset your password</h2>
        <p style="color: #555; margin-bottom: 20px;">You requested to reset your password. Click the link below to set a new password:</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #3b82f6; color: white; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p style="color: #555; margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email.</p>
        <p style="color: #555; margin-top: 20px;">This link will expire in 1 hour.</p>
      </div>
    `,
  })
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string,
) => {
  await resend.emails.send({
    from: `Lynq <noreply@${env.RESEND_DOMAIN}>`,
    to: email,
    subject: 'Your two-factor authentication code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111; margin-bottom: 24px;">Your authentication code</h2>
        <p style="color: #555; margin-bottom: 20px;">Your two-factor authentication code is:</p>
        <div style="background-color: #f5f5f5; padding: 16px; border-radius: 4px; text-align: center; font-size: 24px; letter-spacing: 4px; font-weight: bold; margin-bottom: 24px;">${token}</div>
        <p style="color: #555;">This code will expire in 10 minutes.</p>
      </div>
    `,
  })
}

export const sendEmailChangeVerification = async (
  newEmail: string,
  token: string,
) => {
  const confirmLink = `${domain}/auth/verify-email-change?token=${token}`

  await resend.emails.send({
    from: `Lynq <noreply@${env.RESEND_DOMAIN}>`,
    to: newEmail,
    subject: 'Verify your new email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111; margin-bottom: 24px;">Verify your new email address</h2>
        <p style="color: #555; margin-bottom: 20px;">You requested to change your email address. Please confirm this new email address by clicking the link below:</p>
        <a href="${confirmLink}" style="display: inline-block; background-color: #3b82f6; color: white; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
        <p style="color: #555; margin-top: 20px;">If you didn't request this change, you can safely ignore this email.</p>
        <p style="color: #555; margin-top: 20px;">This link will expire in 24 hours.</p>
      </div>
    `,
  })
}
