import { useEffect, useCallback } from 'react';
import { Task } from '../types/Task';

interface UseTaskNotificationsProps {
  tasks: Task[];
  addNotification: (message: string, type?: 'overdue' | 'reminder' | 'info') => void;
}

export function useTaskNotifications({ tasks, addNotification }: UseTaskNotificationsProps) {

  // 🔴 Overdue tasks check (ONLY ONCE per task)
  const checkOverdueTasks = useCallback(() => {
    const now = new Date();

    const overdueTasks = tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      return new Date(task.dueDate) < now;
    });

    const notifiedOverdue = new Set<string>(
      JSON.parse(localStorage.getItem('study-planner-notified-overdue') || '[]')
    );

    overdueTasks.forEach(task => {
      if (!notifiedOverdue.has(task._id)) {
        addNotification(`Task "${task.title}" is now overdue!`, 'overdue');
        notifiedOverdue.add(task._id);
      }
    });

    // Remove tasks that are completed or deleted
    const validIds = new Set(tasks.filter(t => !t.completed).map(t => t._id));
    const cleaned = Array.from(notifiedOverdue).filter(id => validIds.has(id));

    localStorage.setItem(
      'study-planner-notified-overdue',
      JSON.stringify(cleaned)
    );
  }, [tasks, addNotification]);

  // 🟡 Upcoming tasks (once per day)
  const checkUpcomingTasks = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingTasks = tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate > now && dueDate <= tomorrow;
    });

    const notifiedUpcoming = new Set<string>(
      JSON.parse(localStorage.getItem('study-planner-notified-upcoming') || '[]')
    );

    const today = now.toDateString();
    const lastCheck = localStorage.getItem('study-planner-last-upcoming-check');

    if (lastCheck !== today) {
      upcomingTasks.forEach(task => {
        if (!notifiedUpcoming.has(task._id)) {
          const dueDate = new Date(task.dueDate!);
          const hoursUntilDue = Math.ceil(
            (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
          );

          addNotification(
            `Task "${task.title}" is due in ${hoursUntilDue} hours`,
            'reminder'
          );

          notifiedUpcoming.add(task._id);
        }
      });

      localStorage.setItem(
        'study-planner-notified-upcoming',
        JSON.stringify(Array.from(notifiedUpcoming))
      );
      localStorage.setItem('study-planner-last-upcoming-check', today);
    }
  }, [tasks, addNotification]);

  // Run once when tasks change
  useEffect(() => {
    checkOverdueTasks();
    checkUpcomingTasks();
  }, [checkOverdueTasks, checkUpcomingTasks]);

  // Periodic check (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      checkOverdueTasks();
      checkUpcomingTasks();
    }, 60000);

    return () => clearInterval(interval);
  }, [checkOverdueTasks, checkUpcomingTasks]);
}
