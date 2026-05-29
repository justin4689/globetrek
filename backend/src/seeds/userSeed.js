const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

const seedUser = {
  firstName: 'Justin',
  lastName: 'Trah',
  email: 'justin@globetrek.com',
  password: 'password123',
  phone: '0102030405',
  countryCode: '+225',
  location: 'Abidjan, Côte d\'Ivoire',
  isEmailVerified: true,
};

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await User.deleteOne({ email: seedUser.email });
  const user = await User.create(seedUser);

  console.log('✅ User seeded:');
  console.log(`   Email    : ${user.email}`);
  console.log(`   Password : password123`);
  console.log(`   ID       : ${user._id}`);

  await mongoose.disconnect();
  console.log('✅ Done');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
