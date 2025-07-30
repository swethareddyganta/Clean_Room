'use server'

import { executeQuery } from '@/lib/mysql'
import bcrypt from "bcryptjs"
import { IUser } from "@/interfaces"
import jwt from "jsonwebtoken"

// Helper function to get client information
function getClientInfo() {
  return {
    ip: '127.0.0.1', // In production, get from request headers
    userAgent: 'Unknown', // In production, get from request headers
    deviceInfo: 'Unknown',
    location: 'Unknown'
  }
}

// Log login attempt
async function logLoginAttempt(
  userId: string | null,
  email: string,
  userName: string | null,
  userRole: string | null,
  success: boolean,
  failureReason?: string
) {
  try {
    const clientInfo = getClientInfo()
    
    const sql = `
      INSERT INTO login_history (
        user_id, email, user_name, user_role, ip_address, user_agent, 
        device_info, location, success, failure_reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    
    const params = [
      userId,
      email,
      userName || 'Unknown',
      userRole || 'Unknown',
      clientInfo.ip,
      clientInfo.userAgent,
      clientInfo.deviceInfo,
      clientInfo.location,
      success,
      failureReason || null
    ]

    await executeQuery(sql, params)
  } catch (error) {
    console.error('Error logging login attempt:', error)
  }
}

export const registerUser = async (payload: Partial<IUser>) => {
  try {
    // Step 1: Check if user exists
    const checkSql = 'SELECT * FROM user_profiles WHERE email = ?'
    const checkResult = await executeQuery(checkSql, [payload.email])
    
    if (checkResult.error) {
      throw new Error('Database error checking existing user')
    }

    const existingUsers = checkResult.data as any[]
    if (existingUsers && existingUsers.length > 0) {
      throw new Error("User already exists with this email address.")
    }

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(payload.password || "", 10)

    // Step 3: Insert user into database
    const insertSql = `
      INSERT INTO user_profiles (name, email, password, role, is_active)
      VALUES (?, ?, ?, ?, ?)
    `
    
    const insertParams = [
      payload.name,
      payload.email,
      hashedPassword,
      "user",
      true
    ]

    const insertResult = await executeQuery(insertSql, insertParams)
    
    if (insertResult.error) {
      throw new Error((insertResult.error as any).message || 'Failed to create user')
    }

    // Get the created user
    const getUserSql = 'SELECT * FROM user_profiles WHERE email = ?'
    const getUserResult = await executeQuery(getUserSql, [payload.email])
    
    if (getUserResult.error) {
      throw new Error('Failed to retrieve created user')
    }

    const users = getUserResult.data as any[]
    const createdUser = users?.[0]

    // Log successful registration as a login attempt
    if (createdUser) {
      await logLoginAttempt(
        createdUser.id,
        createdUser.email,
        createdUser.name,
        createdUser.role,
        true
      )
    }

    return {
      success: true,
      message: "User registered successfully.",
    }

  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const loginUser = async (email: string, password: string) => {
  try {
    // Step 1: Check if user exists
    const sql = 'SELECT * FROM user_profiles WHERE email = ?'
    const result = await executeQuery(sql, [email])
    
    if (result.error) {
      throw new Error('Database error checking user')
    }

    const users = result.data as any[]
    if (!users || users.length === 0) {
      // Log failed login attempt - user not found
      await logLoginAttempt(
        null,
        email,
        null,
        null,
        false,
        "User not found"
      )
      throw new Error("User not found!")
    }

    const user = users[0] as IUser

    // Check if user is active
    if (!user.is_active) {
      await logLoginAttempt(
        user.id,
        user.email,
        user.name,
        user.role,
        false,
        "Account disabled"
      )
      throw new Error("Account is disabled. Please contact administrator.")
    }

    // Step 2: Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      // Log failed login attempt - invalid password
      await logLoginAttempt(
        user.id,
        user.email,
        user.name,
        user.role,
        false,
        "Invalid password"
      )
      throw new Error("Invalid password!")
    }

    // Step 3: Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    })

    // Update last_login in user_profiles
    const updateSql = 'UPDATE user_profiles SET last_login = NOW() WHERE id = ?'
    await executeQuery(updateSql, [user.id])

    // Log successful login
    await logLoginAttempt(
      user.id,
      user.email,
      user.name,
      user.role,
      true
    )

    return {
      success: true,
      message: "Login Successful",
      data: {
        role: user.role,
        token
      },
    }

  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const getLoginStats = async () => {
  try {
    const sql = 'SELECT * FROM login_stats ORDER BY login_date DESC LIMIT 30'
    const result = await executeQuery(sql)
    
    if (result.error) {
      throw new Error('Failed to fetch login statistics')
    }

    return { data: result.data as any[] }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const getUserLoginSummary = async () => {
  try {
    const sql = 'SELECT * FROM user_login_summary ORDER BY last_login DESC'
    const result = await executeQuery(sql)
    
    if (result.error) {
      throw new Error('Failed to fetch user login summary')
    }

    return { data: result.data as any[] }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const logoutUser = async () => {
  try {
    // For MySQL, we'll just return success since we're using JWT tokens
    // The actual logout is handled by clearing cookies on the client side
    return {
      success: true,
      message: "Logged out successfully"
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    }
  }
} 