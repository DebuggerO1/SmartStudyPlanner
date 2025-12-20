const Task = require("../models/Task");

// ============================
// CREATE TASK
// ============================
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, tags } = req.body;

    // ✅ frontend + model aligned
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const task = await Task.create({
      title,
      description: description || "",
      dueDate,
      priority,
      tags,
      user: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// GET USER TASKS
// ============================
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// UPDATE TASK
// ============================
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, tags, completed } = req.body;

    const task = await Task.findOne({
      _id: id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ update only provided fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (tags !== undefined) task.tags = tags;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// DELETE TASK
// ============================
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
