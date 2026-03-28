const nodemailer = require('nodemailer');

const toBool = (value) => String(value).toLowerCase() === 'true';
const mask = (value = '') => {
  if (!value) return '[missing]';
  if (value.length <= 4) return '****';
  return `${value.slice(0, 2)}***${value.slice(-2)}`;
};

const sendEmail = async ({ to, subject, html }) => {
  const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = toBool(process.env.SMTP_SECURE || 'false');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromName = process.env.FROM_NAME || 'Ecommerce App';
  const fromEmail = process.env.FROM_EMAIL || user;
  const emailDebug = toBool(process.env.EMAIL_DEBUG || 'false');

  if (!user || !pass) {
    const err = new Error('SMTP_USER or SMTP_PASS is missing. Check server/.env');
    err.code = 'SMTP_CONFIG_MISSING';
    throw err;
  }

  if (!fromEmail) {
    const err = new Error('FROM_EMAIL is missing. Set FROM_EMAIL in server/.env');
    err.code = 'FROM_EMAIL_MISSING';
    throw err;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  if (emailDebug) {
    console.log('[mail] Sending email with config:', {
      host,
      port,
      secure,
      user: mask(user),
      pass: mask(pass),
      fromEmail,
      to,
      subject,
    });
  }

  if (emailDebug) {
    await transporter.verify();
    console.log('[mail] SMTP transporter verify success');
  }

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
  });

  console.log('✅ Email sent successfully:', {
    to,
    subject,
    messageId: info.messageId,
    response: info.response,
  });
  return info;
};

module.exports = sendEmail;
