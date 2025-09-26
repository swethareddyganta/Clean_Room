import nodemailer from 'nodemailer';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Get email configuration from environment variables
const getEmailConfig = (): EmailConfig => {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };
};

// Create transporter
const createTransporter = () => {
  const config = getEmailConfig();
  return nodemailer.createTransport(config);
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  userName: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    
    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    // Email content
    const mailOptions = {
      from: `"STERI Clean Air" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - STERI Clean Air',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">STERI Clean Air</div>
              <p>HVAC Matrix Platform</p>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hello ${userName},</p>
              <p>We received a request to reset your password for your STERI Clean Air account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset My Password</a>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p><strong>Security Tips:</strong></p>
              <ul>
                <li>Never share your password with anyone</li>
                <li>Use a strong, unique password</li>
                <li>Log out from shared computers</li>
              </ul>
            </div>
            <div class="footer">
              <p>This email was sent by STERI Clean Air - Arrant Dynamics</p>
              <p>© 2024 Arrant Tech IND, Pvt. Ltd. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    
    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', result.messageId);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send email' 
    };
  }
};

// Send password reset confirmation email
export const sendPasswordResetConfirmationEmail = async (
  email: string,
  userName: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    
    const mailOptions = {
      from: `"STERI Clean Air" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Successfully Reset - STERI Clean Air',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .success-icon { font-size: 48px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">STERI Clean Air</div>
              <p>HVAC Matrix Platform</p>
            </div>
            <div class="content">
              <div class="success-icon">✅</div>
              <h2>Password Successfully Reset</h2>
              <p>Hello ${userName},</p>
              <p>Your password has been successfully reset for your STERI Clean Air account.</p>
              <p>You can now log in with your new password.</p>
              <p>If you didn't make this change, please contact our support team immediately.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p><strong>Security Tips:</strong></p>
              <ul>
                <li>Keep your password secure and don't share it</li>
                <li>Use a strong, unique password</li>
                <li>Log out from shared computers</li>
                <li>Report any suspicious activity immediately</li>
              </ul>
            </div>
            <div class="footer">
              <p>This email was sent by STERI Clean Air - Arrant Dynamics</p>
              <p>© 2024 Arrant Tech IND, Pvt. Ltd. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    
    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset confirmation email sent:', result.messageId);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error sending password reset confirmation email:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send email' 
    };
  }
};
