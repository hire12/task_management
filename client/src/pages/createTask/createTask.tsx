import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTask } from "../../api";

interface NewTaskProps {
  onClose: () => void;
  fetchTasks: () => void;
}

export default function NewTask({ fetchTasks, onClose }: NewTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !dueDate) {
      toast.error("Title, Description, and Due Date are required.");
      return;
    }

    const newTask = {
      title,
      description,
      priority,
      dueDate,
    };

    setLoading(true);

    try {
      const { data } = await createTask(newTask);
      toast.success("Task created successfully!");

      // Reset the form
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");

      // Close the form and refresh the task list
      onClose();
      fetchTasks();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create task.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-task-container">
      <h2 className="new-task-title">Create New Task</h2>
      <form className="new-task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority" className="form-label">Priority</label>
          <select
            id="priority"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">Due Date</label>
          <input
            id="dueDate"
            type="date"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="form-submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
