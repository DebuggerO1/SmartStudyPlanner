export interface Task {
  id: string;
  name: string;
  dueDate: string;
  tags: string[];
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  createdAt: string;
}

export interface TaskFormData {
  name: string;
  dueDate: string;
  tags: string;
  priority: 'Low' | 'Medium' | 'High';
}