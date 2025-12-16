import React, { useState, useMemo } from 'react';
import { Moon, Sun, GraduationCap } from 'lucide-react';
import { Task, TaskFormData } from './types/Task';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ProgressBar } from './components/ProgressBar';
import { FilterControls } from './components/FilterControls';
import { NotificationDropdown } from './components/NotificationDropdown';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotificationSystem } from './hooks/useNotificationSystem';
import { useTaskNotifications } from './hooks/useTaskNotifications';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('study-planner-tasks', []);
  const [darkMode, setDarkMode] = useLocalStorage('study-planner-dark-mode', false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  // Notification system
  const {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    clearNotifications
  } = useNotificationSystem();

  // Task-based notifications
  useTaskNotifications({ tasks, addNotification });

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      task.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      const tagMatch = selectedTag === '' || task.tags.includes(selectedTag);
      
     let statusMatch = true;

if (selectedStatus === 'completed') {
  statusMatch = task.completed;
}
else if (selectedStatus === 'pending') {
  statusMatch = !task.completed;
}
else if (selectedStatus === 'overdue') {
  if (task.dueDate) {
    statusMatch =
      !task.completed &&
      new Date(task.dueDate) < new Date();
  } else {
    statusMatch = false;
  }
}
      
      return tagMatch && statusMatch;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'dueDate':
        default:
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

    return filtered;
  }, [tasks, selectedTag, selectedStatus, sortBy]);

  const stats = useMemo(() => {
    const completed = tasks.filter(task => task.completed).length;
    const overdue = tasks.filter(task => {
      return !task.completed && task.dueDate && new Date(task.dueDate) < new Date();
    }).length;
    
    return { completed, total: tasks.length, overdue };
  }, [tasks]);

  const addTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      _id: crypto.randomUUID(),
      name: taskData.name,
      dueDate: taskData.dueDate,
      tags: taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      priority: taskData.priority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskData: TaskFormData) => {
    if (!editingTask) return;

    setTasks(prev => prev.map(task =>
      task._id === editingTask._id
        ? {
            ...task,
            name: taskData.name,
            dueDate: taskData.dueDate,
            tags: taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            priority: taskData.priority
          }
        : task
    ));

    setEditingTask(null);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task =>
      task._id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task._id !== id));
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `study-planner-tasks-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();

    if (permission === 'granted' && !localStorage.getItem('notif-info-shown')) {
      addNotification(
        "Notifications enabled! You'll receive reminders for upcoming tasks.",
        'info'
      );
      localStorage.setItem('notif-info-shown', 'true');
    }
  }
};

  // Request notification permission on first load
  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      requestNotificationPermission();
    }
  }, []);
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Planner</h1>
              <p className="text-gray-600 dark:text-gray-400">Organize your learning journey</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllRead={markAllRead}
              onClearAll={clearNotifications}
            />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Progress Overview */}
        <ProgressBar
          completed={stats.completed}
          total={stats.total}
          overdue={stats.overdue}
        />

        {/* Task Form */}
        <TaskForm
          onSubmit={editingTask ? updateTask : addTask}
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
        />

        {/* Filter Controls */}
        <FilterControls
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          availableTags={availableTags}
          onExport={exportTasks}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredAndSortedTasks}
          onToggleComplete={toggleTaskComplete}
          onEdit={setEditingTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;