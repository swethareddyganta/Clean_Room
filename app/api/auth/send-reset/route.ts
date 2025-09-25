import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql'
import { 
  generateSecureToken, 
  createPasswordResetToken, 
  checkRateLimit, 
  recordPasswordResetRequest 
} from '@/lib/password-reset'
import { mailer } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || '127.0.0.1'

    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(email, ip)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: rateLimitCheck.error || 'Rate limit exceeded',
          retryAfter: rateLimitCheck.retryAfter 
        },
        { status: 429 }
      )
    }

    // Check if user exists (but don't reveal this information)
    const userSql = 'SELECT id, email, name FROM user_profiles WHERE email = ? AND is_active = 1'
    const userResult = await executeQuery(userSql, [email])

    if (userResult.error) {
      console.error('Database error checking user:', userResult.error)
      // Return generic success message even on database error for security
      return NextResponse.json(
        { 
          success: true, 
          message: 'If that email exists, we\'ve sent instructions to reset your password.' 
        },
        { status: 200 }
      )
    }

    const users = userResult.data as any[]
    const user = users?.[0]

    // Always return the same success message regardless of whether user exists
    // This prevents email enumeration attacks
    const successMessage = 'If that email exists, we\'ve sent instructions to reset your password.'

    if (user) {
      try {
        // Generate secure token
        const token = generateSecureToken()
        
        // Create password reset token
        const tokenResult = await createPasswordResetToken(user.id, token, 30) // 30 minutes
        
        if (!tokenResult.success) {
          console.error('Error creating password reset token:', tokenResult.error)
          // Still return success message for security
          return NextResponse.json(
            { success: true, message: successMessage },
            { status: 200 }
          )
        }

        // Generate reset link
        const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`
        
        // Send email
        const emailResult = await mailer.sendPasswordResetEmail(
          user.email, 
          resetLink, 
          user.name
        )
        
        if (!emailResult.success) {
          console.error('Error sending password reset email:', emailResult.error)
          // Still return success message for security
        }

        // Record the request for rate limiting
        await recordPasswordResetRequest(email, ip)

        // Log the request (for monitoring purposes)
        console.log(`Password reset requested for user: ${user.email} (IP: ${ip})`)

      } catch (error) {
        console.error('Error processing password reset request:', error)
        // Still return success message for security
      }
    }

    // Always return the same success message
    return NextResponse.json(
      { success: true, message: successMessage },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in send-reset endpoint:', error)
    
    // Return generic success message even on error for security
    return NextResponse.json(
      { 
        success: true, 
        message: 'If that email exists, we\'ve sent instructions to reset your password.' 
      },
      { status: 200 }
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
