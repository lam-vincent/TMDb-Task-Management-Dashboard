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

router.patch("/profile/picture", async (req, res) => {
  try {
    const { profilePictureUrl } = req.body;

    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: parseInt(req.userId) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!profilePictureUrl)
      return res.status(400).json({ error: "Profile picture not provided" });

    const updatedUser = await prisma.user.update({
      where: {
        // @ts-ignore
        id: parseInt(req.userId),
      },
      data: {
        profilePictureUrl: profilePictureUrl,
      },
    });

    res.json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profilePicture:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export default router;
