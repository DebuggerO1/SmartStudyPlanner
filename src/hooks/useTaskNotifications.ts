import { useEffect, useCallback } from 'react';
import { Task } from '../types/Task';

interface UseTaskNotificationsProps {
  tasks: Task[];
  addNotification: (message: string, type?: 'overdue' | 'reminder' | 'info') => void;
}

export function useTaskNotifications({ tasks, addNotification }: UseTaskNotificationsProps) {
  // Check for overdue tasks
  const checkOverdueTasks = useCallback(() => {
    const now = new Date();
    const overdueTasks = tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < now;
    });

    // Get previously notified overdue tasks from localStorage
    const notifiedOverdue = JSON.parse(
      localStorage.getItem('study-planner-notified-overdue') || '[]'
    ) as string[];

    // Notify about new overdue tasks
    overdueTasks.forEach(task => {
      if (!notifiedOverdue.includes(task.id)) {
        addNotification(`Task "${task.name}" is now overdue!`, 'overdue');
        notifiedOverdue.push(task.id);
      }
    });

    // Clean up completed or deleted tasks from notified list
    const currentTaskIds = tasks.map(t => t.id);
    const cleanedNotified = notifiedOverdue.filter(id => 
      currentTaskIds.includes(id) && 
      tasks.find(t => t.id === id && !t.completed)
    );

    // Update localStorage
    localStorage.setItem('study-planner-notified-overdue', JSON.stringify(cleanedNotified));
  }, [tasks, addNotification]);

  // Check for tasks due soon (within 24 hours)
  const checkUpcomingTasks = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const upcomingTasks = tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate > now && dueDate <= tomorrow;
    });

    // Get previously notified upcoming tasks
    const notifiedUpcoming = JSON.parse(
      localStorage.getItem('study-planner-notified-upcoming') || '[]'
    ) as string[];

    // Notify about upcoming tasks (once per day)
    const today = now.toDateString();
    const lastNotificationDate = localStorage.getItem('study-planner-last-upcoming-check');

    if (lastNotificationDate !== today) {
      upcomingTasks.forEach(task => {
        if (!notifiedUpcoming.includes(task.id)) {
          const dueDate = new Date(task.dueDate!);
          const hoursUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));
          addNotification(`Task "${task.name}" is due in ${hoursUntilDue} hours`, 'reminder');
          notifiedUpcoming.push(task.id);
        }
      });

      localStorage.setItem('study-planner-last-upcoming-check', today);
      localStorage.setItem('study-planner-notified-upcoming', JSON.stringify(notifiedUpcoming));
    }
  }, [tasks, addNotification]);

  // Run checks when tasks change
  useEffect(() => {
    checkOverdueTasks();
    checkUpcomingTasks();
  }, [checkOverdueTasks, checkUpcomingTasks]);

  // Set up periodic checks
  useEffect(() => {
    const interval = setInterval(() => {
      checkOverdueTasks();
      checkUpcomingTasks();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkOverdueTasks, checkUpcomingTasks]);
}