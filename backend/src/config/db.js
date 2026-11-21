const { PrismaClient } = require('@prisma/client');

// Sensitive fields are hidden by default (equivalent of Mongoose `select: false`).
// Re-enable them per query with `omit: { password: false }`.
const prisma = new PrismaClient({
  omit: {
    user: { password: true, otp: true, otpExpiry: true, refreshToken: true },
  },
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('MySQL connected (Prisma)');
  } catch (error) {
    console.error(`MySQL connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
