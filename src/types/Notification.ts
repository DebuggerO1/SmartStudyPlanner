export interface AppNotification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: 'overdue' | 'reminder' | 'info';
}

export interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (message: string, type?: 'overdue' | 'reminder' | 'info') => void;
  markAllRead: () => void;
  clearNotifications: () => void;
}