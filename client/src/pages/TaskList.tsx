import { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../api";
import ViewTask from "./ViewTask/ViewTask";

const TaskList = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  // Fetch tasks function
  const fetchTasks = async () => {
    try {
      // Fetch the tasks from the API
      const { data } = await getTasks();
      console.log("Fetched tasks:", data); // Log the API response for debugging
      if (data && data.tasks) {
        setTasks(data.tasks);
      } else {
        console.error("No tasks found in the response");
        alert("No tasks found.");
      }
    } catch (err) {
      console.error("Error fetching tasks: ", err);
      alert("Error fetching tasks: " + err.message);
    }
  };

  // Use effect to fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskClick = (task: ITask) => {
    setSelectedTask(task); // Set the clicked task as selected
  };

  const closePopup = () => {
    setSelectedTask(null); // Close the popup
    fetchTasks(); // Re-fetch tasks after closing the popup
  };

  return (
    <div className="task-management">
    <h1 className="task-management__header">Your Tasks</h1>
    <div className="task-board">
      {["To Do", "In Progress", "Done"].map((status) => (
      // {["Incomplete", "Complete", "Done"].map((status) => (
        <div className="task-list" key={status}>
          <h2>{status}</h2>
          <ul>
            {tasks.length === 0 ? (
              <li>No tasks available</li>  // Add fallback for empty tasks array
            ) : (
              tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <li key={task.id} className="task-item" onClick={() => handleTaskClick(task)}>
                    <div className="task-item__content">
                      <h2 className="task-item__title">{task.title}</h2>
                      <p className="task-item__description">{task.description}</p>
                      <div className="task-item__details">
                        <span className={`task-item__priority task-item__priority--${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        <span
                          className={`task-item__status task-item__status--${
                            task.status === "To Do"
                              ? "todo"
                              : task.status.toLowerCase().replace(" ", "-")
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
            )}
          </ul>
        </div>
      ))}
    </div>
    {selectedTask && <ViewTask task={selectedTask} onClose={closePopup} />}
  </div>
  );
};

export default TaskList;
