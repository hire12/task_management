import express from "express";
import { createTask, getTasks, getTaskById, updateTask, deleteTask,
} from "../controller/taskController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// Create a new task
router.post("/tasks", authenticate, createTask);

// Get all tasks for the logged-in user
router.get("/tasks", authenticate, getTasks);

// Get a specific task by ID
router.get("/tasks/:id", authenticate, getTaskById);

// Update a specific task
router.put("/tasks/:id", authenticate, updateTask);

// Delete a task
router.delete("/tasks/:id", authenticate, deleteTask);

export default router;
