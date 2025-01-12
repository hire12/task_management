import React, { useState } from "react";
import "./View.css";
import { updateTask } from "../../api";

const ViewTask = ({ task, onClose }: { task: ITask; onClose: () => void }) => {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateTask(editedTask._id, editedTask);
      console.log("Task updated successfully:", data);
      setIsEditing(false);
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
        {!isEditing ? (
          // Normal view
          <div className="view-task-content">
            <h1 className="view-task-title">{task.title}</h1>
            <p className="view-task-description">{task.description}</p>
            <p className="view-task-priority">
              <strong>Priority:</strong> {task.priority}
            </p>
            <p className="view-task-status">
              <strong>Status:</strong> {task.status}
            </p>
            <div className="view-task-actions">
              <button onClick={() => setIsEditing(true)} className="view-task-edit">
                Edit Task
              </button>
              <button className="view-task-close" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          // Edit mode
          <form className="view-task-form" onSubmit={handleSave}>
            <h1 className="view-task-title">Edit Task</h1>
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
            <div className="view-task-actions">
              <button
                type="submit"
                className="view-task-save"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="view-task-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
};

export default ViewTask;
