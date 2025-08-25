import nodemailer from 'nodemailer';
import config from '../../config';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: config.brevo_user,
    pass: config.brevo_api_key,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  try {
    await transporter.sendMail({
      from: config.brevo_sender_email,
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p><strong>This code will expire in 5 minutes.</strong></p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>`,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send OTP email');
  }
}
