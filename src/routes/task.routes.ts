import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
  createTaskSchema,
  getTasksQuerySchema,
  taskIdSchema,
  updateTaskSchema,
} from "../validators/task.validator";
import { taskController } from "../controllers/task.controller";
import { validate } from "../middlewares/validate";

const router = Router();

router.use(authenticate);

router.post("/", validate(createTaskSchema), taskController.createTask);

router.get("/", validate(getTasksQuerySchema), taskController.getTasks);

router.get("/:id", validate(taskIdSchema), taskController.getTaskById);

router.patch("/:id", validate(updateTaskSchema), taskController.updateTask);

router.delete("/:id", validate(taskIdSchema), taskController.deleteTask);

router.get("/:id/stats/", validate(taskIdSchema), taskController.getTaskStats);

export default router;
