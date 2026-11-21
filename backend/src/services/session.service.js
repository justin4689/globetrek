const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

// Refresh tokens are long random JWTs: a fast sha256 is enough to store them safely and look them up.
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const signAccessToken = (userId, sessionId) =>
  jwt.sign({ id: userId, sid: sessionId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    jwtid: crypto.randomUUID(),
  });

const signRefreshToken = (userId, sessionId) =>
  jwt.sign({ id: userId, sid: sessionId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    // Unique id: two tokens signed in the same second must still differ (rotation relies on it)
    jwtid: crypto.randomUUID(),
  });

const expiryOf = (token) => new Date(jwt.decode(token).exp * 1000);

/** Opens a new session (one per device) and returns its tokens. */
async function createSession(userId) {
  // Housekeeping: drop this user's expired sessions
  await prisma.session.deleteMany({ where: { userId, expiresAt: { lt: new Date() } } });

  const session = await prisma.session.create({
    data: { userId, tokenHash: '', expiresAt: new Date() },
  });
  return issueTokens(userId, session.id);
}

/** Signs a new token pair for an existing session and stores the new refresh token hash (rotation). */
async function issueTokens(userId, sessionId) {
  const accessToken = signAccessToken(userId, sessionId);
  const refreshToken = signRefreshToken(userId, sessionId);
  await prisma.session.update({
    where: { id: sessionId },
    data: { tokenHash: hashToken(refreshToken), expiresAt: expiryOf(refreshToken) },
  });
  return { accessToken, refreshToken };
}

/**
 * Validates a refresh token against its session and rotates it.
 * Returns null when the token is invalid, expired, revoked, or already used.
 */
async function rotateSession(refreshToken) {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    return null;
  }
  if (!decoded.sid) return null; // token issued before sessions existed

  const session = await prisma.session.findUnique({ where: { id: decoded.sid } });
  if (!session || session.userId !== decoded.id || session.expiresAt < new Date()) return null;

  if (session.tokenHash !== hashToken(refreshToken)) {
    // An old refresh token was replayed: treat the session as compromised and close it
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return { userId: session.userId, ...(await issueTokens(session.userId, session.id)) };
}

const isSessionActive = async (sessionId) => {
  const session = await prisma.session.findUnique({ where: { id: sessionId }, select: { expiresAt: true } });
  return !!session && session.expiresAt > new Date();
};

const endSession = (sessionId) => prisma.session.deleteMany({ where: { id: sessionId } });

/** Signs out every device of a user, optionally keeping one session (e.g. the current one). */
const endAllSessions = (userId, exceptSessionId) =>
  prisma.session.deleteMany({
    where: { userId, ...(exceptSessionId && { NOT: { id: exceptSessionId } }) },
  });

module.exports = { createSession, rotateSession, isSessionActive, endSession, endAllSessions };
