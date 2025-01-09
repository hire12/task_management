import { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../api"; // Ensure updateTaskStatus is defined in your API file

const TaskList = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await getTasks();
        setTasks(data.tasks);
      } catch (err) {
        alert("Error fetching tasks: " + err.message);
      }
    };

    fetchTasks();
  }, []);

  // Function to handle status change
  const handleStatusChange = async (taskId: string, newStatus: "Incomplete" | "Complete") => {
    try {
      const updatedTask = await updateTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: updatedTask.status } : task
        )
      );
    } catch (err) {
      alert("Error updating task status: " + err.message);
    }
  };

  return (
    <div className="task-management">
      <h1 className="task-management__header">Your Tasks</h1>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-item__content">
              <h2 className="task-item__title">{task.title}</h2>
              <p className="task-item__description">{task.description}</p>
              <div className="task-item__details">
                <span className={`task-item__priority task-item__priority--${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
                <span className={`task-item__status task-item__status--${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
                {/* Button to toggle the task status */}
                <button
                  className="task-item__status-toggle"
                  onClick={() =>
                    handleStatusChange(task.id, task.status === "Incomplete" ? "Complete" : "Incomplete")
                  }
                >
                  Toggle Status
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
