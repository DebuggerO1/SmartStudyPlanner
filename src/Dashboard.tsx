import React, { useState, useMemo, useEffect } from "react";
import { Moon, Sun, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

import { Task, TaskFormData } from "./types/Task";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { ProgressBar } from "./components/ProgressBar";
import { FilterControls } from "./components/FilterControls";
import { NotificationDropdown } from "./components/NotificationDropdown";
import ProfileDropdown from "./components/ProfileDropdown";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useNotificationSystem } from "./hooks/useNotificationSystem";
import { useTaskNotifications } from "./hooks/useTaskNotifications";
import { fetchWithAuth } from "./utils/fetchWithAuth";

const API_URL = "http://localhost:5000/api/tasks";

function Dashboard() {
    // ---------------- STATE ----------------
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [darkMode, setDarkMode] = useLocalStorage(
        "study-planner-dark-mode",
        false
    );

    const [selectedTag, setSelectedTag] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [sortBy, setSortBy] = useState("dueDate");

    // ---------------- NOTIFICATIONS ----------------
    const {
        notifications,
        unreadCount,
        addNotification,
        markAllRead,
        clearNotifications
    } = useNotificationSystem();

    useTaskNotifications({ tasks, addNotification });

    // ---------------- FETCH TASKS ----------------
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetchWithAuth(API_URL);
                const data = await res.json();
                setTasks(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Fetch tasks error:", err);
                setTasks([]);
            }
        };

        fetchTasks();
    }, []);

    // ---------------- CREATE TASK ----------------
    const addTask = async (data: TaskFormData) => {
        try {
            const res = await fetchWithAuth(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: data.title,
                    dueDate: data.dueDate || null,
                    priority: data.priority,
                    tags: data.tags.split(",").map(t => t.trim())
                })
            });
            const createdTask = await res.json();
            setTasks(prev => [...prev, createdTask]);
            toast.success("Task created");
        } catch {
            toast.error("Task creation failed");
        }
    };

    // ---------------- UPDATE TASK ----------------
    const updateTask = async (data: TaskFormData) => {
        if (!editingTask) return;

        try {
            const res = await fetchWithAuth(`${API_URL}/${editingTask._id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: data.title,
                    dueDate: data.dueDate || undefined,
                    priority: data.priority,
                    tags: data.tags
                        .split(",")
                        .map(t => t.trim())
                        .filter(Boolean)
                })
            });

            const updated = await res.json();
            setTasks(prev =>
                prev.map(t => (t._id === updated._id ? updated : t))
            );
            setEditingTask(null);
            toast.success("Task updated");
        } catch {
            toast.error("Task update failed");
        }
    };

    // ---------------- TOGGLE COMPLETE ----------------
    const toggleTaskComplete = async (id: string) => {
        const task = tasks.find(t => t._id === id);
        if (!task) return;

        try {
            const res = await fetchWithAuth(`${API_URL}/${id}`, {
                method: "PUT",
                body: JSON.stringify({ completed: !task.completed })
            });

            const updated = await res.json();
            setTasks(prev =>
                prev.map(t => (t._id === id ? updated : t))
            );
        } catch {
            toast.error("Failed to update task");
        }
    };

    // ---------------- DELETE TASK ----------------
    const deleteTask = async (id: string) => {
        try {
            await fetchWithAuth(`${API_URL}/${id}`, { method: "DELETE" });
            setTasks(prev => prev.filter(t => t._id !== id));
            toast.success("Task deleted");
        } catch {
            toast.error("Delete failed");
        }
    };

    // ---------------- FILTER TAGS ----------------
    const availableTags = useMemo(() => {
        const set = new Set<string>();
        tasks.forEach(t => t.tags.forEach(tag => set.add(tag)));
        return Array.from(set).sort();
    }, [tasks]);

    // ---------------- FILTER + SORT ----------------
    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks.filter(task => {
            const tagMatch =
                selectedTag === "" || task.tags.includes(selectedTag);

            let statusMatch = true;
            if (selectedStatus === "completed") statusMatch = task.completed;
            else if (selectedStatus === "pending") statusMatch = !task.completed;
            else if (selectedStatus === "overdue") {
                statusMatch =
                    !!task.dueDate &&
                    !task.completed &&
                    new Date(task.dueDate) < new Date();
            }

            return tagMatch && statusMatch;
        });

        filtered.sort((a, b) => {
            const priorityOrder = { High: 3, Medium: 2, Low: 1 };

            switch (sortBy) {
                case "priority":
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case "title":
                    return a.title.localeCompare(b.title);
                case "created":
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                case "dueDate":
                default:
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return (
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime()
                    );
            }
        });

        return filtered;
    }, [tasks, selectedTag, selectedStatus, sortBy]);

    // ---------------- STATS ----------------
    const stats = useMemo(() => {
        const completed = tasks.filter(t => t.completed).length;
        const overdue = tasks.filter(
            t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
        ).length;

        return { completed, total: tasks.length, overdue };
    }, [tasks]);

    // ---------------- UI ----------------
    return (
        <div
            className={`min-h-screen ${darkMode
                    ? "dark bg-gray-900"
                    : "bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"
                }`}
        >
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Study Planner
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Organize your learning journey
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <NotificationDropdown
                            notifications={notifications}
                            unreadCount={unreadCount}
                            onMarkAllRead={markAllRead}
                            onClearAll={clearNotifications}
                        />
                        <button onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? <Sun /> : <Moon />}
                        </button>
                        <ProfileDropdown />
                    </div>
                </header>

                <ProgressBar {...stats} />

                <TaskForm
                    onSubmit={editingTask ? updateTask : addTask}
                    editingTask={editingTask}
                    onCancel={() => setEditingTask(null)}
                />

                <FilterControls
                    selectedTag={selectedTag}
                    onTagChange={setSelectedTag}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    availableTags={availableTags}
                    onExport={() => { }}
                />

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

export default Dashboard;
