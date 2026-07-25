/**
 * Email sending is skipped on Cloudflare Edge (nodemailer needs Node).
 * Enquiries are still saved to Firestore; emails can be wired later via Resend/API.
 */
export async function sendEnquiryEmails(_enquiry: {
  fullName: string;
  email: string;
  whatsapp: string;
  destination?: string | null;
  hotelCategory?: string | null;
  checkIn?: Date | null;
  checkOut?: Date | null;
  message?: string | null;
}) {
  // Intentionally no-op on Edge-compatible deploys.
  return;
}
