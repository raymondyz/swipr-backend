import 'dotenv/config'
import { resend } from "../db/client.js"

const senderEmail = process.env.SENDER_EMAIL
const verificationEmailSubject = "swipr | Email Verification Code"
const resetEmailSubject = "swipr | Password Reset Email Verification Code"

function getVerificationEmailHtml(code) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0;">
    <tr>
      <td align="center">
        
        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#4F46E5; padding:20px; text-align:center; color:#ffffff; font-size:20px; font-weight:bold;">
              Verify Your Email
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="margin:0 0 15px;">Hi there,</p>

              <p style="margin:0 0 20px;">
                Thanks for signing up! Please use the verification code below to confirm your email address.
              </p>

              <!-- Code Box -->
              <div style="text-align:center; margin:30px 0;">
                <span style="
                  display:inline-block;
                  padding:15px 25px;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:bold;
                  background:#f1f5f9;
                  border-radius:6px;
                  color:#111827;
                ">
                  ${String(code)}
                </span>
              </div>

              <p style="margin:0 0 20px;">
                This code will expire shortly. If you didn’t request this, you can safely ignore this email.
              </p>

              <p style="margin:0;">
                Thanks,<br>
                swipr
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
  `
}

function getResetEmailHtml(code) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0;">
    <tr>
      <td align="center">
        
        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#4F46E5; padding:20px; text-align:center; color:#ffffff; font-size:20px; font-weight:bold;">
              Verify Your Email
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="margin:0 0 15px;">Hi there,</p>

              <p style="margin:0 0 20px;">
                You have attempted to reset your password. Please use the verification code below to confirm your email address.
              </p>

              <!-- Code Box -->
              <div style="text-align:center; margin:30px 0;">
                <span style="
                  display:inline-block;
                  padding:15px 25px;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:bold;
                  background:#f1f5f9;
                  border-radius:6px;
                  color:#111827;
                ">
                  ${String(code)}
                </span>
              </div>

              <p style="margin:0 0 20px;">
                This code will expire shortly. If you didn’t request this, you can safely ignore this email.
              </p>

              <p style="margin:0;">
                Thanks,<br>
                swipr
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
  `
}

export async function sendEmail({ from, to, subject, html }) {
  const { data, error } = await resend.emails.send({ from, to, subject, html })

  if (error) {
    throw new Error(`Email send failed: ${error.message}`)
  }

  return data.id
}

export function sendVerificationEmail(emailAddress, code) {
  return sendEmail({
    from: senderEmail,
    to: emailAddress,
    subject: verificationEmailSubject,
    html: getVerificationEmailHtml(code)
  })
}

export function sendResetEmail(emailAddress, code) {
  return sendEmail({
    from: senderEmail,
    to: emailAddress,
    subject: resetEmailSubject,
    html: getResetEmailHtml(code)
  })
}