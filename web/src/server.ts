import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/api/taskLists", async (req: Request, res: Response) => {
  try {
    const taskLists = await prisma.taskList.findMany({
      include: {
        tasks: true,
      },
    });
    res.json(taskLists);
  } catch (error) {
    console.error("Error retrieving task lists:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/api/taskLists", async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    const taskList = await prisma.taskList.create({
      data: {
        title,
      },
    });
    res.json(taskList);
  } catch (error) {
    console.error("Error creating task list:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/api/tasks", async (req: Request, res: Response) => {
  const { title, taskListId } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        taskList: {
          connect: { id: taskListId },
        },
      },
      include: {
        taskList: true,
      },
    });
    res.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
