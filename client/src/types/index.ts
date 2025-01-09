export interface IUser {
    id: string;
    username: string;
    email: string;
  }

  export interface ITask {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: "Low" | "Medium" | "High";
    status: "Incomplete" | "Complete";
  }
