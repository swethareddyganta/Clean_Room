import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

class Mailer {
  private transporter: nodemailer.Transporter

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    }

    this.transporter = nodemailer.createTransport(config)
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'Cleanroom Project <no-reply@cleanroomproject.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }

      await this.transporter.sendMail(mailOptions)
      return { success: true }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string, userName?: string): Promise<{ success: boolean; error?: string }> {
    const subject = 'Reset your password'
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e9ecef; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
          .button { 
            display: inline-block; 
            background: #007bff; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover { background: #0056b3; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .link { word-break: break-all; color: #007bff; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello${userName ? ` ${userName}` : ''},</p>
            
            <p>We received a request to reset your password for your STERI Clean Air account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset My Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p class="link">${resetLink}</p>
            
            <div class="warning">
              <strong>Important:</strong>
              <ul>
                <li>This link will expire in 30 minutes</li>
                <li>This link can only be used once</li>
                <li>If you didn't request this password reset, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
            
            <p>Best regards,<br>The STERI Clean Air Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
Password Reset Request

Hello${userName ? ` ${userName}` : ''},

We received a request to reset your password for your STERI Clean Air account. If you made this request, use the link below to reset your password:

${resetLink}

Important:
- This link will expire in 30 minutes
- This link can only be used once
- If you didn't request this password reset, please ignore this email

If you're having trouble with the link, copy and paste it into your web browser.

Best regards,
The STERI Clean Air Team

---
This is an automated message. Please do not reply to this email.
If you have any questions, please contact our support team.
    `

    return this.sendEmail({
      to: email,
      subject,
      html,
      text,
    })
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.transporter.verify()
      return { success: true }
    } catch (error) {
      console.error('SMTP connection test failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}

// Export singleton instance
export const mailer = new Mailer()
export default mailer
