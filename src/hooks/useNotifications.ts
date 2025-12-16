import { useState, useCallback, useMemo } from 'react';
import { AppNotification } from '../types/Notification';

export function useNotificationSystem() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // ✅ Derived state (NO useEffect)
  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  // ✅ Stable function (NO re-creation)
  const addNotification = useCallback(
    (message: string, type: 'overdue' | 'reminder' | 'info' = 'info') => {
      setNotifications(prev => [
        {
          id: crypto.randomUUID(),
          message,
          type,
          time: new Date().toLocaleTimeString(),
          read: false
        },
        ...prev
      ]);
    },
    []
  );

  const markAllRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    clearNotifications
  };
}
