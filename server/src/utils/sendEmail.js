const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your@gmail.com",
      pass: "your_app_password",
    },
  });

  await transporter.sendMail({
    to: options.email,
    subject: options.subject,
    text: options.message,
  });
};

module.exports = sendEmail;