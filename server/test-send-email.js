const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const sendEmail = require('./src/models/sendEmail.cjs');

(async () => {
  try {
    console.log('Sending test email with config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.FROM_EMAIL,
      emailDebug: process.env.EMAIL_DEBUG,
    });
    const info = await sendEmail({
      to: process.env.SMTP_USER,
      subject: 'Test email from ecommerce-app',
      html: '<p>This is a test email from server/test-send-email.js</p>',
    });

    console.log('Send result:', info);
    process.exit(0);
  } catch (err) {
    console.error('Test send failed:', err);
    process.exit(1);
  }
})();
