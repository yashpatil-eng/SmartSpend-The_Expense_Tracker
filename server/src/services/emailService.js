import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mailUser = process.env.EMAIL_USER?.trim();
const mailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
const mailFrom = process.env.EMAIL_FROM || mailUser;
const mailService = process.env.EMAIL_SERVICE?.trim() || "gmail";

if (!mailUser || !mailPass) {
  throw new Error("Email service credentials are not configured. Set EMAIL_USER and EMAIL_PASS in .env.");
}

const transporter = nodemailer.createTransport(
  mailService.toLowerCase() === "gmail"
    ? {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: mailUser,
          pass: mailPass
        }
      }
    : {
        service: mailService,
        auth: {
          user: mailUser,
          pass: mailPass
        }
      }
);

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: mailFrom,
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}`);
    return result;
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, otp) => {
  const subject = "Verify Your Email - SmartSpend";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to SmartSpend!</h2>
      <p>Please verify your email address to complete your registration.</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
        <h3 style="color: #333; margin: 0;">Your Verification Code</h3>
        <div style="font-size: 32px; font-weight: bold; color: #007bff; margin: 10px 0;">${otp}</div>
      </div>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">SmartSpend - Your Personal Expense Tracker</p>
    </div>
  `;

  return await sendEmail(email, subject, html);
};