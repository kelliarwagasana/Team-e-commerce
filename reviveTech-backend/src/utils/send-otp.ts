import { sendOtpEmail, type OtpEmailPurpose } from "../services/email.service.js";
import { isEmailConfigured } from "../config/email.js";

export async function deliverOtpEmail(
  to: string,
  otp: string,
  purpose: OtpEmailPurpose,
): Promise<{ emailed: boolean; devOtp?: string }> {
  if (isEmailConfigured()) {
    try {
      await sendOtpEmail(to, otp, purpose);
      return { emailed: true };
    } catch (error) {
      if (process.env["NODE_ENV"] === "production") {
        throw error;
      }
      console.warn(`[Email] SMTP delivery failed; using dev OTP for ${to}: ${otp}`);
      return { emailed: false, devOtp: otp };
    }
  }

  if (process.env["NODE_ENV"] === "production") {
    throw new Error("Email delivery is not configured");
  }

  console.warn(`[Email] SMTP not configured — OTP for ${to}: ${otp}`);
  return { emailed: false, devOtp: otp };
}
