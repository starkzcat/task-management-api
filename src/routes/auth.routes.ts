import { Router } from "express";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.get("/profile", authenticate, authController.getProfile);

export default router;
