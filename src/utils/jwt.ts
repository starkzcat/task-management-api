import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { UnauthorizedEror } from "./errors";

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedEror("Token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedEror("Invalid token");
    }
    throw new UnauthorizedEror("Token verification failed");
  }
};
