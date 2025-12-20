export interface Task {
  _id: string;                  // MongoDB id
  title: string;                // ✅ backend aligned
  description?: string;         // optional
  dueDate?: string;
  tags: string[];
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  createdAt: string;
}

export interface TaskFormData {
  title: string;                // ✅ title
  description?: string;         // optional
  dueDate: string;
  tags: string;
  priority: 'Low' | 'Medium' | 'High';
}
