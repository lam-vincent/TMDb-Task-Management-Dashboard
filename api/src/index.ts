import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany({
    include: {
      taskList: true,
    },
  });
  res.json(tasks);
});

app.get("/tasklists", async (req, res) => {
  const taskLists = await prisma.taskList.findMany({
    include: {
      tasks: true,
    },
  });
  res.json(taskLists);
});

app.post("/tasks", async (req, res) => {
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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
