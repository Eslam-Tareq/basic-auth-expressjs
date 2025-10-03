import nodemailer from "nodemailer";
import { mailOptions, nodemailerMailOptions } from "../types/email";

export const sendMail = async (options: mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const opt: nodemailerMailOptions = {
    from: `base-auth <${process.env.GMAIL_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(opt);
};
