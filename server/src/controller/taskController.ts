import { Request, Response } from "express";
import Task from "../models/Task";

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, priority } = req.body;

  try {
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      userId: (req as any).user.id,
    });
    await task.save();

    res.status(201).json({ message: "Task created successfully.", task });
  } catch (err) {
    res.status(500).json({ message: "Error creating task.", error: err });
  }
};

// Get all tasks for the logged-in user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ userId: (req as any).user.id });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks.", error: err });
  }
};

// Get a specific task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: (req as any).user.id });
    if (!task) {
        res.status(404).json({ message: "Task not found." });
      return
    }

    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: "Error fetching task.", error: err });
  }
};

// Update a specific task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: (req as any).user.id },
      req.body,
      { new: true }
    );
    if (!updatedTask) {
      res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task updated successfully.", updatedTask });
  } catch (err) {
    res.status(500).json({ message: "Error updating task.", error: err });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: (req as any).user.id,
    });
    if (!deletedTask) {
      res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task deleted successfully.", deletedTask });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task.", error: err });
  }
};
