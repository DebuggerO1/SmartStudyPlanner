import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProgressBarProps {
  completed: number;
  total: number;
  overdue: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, overdue }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-lg border border-indigo-200/60 dark:border-gray-700 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Progress Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{completed}</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Remaining</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{total - completed}</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Overdue</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{overdue}</div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};