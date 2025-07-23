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
       tls: {
    rejectUnauthorized: false, 
  },
});

const sendVerificationEmail = async (toEmail, userFullName, verificationLink) => {
  try {
    await transporter.sendMail({
      from: `"TalksyApp" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Verify Your Email Address",
      text: `Hi ${userFullName},\n\nThanks for signing up to TalksyApp!\nPlease verify your email by clicking the link below:\n${verificationLink}\n\nIf you didn’t create this account, you can ignore this message.\n\n— Talksy Team`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <div style="background-color: #facc15; padding: 20px; text-align: center; color: #111827;">
              <h2 style="margin: 0; font-size: 24px;">Welcome to <strong>TalksyApp</strong>!</h2>
            </div>
            <div style="padding: 30px; color: #374151;">
              <p style="font-size: 16px;">Hi ${userFullName},</p>
              <p style="font-size: 16px; margin-top: 10px;">
                Thanks for signing up to <strong>TalksyApp</strong>. Please verify your email address by clicking the button below:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" target="_blank" 
                   style="background-color: #facc15; color: #111827; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block; font-weight: 600;">
                  Verify Email
                </a>
              </div>
              <p style="font-size: 14px; color: #6b7280;">
                If you did not create an account, you can safely ignore this email.
              </p>
              <p style="font-size: 14px; margin-top: 20px; color: #6b7280;">
                Or copy and paste this link into your browser:<br/>
                <a href="${verificationLink}" style="color: #3b82f6;">${verificationLink}</a>
              </p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
              &copy; ${new Date().getFullYear()} TalksyApp. All rights reserved.
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
  }
};

module.exports = {
  sendVerificationEmail,
};
