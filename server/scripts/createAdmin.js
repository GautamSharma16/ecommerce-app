/**
 * Make a user an admin. Run from server directory:
 *   node scripts/createAdmin.js admin@example.com
 * Or set ADMIN_EMAIL in .env
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const email = process.env.ADMIN_EMAIL || process.argv[2];
if (!email) {
  console.error('Usage: node scripts/createAdmin.js <email> or set ADMIN_EMAIL in .env');
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { role: 'admin' } },
    { new: true }
  );
  if (!user) {
    console.error('No user found with email:', email);
    process.exit(1);
  }
  console.log('User', email, 'is now an admin.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
