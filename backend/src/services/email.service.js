const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: process.env.BREVO_SMTP_SECURE === "true",
  auth: {
    user: process.env.BREVO_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

// Verify SMTP connection on startup
transporter.verify((error) => {
  if (error) {
    console.error("[Email] SMTP connection failed:", error.message);
  } else {
    console.log("[Email] SMTP ready — connected to", process.env.BREVO_SMTP_HOST);
  }
});

/**
 * @param {string} to      - recipient email
 * @param {string} subject
 * @param {string} text    - plain text body
 * @param {string} [html]  - optional HTML body
 */
async function sendEmail(to, subject, text, html) {
  const info = await transporter.sendMail({
    from: `"GlobeTrek" <${process.env.BREVO_FROM_EMAIL}>`,
    to,
    subject,
    text,
    ...(html && { html }),
  });

  console.log(`[Email] Sent to ${to} — "${subject}" (messageId: ${info.messageId})`);
}

module.exports = sendEmail;
