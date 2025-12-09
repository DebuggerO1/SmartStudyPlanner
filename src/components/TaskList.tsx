import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { Task } from '../types/Task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-lg border border-indigo-200/60 dark:border-gray-700 p-8 text-center">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Create your first study task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <CheckCircle2 className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Your Study Tasks ({tasks.length})
        </h3>
      </div>
      
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};