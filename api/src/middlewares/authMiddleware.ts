import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Middleware to authenticate and authorize requests
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("holle");

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Unauthorized");
    }

    // Verify the JWT token
    jwt.verify(token, "your-secret-key");

    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
