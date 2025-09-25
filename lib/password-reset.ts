import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { executeQuery, executeTransactionalQuery } from './mysql'

export interface PasswordResetToken {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  used: boolean
  createdAt: Date
}

export interface RateLimitInfo {
  email: string
  ipAddress: string
  requestCount: number
  firstRequestAt: Date
  lastRequestAt: Date
  blockedUntil: Date | null
}

/**
 * Generate a secure random token (32 bytes = 64 hex characters)
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Hash a token using SHA-256
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Constant-time comparison to prevent timing attacks
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt
}

/**
 * Create a password reset token for a user
 */
export async function createPasswordResetToken(
  userId: string,
  token: string,
  expiresInMinutes: number = 30
): Promise<{ success: boolean; error?: string }> {
  try {
    const tokenHash = hashToken(token)
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000)

    // First, invalidate any existing tokens for this user
    await executeTransactionalQuery(
      'UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0',
      [userId]
    )

    // Insert new token
    const sql = `
      INSERT INTO password_resets (user_id, token_hash, expires_at, used)
      VALUES (?, ?, ?, 0)
    `
    
    await executeTransactionalQuery(sql, [userId, tokenHash, expiresAt])
    
    return { success: true }
  } catch (error) {
    console.error('Error creating password reset token:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Validate a password reset token
 */
export async function validatePasswordResetToken(
  token: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const tokenHash = hashToken(token)
    
    const sql = `
      SELECT id, user_id, token_hash, expires_at, used, created_at
      FROM password_resets 
      WHERE token_hash = ? AND used = 0
    `
    
    const result = await executeQuery(sql, [tokenHash])
    
    if (result.error) {
      return { success: false, error: 'Database error' }
    }

    const tokens = result.data as PasswordResetToken[]
    
    if (!tokens || tokens.length === 0) {
      return { success: false, error: 'Invalid or expired token' }
    }

    const tokenRecord = tokens[0]
    
    // Check if token is expired
    if (isTokenExpired(tokenRecord.expiresAt)) {
      return { success: false, error: 'Token has expired' }
    }

    // Verify token hash with constant-time comparison
    if (!constantTimeCompare(tokenRecord.tokenHash, tokenHash)) {
      return { success: false, error: 'Invalid token' }
    }

    return { 
      success: true, 
      userId: tokenRecord.userId 
    }
  } catch (error) {
    console.error('Error validating password reset token:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Mark a password reset token as used
 */
export async function markTokenAsUsed(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const tokenHash = hashToken(token)
    
    const sql = 'UPDATE password_resets SET used = 1 WHERE token_hash = ?'
    await executeTransactionalQuery(sql, [tokenHash])
    
    return { success: true }
  } catch (error) {
    console.error('Error marking token as used:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Invalidate all tokens for a user
 */
export async function invalidateUserTokens(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const sql = 'UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0'
    await executeTransactionalQuery(sql, [userId])
    
    return { success: true }
  } catch (error) {
    console.error('Error invalidating user tokens:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: string, 
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    const sql = 'UPDATE user_profiles SET password = ? WHERE id = ?'
    await executeTransactionalQuery(sql, [hashedPassword, userId])
    
    return { success: true }
  } catch (error) {
    console.error('Error updating user password:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Check rate limiting for password reset requests
 */
export async function checkRateLimit(
  email: string, 
  ipAddress: string
): Promise<{ allowed: boolean; error?: string; retryAfter?: number }> {
  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    // Check if IP or email is currently blocked
    const blockedSql = `
      SELECT blocked_until FROM password_reset_rate_limits 
      WHERE (email = ? OR ip_address = ?) 
      AND blocked_until > NOW()
    `
    
    const blockedResult = await executeQuery(blockedSql, [email, ipAddress])
    
    if (blockedResult.error) {
      return { allowed: false, error: 'Database error checking rate limit' }
    }

    const blockedRecords = blockedResult.data as any[]
    if (blockedRecords && blockedRecords.length > 0) {
      const retryAfter = Math.ceil((new Date(blockedRecords[0].blocked_until).getTime() - now.getTime()) / 1000)
      return { 
        allowed: false, 
        error: 'Too many requests. Please try again later.',
        retryAfter 
      }
    }

    // Check request count in the last hour
    const countSql = `
      SELECT COUNT(*) as request_count FROM password_reset_rate_limits 
      WHERE (email = ? OR ip_address = ?) 
      AND last_request_at > ?
    `
    
    const countResult = await executeQuery(countSql, [email, ipAddress, oneHourAgo])
    
    if (countResult.error) {
      return { allowed: false, error: 'Database error checking request count' }
    }

    const countData = countResult.data as any[]
    const requestCount = countData[0]?.request_count || 0

    // Allow up to 5 requests per hour
    if (requestCount >= 5) {
      // Block for 1 hour
      const blockUntil = new Date(now.getTime() + 60 * 60 * 1000)
      
      await executeTransactionalQuery(
        'INSERT INTO password_reset_rate_limits (email, ip_address, blocked_until) VALUES (?, ?, ?)',
        [email, ipAddress, blockUntil]
      )
      
      return { 
        allowed: false, 
        error: 'Too many requests. Please try again in 1 hour.',
        retryAfter: 3600 
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Error checking rate limit:', error)
    return { 
      allowed: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Record a password reset request for rate limiting
 */
export async function recordPasswordResetRequest(
  email: string, 
  ipAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date()
    
    // Check if record exists
    const existingSql = `
      SELECT id, request_count FROM password_reset_rate_limits 
      WHERE email = ? AND ip_address = ?
    `
    
    const existingResult = await executeQuery(existingSql, [email, ipAddress])
    
    if (existingResult.error) {
      return { success: false, error: 'Database error checking existing record' }
    }

    const existingRecords = existingResult.data as any[]
    
    if (existingRecords && existingRecords.length > 0) {
      // Update existing record
      const sql = `
        UPDATE password_reset_rate_limits 
        SET request_count = request_count + 1, last_request_at = NOW()
        WHERE email = ? AND ip_address = ?
      `
      await executeTransactionalQuery(sql, [email, ipAddress])
    } else {
      // Create new record
      const sql = `
        INSERT INTO password_reset_rate_limits (email, ip_address, request_count, first_request_at, last_request_at)
        VALUES (?, ?, 1, NOW(), NOW())
      `
      await executeTransactionalQuery(sql, [email, ipAddress])
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error recording password reset request:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Clean up expired tokens and old rate limit records
 */
export async function cleanupExpiredData(): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete expired tokens
    await executeTransactionalQuery(
      'DELETE FROM password_resets WHERE expires_at < NOW() AND used = 1'
    )
    
    // Delete old rate limit records (older than 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    await executeTransactionalQuery(
      'DELETE FROM password_reset_rate_limits WHERE created_at < ?',
      [oneDayAgo]
    )
    
    return { success: true }
  } catch (error) {
    console.error('Error cleaning up expired data:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
