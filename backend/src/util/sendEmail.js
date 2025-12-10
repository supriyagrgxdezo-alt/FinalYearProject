require("dotenv").config();
const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

async function sendVerificationEmail(to, subject, body) {
  if (!to) {
    throw new Error("No recipient email provided.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    html: body,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Email sent to:", to);
  console.log("Accepted:", info.accepted);
  console.log("Rejected:", info.rejected);

  if (info.rejected && info.rejected.length > 0) {
    throw new Error(
      "Email address not found or invalid. Please check and try again.",
    );
  }

  return info;
}

module.exports = sendVerificationEmail;
