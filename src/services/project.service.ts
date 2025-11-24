import prisma from "../config/database";
import { ForbiddenError, NotFoundError } from "../utils/errors";
import {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validators/project.validator";

export class ProjectService {
  async createProject(userId: string, data: CreateProjectInput) {
    const project = await prisma.project.create({
      data: { ...data, userId },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return project;
  }

  async getProjects(userId: string) {
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return projects;
  }

  async getProjectById(userId: string, projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
        tasks: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.userId !== userId) {
      throw new ForbiddenError("Access denied to this project");
    }

    return project;
  }

  async updateProject(
    userId: string,
    projectId: string,
    data: UpdateProjectInput
  ) {
    await this.getProjectById(userId, projectId);

    const project = await prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  async deleteProject(userId: string, projectId: string) {
    await this.getProjectById(userId, projectId);

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return { message: "Project deleted successfully" };
  }

  async getProjectStats(userId: string, projectId: string) {
    await this.getProjectById(userId, projectId);

    const stats = await prisma.task.groupBy({
      by: ["status"],
      where: { projectId },
      _count: true,
    });

    const totalTasks = await prisma.task.count({
      where: { projectId },
    });

    const completedTasks =
      stats.find((s) => s.status === "COMPLETED")?._count || 0;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completionRate,
      tasksByStatus: stats.map((s) => ({
        status: s.status,
        count: s._count,
      })),
    };
  }
}

export const projectService = new ProjectService();
