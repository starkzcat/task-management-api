import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { ForbiddenError, NotFoundError } from "../utils/errors";
import {
  CreateTaskInput,
  GetTasksQuery,
  UpdateTaskInput,
} from "../validators/task.validator";

export class TaskService {
  async createTask(userId: string, data: CreateTaskInput) {
    if (data.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: data.projectId },
      });

      if (!project) {
        throw new NotFoundError("Project not found");
      }

      if (project.userId !== userId) {
        throw new ForbiddenError("Access denied to this project");
      }
    }

    const task = await prisma.task.create({
      data: {
        ...data,
        userId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return task;
  }

  async getTasks(userId: string, query: GetTasksQuery) {
    const {
      status,
      priority,
      projectId,
      page,
      limit,
      sortBy,
      sortOrder,
      search,
    } = query;

    const where: Prisma.TaskWhereInput = {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(projectId && { projectId }),
      ...(search && {
        OR: [
          {
            title: { contains: search, mode: "insensitive" },
          },
          {
            description: { contains: search, mode: "insensitive" },
          },
        ],
      }),
    };

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskById(userId: string, taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    if (task.userId !== userId) {
      throw new ForbiddenError("Access denied to this task");
    }

    return task;
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskInput) {
    await this.getTaskById(userId, taskId);

    if (data.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: data.projectId },
      });

      if (!project) {
        throw new NotFoundError("Project not found");
      }

      if (project.userId !== userId) {
        throw new ForbiddenError("Access denied to this project");
      }
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return task;
  }

  async deleteTask(userId: string, taskId: string) {
    await this.getTaskById(userId, taskId);

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { message: "Task deleted successfully" };
  }

  async getTaskStats(userId: string) {
    const [
      totalTasks,
      completedTasks,
      tasksByStatus,
      tasksByPriority,
      overdueTasks,
    ] = await Promise.all([
      prisma.task.count({
        where: { userId },
      }),
      prisma.task.count({
        where: { userId, status: "COMPLETED" },
      }),
      prisma.task.groupBy({
        by: ["status"],
        where: { userId },
        _count: true,
      }),
      prisma.task.groupBy({
        by: ["priority"],
        where: { userId },
        _count: true,
      }),
      prisma.task.count({
        where: {
          userId,
          status: { not: "COMPLETED" },
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      tasksByStatus: tasksByStatus.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      tasksByPriority: tasksByPriority.map((p) => ({
        priority: p.priority,
        count: p._count,
      })),
    };
  }
}

export const taskService = new TaskService();
