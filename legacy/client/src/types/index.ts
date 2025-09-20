export interface IUser {
  _id?: string;
  id?: string;
  username: string;
  email: string;
}

export interface ITask {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "To Do" | "In Progress" | "Done";
}

