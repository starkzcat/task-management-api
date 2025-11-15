import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as RegisterInput;
    const result = await authService.register(data);

    res.status(201).json({
      status: "success",
      data: result,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as LoginInput;
    const result = await authService.login(data);

    res.status(200).json({
      status: "success",
      data: result,
    });
  });

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await authService.getProfile(userId);

    res.status(200).json({
      status: "success",
      data: { user },
    });
  });
}

export const authController = new AuthController();
