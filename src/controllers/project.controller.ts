import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validators/project.validator";
import { projectService } from "../services/project.service";

export class ProjectController {
  createProject = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const data = req.body as CreateProjectInput;

    const project = await projectService.createProject(userId, data);

    res.status(201).json({
      status: "success",
      data: { project },
    });
  });

  getProjects = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const projects = await projectService.getProjects(userId);

    res.status(200).json({
      status: "success",
      data: { projects },
    });
  });

  getProjectById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const project = await projectService.getProjectById(userId, id);

    res.status(200).json({
      status: "success",
      data: { project },
    });
  });

  updateProject = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = req.body as UpdateProjectInput;

    const project = await projectService.updateProject(userId, id, data);

    res.status(200).json({
      status: "success",
      data: { project },
    });
  });

  deleteProject = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const result = await projectService.deleteProject(userId, id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  });

  getProjectStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const stats = await projectService.getProjectStats(userId, id);

    res.status(200).json({
      status: "success",
      data: stats,
    });
  });
}

export const projectController = new ProjectController();
