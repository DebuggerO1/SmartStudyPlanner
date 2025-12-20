import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit3, X } from 'lucide-react';
import { Task, TaskFormData } from '../types/Task';

interface TaskFormProps {
  onSubmit: (taskData: TaskFormData) => void;
  editingTask?: Task | null;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, editingTask, onCancel }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    dueDate: '',
    description: '',
    tags: '',
    priority: 'Medium'
  });

 useEffect(() => {
 if (editingTask) {
  setFormData({
    title: editingTask.title,
    description: editingTask.description ?? '',
    dueDate: editingTask.dueDate ?? '',
    tags: editingTask.tags.join(', '),
    priority: editingTask.priority
  });
  } else {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      tags: '',
      priority: 'Medium'
    });
  }
}, [editingTask]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit(formData);
    
    if (!editingTask) {
      setFormData({
        title: '',
        description: '', 
        dueDate: '',
        tags: '',
        priority: 'Medium'
      });
    }
  };

  const priorityColors = {
    Low: 'border-emerald-300 focus:border-emerald-500',
    Medium: 'border-amber-300 focus:border-amber-500',
    High: 'border-rose-300 focus:border-rose-500'
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-lg border border-indigo-200/60 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          {editingTask ? <Edit3 className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </h2>
        {editingTask && onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task Name
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Revise DBMS notes"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${priorityColors[formData.priority]}`}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., Coding Practice, High Priority (comma-separated)"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          {editingTask ? <Edit3 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};