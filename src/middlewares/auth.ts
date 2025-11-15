import { Request, Response, NextFunction } from "express";
import { UnauthorizedEror } from "../utils/errors";
import { verifyToken } from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedEror("No token provided");
    }

    const token = authHeader.substring(7);

    const payload = verifyToken(token);
    req.user = payload;

    next();
  }
);
