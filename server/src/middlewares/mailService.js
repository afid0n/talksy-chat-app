const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendVerificationEmail = async (
  toEmail,
  userFullName,
  verificationLink
) => {
  try {
    await transporter.sendMail({
      from: `"Bazaar" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Verify Your Email Address",
      html: ` <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #1e90ff; padding: 20px; color: white; text-align: center;">
        <h2 style="margin: 0;">Welcome to Bazaar!</h2>
      </div>
      <div style="padding: 30px; color: #333;">
        <p style="font-size: 16px;">Hi ${userFullName},</p>
        <p style="font-size: 16px;">
          Thanks for signing up to <strong>Bazaar</strong>. Please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" target="_blank" 
             style="background-color: #1e90ff; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
            Verify Email
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          If you did not create an account, you can safely ignore this email.
        </p>
      </div>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} Bazaar. All rights reserved.
      </div>
    </div>
  </div>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendUnlockAccountEmail = async (
  toEmail,
  userFullName,
  unlockAccountLink
) => {
  try {
    const lockStart = new Date();
    const lockEnd = new Date(lockStart.getTime() + 10 * 60 * 1000); // +10 minutes

    const formattedStart = lockStart.toLocaleString();
    const formattedEnd = lockEnd.toLocaleString();

    await transporter.sendMail({
      from: `"Bazaar" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Account Locked — Unlock Your Bazaar Account",
      html: ` <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #ff6b6b; padding: 20px; color: white; text-align: center;">
        <h2 style="margin: 0;">Account Locked</h2>
      </div>
      <div style="padding: 30px; color: #333;">
        <p style="font-size: 16px;">Hello ${userFullName},</p>
        <p style="font-size: 16px;">
          Your <strong>Bazaar</strong> account has been <span style="color: #d9534f;"><strong>locked</strong></span> after <strong>3 unsuccessful login attempts</strong>.
        </p>
        <p style="font-size: 16px;">
          Your account will remain locked for <strong>10 minutes</strong>.
        </p>
        <p style="font-size: 14px; margin: 20px 0;">
          🔒 <strong>Lock Started:</strong> ${formattedStart}<br>
          🔓 <strong>Unlock Available:</strong> ${formattedEnd}
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${unlockAccountLink}" target="_blank" 
             style="background-color: #ff6b6b; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
            Unlock My Account
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          If this wasn't you, please change your password after unlocking your account.
        </p>
      </div>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} Bazaar. All rights reserved.
      </div>
    </div>
  </div>`,
    });
  } catch (error) {
    console.error("Error sending unlock account email:", error);
  }
}
const sendForgotPasswordEmail = async (toEmail, resetPasswordLink) => {
  try {
    await transporter.sendMail({
      from: `"Bazaar" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Bazaar Password Reset Request",
      html: `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f0f2f5; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background-color: #1e90ff; padding: 24px 20px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Password Reset</h1>
        <p style="margin: 5px 0 0; font-size: 14px;">Secure your Bazaar account</p>
      </div>
      <div style="padding: 32px 28px; color: #333;">
        <p style="font-size: 16px; margin-bottom: 24px;">Hello,</p>
        <p style="font-size: 15px; line-height: 1.6;">
          We received a request to reset your <strong>Bazaar</strong> account password. If you made this request, please click the button below to reset your password.
          This link will expire in <strong>30 minutes</strong>.
        </p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetPasswordLink}" target="_blank" 
             style="background-color: #ff4d4f; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
            Reset My Password
          </a>
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Didn’t request a password reset? No worries, you can safely ignore this message. Your account will remain secure.
        </p>
        <p style="font-size: 13px; color: #999; margin-top: 24px;">
          If you need help, please contact our support team anytime.
        </p>
      </div>
      <div style="background-color: #f8f8f8; padding: 18px; text-align: center; font-size: 12px; color: #aaa;">
        &copy; ${new Date().getFullYear()} Bazaar. All rights reserved.
      </div>
    </div>
  </div>
      `,
    });
  } catch (error) {
    console.error("Error sending forgot password email:", error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendUnlockAccountEmail,
  sendForgotPasswordEmail
};
