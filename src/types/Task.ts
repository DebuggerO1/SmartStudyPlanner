export interface Task {
  _id: string;   // ✅ MongoDB id
  name: string;
  dueDate?: string;   // optional (backend may not send)
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
