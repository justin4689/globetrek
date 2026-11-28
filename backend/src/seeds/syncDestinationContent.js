// Updates destination text, photos and reviews from data/destinations.js WITHOUT wiping the
// database: reservations, favorites and users are kept (destinationSeed.js deletes everything).
// Destinations are matched by name; `renamed` maps old names still in the database to new ones.
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const { prisma } = require('../config/db');
const { destinations } = require('./data/destinations');

const renamed = { 'Mont Everest': 'Mount Everest' };

// Reservations and notifications keep a copy of the destination name: rename it there too
async function renameEverywhere(from, to) {
  await prisma.reservation.updateMany({ where: { destinationName: from }, data: { destinationName: to } });
  const notifications = await prisma.notification.findMany({ where: { destination: from } });
  for (const n of notifications) {
    await prisma.notification.update({
      where: { id: n.id },
      data: { destination: to, subtitle: n.subtitle.split(from).join(to) },
    });
  }
}

async function sync() {
  for (const { reviews = [], ...data } of destinations) {
    const oldName = Object.keys(renamed).find((old) => renamed[old] === data.name);
    const existing = await prisma.destination.findFirst({
      where: { name: { in: [data.name, oldName].filter(Boolean) } },
    });
    if (!existing) {
      console.log(`⚠️  ${data.name}: not in the database, skipped (run npm run db:seed for a full reset)`);
      continue;
    }
    await prisma.$transaction([
      prisma.destination.update({ where: { id: existing.id }, data }),
      prisma.review.deleteMany({ where: { destinationId: existing.id } }),
      prisma.review.createMany({ data: reviews.map((r) => ({ ...r, destinationId: existing.id })) }),
    ]);
    if (existing.name !== data.name) await renameEverywhere(existing.name, data.name);
    console.log(`✅ ${existing.name === data.name ? data.name : `${existing.name} → ${data.name}`}`);
  }
}

sync()
  .catch((err) => {
    console.error('❌ Sync failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
