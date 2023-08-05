import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/me", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: parseInt(req.userId) },
    });
    res.json(user);
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
