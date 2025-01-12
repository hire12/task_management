import React, { useState } from "react";
import NewTask from "../CreateTask/CreateTask";

const TaskListHeader = ({ fetchTasks }: { fetchTasks: () => void }) => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateTask = () => setShowForm(true);

  // Handle close form and refresh task list
  const handleCloseForm = () => {
    fetchTasks();  // Re-fetch the tasks list after closing the modal
    setShowForm(false);  // Close the modal
  };

  return (
    <div>
      <div className="task-list-header">
        <h1 className="task-list-heading">Achieve Your Goals, One Task at a Time</h1>
        <p className="task-list-subheading">
          Stay focused, stay organized, and make progress with each task you complete.
        </p>
        <button className="create-task-btn" onClick={handleCreateTask}>
          Create Task
        </button>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={handleCloseForm}>
              &times;
            </button>
            {/* Pass both fetchTasks and handleCloseForm to NewTask */}
            <NewTask fetchTasks={fetchTasks} onClose={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListHeader;
