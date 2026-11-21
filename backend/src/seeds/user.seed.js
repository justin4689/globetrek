const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');

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
  await prisma.$connect();
  console.log('✅ Connected to MySQL');

  await prisma.user.deleteMany({ where: { email: seedUser.email } });
  const user = await prisma.user.create({
    data: { ...seedUser, password: await bcrypt.hash(seedUser.password, 12) },
  });

  console.log('✅ User seeded:');
  console.log(`   Email    : ${user.email}`);
  console.log(`   Password : password123`);
  console.log(`   ID       : ${user.id}`);

  await prisma.$disconnect();
  console.log('✅ Done');
}

seed().catch(async (err) => {
  console.error('❌ Seed failed:', err.message);
  await prisma.$disconnect();
  process.exit(1);
});
