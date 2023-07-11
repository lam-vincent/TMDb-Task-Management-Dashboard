import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { config } from "dotenv";

config();
const secretKey: Secret = process.env.SECRET_KEY || "";

// Middleware to authenticate and authorize requests
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Unauthorized");
    }

    // Verify the JWT token
    jwt.verify(token, secretKey);

    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
