import { Request, Response } from "express";
import Task from "../models/Task";

export const newTask = async (req: Request, res: Response ) => {
    const {title, description, dueDate, priority} = req.body;

    try {
        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            userId: (req as any).user.id,
        });
        await task.save();
        res.status(201).json({ msg: "Task Created success" });
    } catch(err) {
        res.status(500).json({ mgs: "server Error", error: err })
    }
};


export const getTask = async (req: Request, res: Response) => {
    try {
        const task = Task.find({ userId: (req as any).user.id,  });
        res.status(200).json({ task })
    } catch(err) {
        res.status(500).json({ msg: "server error", error: err })
    }
}
