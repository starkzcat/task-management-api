import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "fallback-key",
  jwtExpiresIn: "7d",
} as const;

if (!process.env.JWT_SECRET && config.nodeEnv === "production") {
  throw new Error("JWT_SECRET is required in production");
}
