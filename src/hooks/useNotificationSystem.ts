import { useState, useEffect, useCallback } from 'react';
import { AppNotification } from '../types/Notification';
import { useLocalStorage } from './useLocalStorage';

export function useNotificationSystem() {
  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>('study-planner-notifications', []);
  const [unreadCount, setUnreadCount] = useState(0);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Add notification function
  const addNotification = useCallback((message: string, type: 'overdue' | 'reminder' | 'info' = 'info') => {
    const newNotification: AppNotification = {
      id: crypto.randomUUID(),
      message,
      time: new Date().toISOString(),
      read: false,
      type
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only last 50 notifications

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Study Planner', {
        body: message,
        icon: '/vite.svg'
      });
    }
  }, [setNotifications]);

  // Mark all notifications as read
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  // Update badge count (for external use)
  const updateBadgeCount = useCallback(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
    return count;
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    clearNotifications,
    updateBadgeCount
  };
}