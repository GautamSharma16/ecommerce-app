/**
 * One-time script to make a user an admin.
 * Run from server directory: node ../deploy/create-admin.js
 * Or with env: MONGO_URI=... node deploy/create-admin.js
 *
 * Usage: Set ADMIN_EMAIL in env or pass as first arg.
 * Example: ADMIN_EMAIL=admin@example.com node deploy/create-admin.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
dotenv.config({ path: join(root, 'server', '.env') });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
}, { collection: 'users' });
const User = mongoose.model('User', UserSchema);

const email = process.env.ADMIN_EMAIL || process.argv[2];
if (!email) {
  console.error('Usage: ADMIN_EMAIL=user@example.com node create-admin.js');
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
  const result = await User.updateOne(
    { email },
    { $set: { role: 'admin' } }
  );
  if (result.matchedCount === 0) {
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
