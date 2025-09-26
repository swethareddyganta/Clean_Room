import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';
import { sendPasswordResetConfirmationEmail } from '@/lib/email-service';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Token and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find valid reset token
    const tokenSql = `
      SELECT prt.*, up.email, up.name 
      FROM password_reset_tokens prt
      JOIN user_profiles up ON prt.user_id = up.id
      WHERE prt.token = ? 
        AND prt.expires_at > NOW() 
        AND prt.used = false
    `;
    const tokenResult = await executeQuery(tokenSql, [token]);

    if (tokenResult.error) {
      console.error('Database error checking reset token:', tokenResult.error);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }

    const tokens = tokenResult.data as any[];
    if (!tokens || tokens.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    const resetToken = tokens[0];
    const userId = resetToken.user_id;
    const userEmail = resetToken.email;
    const userName = resetToken.name;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const updatePasswordSql = 'UPDATE user_profiles SET password = ? WHERE id = ?';
    const updateResult = await executeQuery(updatePasswordSql, [hashedPassword, userId]);

    if (updateResult.error) {
      console.error('Database error updating password:', updateResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Mark token as used
    const markUsedSql = 'UPDATE password_reset_tokens SET used = true WHERE id = ?';
    await executeQuery(markUsedSql, [resetToken.id]);

    // Send confirmation email
    try {
      await sendPasswordResetConfirmationEmail(userEmail, userName);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email sending fails
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully reset. You can now log in with your new password.'
    });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method to validate reset token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    // Check if token is valid
    const tokenSql = `
      SELECT prt.*, up.email, up.name 
      FROM password_reset_tokens prt
      JOIN user_profiles up ON prt.user_id = up.id
      WHERE prt.token = ? 
        AND prt.expires_at > NOW() 
        AND prt.used = false
    `;
    const tokenResult = await executeQuery(tokenSql, [token]);

    if (tokenResult.error) {
      console.error('Database error checking reset token:', tokenResult.error);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }

    const tokens = tokenResult.data as any[];
    if (!tokens || tokens.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      user: {
        email: tokens[0].email,
        name: tokens[0].name
      }
    });

  } catch (error: any) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

