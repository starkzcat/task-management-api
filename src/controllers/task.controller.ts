import { Request, Response } from "express";
import { taskService } from "../services/task.service";
import { asyncHandler } from "../utils/asyncHandler";
import {
  CreateTaskInput,
  UpdateTaskInput,
  GetTasksQuery,
} from "../validators/task.validator";

export class TaskController {
  createTask = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const data = req.body as CreateTaskInput;

    const task = await taskService.createTask(userId, data);

    res.status(201).json({
      status: "success",
      data: { task },
    });
  });

  getTasks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const query = req.query as unknown as GetTasksQuery;

    const result = await taskService.getTasks(userId, query);

    res.status(200).json({
      status: "success",
      data: result,
    });
  });

  getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const task = await taskService.getTaskById(userId, id);

    res.status(200).json({
      status: "success",
      data: { task },
    });
  });

  updateTask = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = req.body as UpdateTaskInput;

    const task = await taskService.updateTask(userId, id, data);

    res.status(200).json({
      status: "success",
      data: { task },
    });
  });

  deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const result = await taskService.deleteTask(userId, id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  });

  getTaskStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const stats = await taskService.getTaskStats(userId);

    res.status(200).json({
      status: "success",
      data: stats,
    });
  });
}

export const taskController = new TaskController();
