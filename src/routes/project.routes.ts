import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth";
import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from "../validators/project.validator";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(createProjectSchema),
  projectController.createProject
);

router.get("/", projectController.getProjects);

router.get("/:id", validate(projectIdSchema), projectController.getProjectById);

router.patch(
  "/:id",
  validate(updateProjectSchema),
  projectController.updateProject
);

router.delete(
  "/:id",
  validate(projectIdSchema),
  projectController.deleteProject
);

router.get(
  ":/id/stats",
  validate(projectIdSchema),
  projectController.getProjectStats
);

export default router;
