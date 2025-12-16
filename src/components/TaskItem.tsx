import React from 'react';
import { Calendar, Tag, CreditCard as Edit3, Trash2, CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (_id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (_id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

  const priorityColors = {
    Low: 'border-l-emerald-500 bg-gradient-to-r from-emerald-100/90 to-white/95 dark:bg-green-900/20',
    Medium: 'border-l-amber-500 bg-gradient-to-r from-amber-100/90 to-white/95 dark:bg-yellow-900/20',
    High: 'border-l-rose-500 bg-gradient-to-r from-rose-100/90 to-white/95 dark:bg-red-900/20'
  };

  const priorityBadgeColors = {
    Low: 'bg-emerald-100 text-emerald-800 dark:bg-green-800 dark:text-green-100',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-yellow-800 dark:text-yellow-100',
    High: 'bg-rose-100 text-rose-800 dark:bg-red-800 dark:text-red-100'
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className={`border-l-4 ${priorityColors[task.priority]} backdrop-blur-sm dark:bg-gray-800 rounded-r-xl shadow-md hover:shadow-lg transition-all duration-200 p-5 border border-indigo-200/50 dark:border-gray-700 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleComplete(task._id)}
            className={`mt-1 transition-colors ${task.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
          >
            {task.completed ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 dark:text-white ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {task.name}
            </h3>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              {task.dueDate && (
                <div className={`flex items-center text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                  {isOverdue && <AlertTriangle className="h-4 w-4 mr-1" />}
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(task.dueDate)}
                  {isOverdue && <span className="ml-1 font-medium">(Overdue)</span>}
                </div>
              )}

              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityBadgeColors[task.priority]}`}>
                {task.priority} Priority
              </span>
            </div>

            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={`${task._id}-${index}`}   // ✅ ALWAYS UNIQUE
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}



              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};