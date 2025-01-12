import { useEffect, useState } from "react";
import { getTasks } from "../api";
import ViewTask from "./ViewTask/ViewTask";
import TaskListHeader from "./TaskHeader/TaskHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskList = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  // Fetch tasks function
  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      if (data && data.tasks) {
        setTasks(data.tasks);
      } else {
        console.error("No tasks found in the response");
      }
    } catch (err) {
      console.error("Error fetching tasks: ", err);
    }
  };

  // Fetch tasks on initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskClick = (task: ITask) => setSelectedTask(task);

  const closePopup = () => {
    setSelectedTask(null); // Close task view
    fetchTasks(); // Refresh task list
  };

  return (
    <>
      <TaskListHeader fetchTasks={fetchTasks} />
      <div className="task-management">
        <h1 className="task-management__header">Your Tasks</h1>
        <div className="task-board">
          {["To Do", "In Progress", "Done"].map((status) => (
            <div className="task-list" key={status}>
              <h2>{status}</h2>
              <ul>
                {tasks.length === 0 ? (
                  <li>No tasks available</li>
                ) : (
                  tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <li key={task.id || index} className="task-item" onClick={() => handleTaskClick(task)}>
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
                            }`}>
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
            <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default TaskList;
