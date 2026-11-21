const { prisma } = require('../config/db');
const serialize = require('../utils/serialize');

// ─── GET /notifications ────────────────────────────────────────────────────────

const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.status(200).json({ success: true, unreadCount, notifications: serialize(notifications) });
  } catch (error) {
    console.error('getNotifications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── PATCH /notifications/:id/read ────────────────────────────────────────────

const markAsRead = async (req, res) => {
  try {
    const { count } = await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { isRead: true },
    });

    if (count === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    res.status(200).json({ success: true, notification: serialize(notification) });
  } catch (error) {
    console.error('markAsRead error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── PATCH /notifications/read-all ────────────────────────────────────────────

const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('markAllAsRead error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
