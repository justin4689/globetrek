const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const { prisma } = require('../config/db');

const { destinations } = require('./data/destinations');

async function seed() {
  await prisma.$connect();
  console.log('✅ Connected to MySQL');

  await prisma.destination.deleteMany({}); // cascades to reviews, favorites, reservations

  const inserted = [];
  for (const { reviews = [], ...data } of destinations) {
    inserted.push(
      await prisma.destination.create({
        data: { ...data, reviews: { create: reviews } },
      })
    );
  }

  console.log(`✅ ${inserted.length} destinations seeded:`);
  inserted.forEach((d) => console.log(`   [${d.isFeatured ? 'FEATURED' : '       '}] ${d.name} (${d.country}) — $${d.price} — ${d.category} — id: ${d.id}`));

  await prisma.$disconnect();
  console.log('✅ Done');
}

seed().catch(async (err) => {
  console.error('❌ Seed failed:', err.message);
  await prisma.$disconnect();
  process.exit(1);
});
