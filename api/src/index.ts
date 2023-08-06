import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";
import tasklistRoutes from "./routes/tasklistRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(authMiddleware);
app.use(userRoutes);
app.use(taskRoutes);
app.use(tasklistRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
