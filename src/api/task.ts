import { Task } from "../types/Task";

const API_URL = "http://localhost:5000";

function authHeader() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    headers: authHeader()
  });
  return res.json();
}

export async function createTask(
  title: string,
  description?: string
): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ title, description })
  });
  return res.json();
}

export async function updateTask(
  id: string,
  completed: boolean
) {
  await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ completed })
  });
}

export async function deleteTask(id: string) {
  await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: authHeader()
  });
}
