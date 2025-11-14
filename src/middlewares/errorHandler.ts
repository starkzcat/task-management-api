import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      status: "error",
      message: "Validation Error",
      errors: err._zod.def.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "A record with this value already exists",
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Record not found",
      });
    }
  }

  res.status(500).json({
    status: "Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
};
