import { prisma } from '@/server/prisma'
import { generateVerificationToken, hashPassword } from '@/server/lib/tokens'
import { RegisterSchema } from '@/server/schemas'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event)

    // Validate input data
    const validationResult = RegisterSchema.safeParse(body)

    if (!validationResult.success) {
      return {
        success: false,
        status: 'error',
        message: 'Invalid input data',
        errors: validationResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      }
    }

    const { name, email, password } = validationResult.data

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        status: 'error',
        message: 'Email already in use',
      }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create new user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Generate and send verification token
    try {
      await generateVerificationToken(email)
    }
    catch (tokenError) {
      console.error('Error generating verification token:', tokenError)
      // Return success even if token generation fails
      // We don't want to expose that the token generation failed
    }

    return {
      success: true,
      status: 'success',
      message: 'Verification email sent. Please check your inbox.',
    }
  }
  catch (error) {
    console.error('Registration error:', error)

    // Don't expose error details to client
    return {
      success: false,
      status: 'error',
      message: 'An error occurred during registration. Please try again later.',
    }
  }
})
