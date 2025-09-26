import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';
import { sendPasswordResetEmail } from '@/lib/email-service';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userSql = 'SELECT id, email, name FROM user_profiles WHERE email = ? AND is_active = true';
    const userResult = await executeQuery(userSql, [email]);

    if (userResult.error) {
      console.error('Database error checking user:', userResult.error);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }

    const users = userResult.data as any[];
    if (!users || users.length === 0) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent.'
      });
    }

    const user = users[0];

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Delete any existing reset tokens for this user
    const deleteSql = 'DELETE FROM password_reset_tokens WHERE user_id = ?';
    await executeQuery(deleteSql, [user.id]);

    // Insert new reset token
    const insertSql = `
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `;
    const insertResult = await executeQuery(insertSql, [user.id, resetToken, expiresAt]);

    if (insertResult.error) {
      console.error('Database error inserting reset token:', insertResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to create reset token' },
        { status: 500 }
      );
    }

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to send reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions have been sent to your email address.'
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

