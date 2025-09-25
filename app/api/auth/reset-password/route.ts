import { NextRequest, NextResponse } from 'next/server'
import { 
  validatePasswordResetToken, 
  markTokenAsUsed, 
  updateUserPassword, 
  invalidateUserTokens 
} from '@/lib/password-reset'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    // Validate input
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Reset token is required' },
        { status: 400 }
      )
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { success: false, message: 'New password is required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check for password complexity
    const hasLower = /[a-z]/.test(newPassword)
    const hasUpper = /[A-Z]/.test(newPassword)
    const hasNumber = /\d/.test(newPassword)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

    if (!hasLower || !hasUpper || !hasNumber) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' 
        },
        { status: 400 }
      )
    }

    // Validate token
    const tokenValidation = await validatePasswordResetToken(token)
    
    if (!tokenValidation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: tokenValidation.error || 'Invalid or expired token. Please request a new password reset link.' 
        },
        { status: 400 }
      )
    }

    const userId = tokenValidation.userId!
    
    try {
      // Start transaction-like operations
      // 1. Update user password
      const passwordUpdate = await updateUserPassword(userId, newPassword)
      
      if (!passwordUpdate.success) {
        console.error('Error updating password:', passwordUpdate.error)
        return NextResponse.json(
          { 
            success: false, 
            message: 'Failed to update password. Please try again.' 
          },
          { status: 500 }
        )
      }

      // 2. Mark the current token as used
      const markToken = await markTokenAsUsed(token)
      
      if (!markToken.success) {
        console.error('Error marking token as used:', markToken.error)
        // Password was updated, but token marking failed
        // This is not critical, but we should log it
      }

      // 3. Invalidate all other tokens for this user
      const invalidateTokens = await invalidateUserTokens(userId)
      
      if (!invalidateTokens.success) {
        console.error('Error invalidating other tokens:', invalidateTokens.error)
        // This is not critical, but we should log it
      }

      // Log successful password reset
      console.log(`Password successfully reset for user ID: ${userId}`)

      return NextResponse.json(
        { 
          success: true, 
          message: 'Password has been successfully reset. You can now log in with your new password.' 
        },
        { status: 200 }
      )

    } catch (error) {
      console.error('Error during password reset process:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: 'An error occurred while resetting your password. Please try again.' 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in reset-password endpoint:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request. Please try again.' 
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}
