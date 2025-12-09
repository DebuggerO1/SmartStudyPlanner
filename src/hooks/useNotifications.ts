import { useEffect } from 'react';
import { Task } from '../types/Task';

export function useNotifications(tasks: Task[]) {
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check for tasks due tomorrow
    const checkDueTasks = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setHours(23, 59, 59, 999);

      const dueTasks = tasks.filter(task => {
        if (task.completed || !task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= tomorrow && dueDate <= tomorrowEnd;
      });

      if (dueTasks.length > 0 && Notification.permission === 'granted') {
        dueTasks.forEach(task => {
          new Notification('Study Reminder', {
            body: `"${task.name}" is due tomorrow!`,
            icon: '/vite.svg'
          });
        });
      }
    };

    // Check daily at 9 AM
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(9, 0, 0, 0);

    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilScheduled = scheduledTime.getTime() - now.getTime();
    const timeout = setTimeout(checkDueTasks, timeUntilScheduled);

    return () => clearTimeout(timeout);
  }, [tasks]);
}