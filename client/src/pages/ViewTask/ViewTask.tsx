import React, { useState } from "react";
import "./View.css";
import { updateTask } from "../../api";

const ViewTask = ({ task, onClose }: { task: ITask; onClose: () => void }) => {
  // Local state to manage task fields
  const [editedTask, setEditedTask] = useState({ ...task });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  // Save changes to the task
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Edited Task:", editedTask); // Debugging
    setLoading(true);
    try {
      const { data } = await updateTask(editedTask._id, editedTask); // Ensure id is not undefined
      console.log("Task updated successfully:", data);
      onClose();

    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="view-task-container">
      <div className="view-task-backdrop" onClick={onClose}></div>
      <dialog className="view-task-dialog" open>
        <h1 className="view-task-title">Edit Task</h1>
        <div className="view-task-form">
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              className="view-task-input"
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              className="view-task-textarea"
            />
          </label>
          <label>
            Priority:
            <select
              name="priority"
              value={editedTask.priority}
              onChange={handleChange}
              className="view-task-select"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <label>
            Status:
            <select
              name="status"
              value={editedTask.status}
              onChange={handleChange}
              className="view-task-select"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </label>
        </div>
        <div className="view-task-actions">
          <button
            onClick={handleSave}
            className="view-task-save"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button className="view-task-close" onClick={onClose}>
            Cancel
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default ViewTask;
