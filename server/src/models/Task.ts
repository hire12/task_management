import mongoose, { Schema, Document } from "mongoose";

// Define the Task interface
export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  priority: "Low" | "Medium" | "High";
  status: "Incomplete" | "Complete";
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Task schema
const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Incomplete", "Complete"],
      default: "Incomplete",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Task model
const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;
