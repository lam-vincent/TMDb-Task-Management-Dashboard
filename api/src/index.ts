import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import { authMiddleware } from "./middlewares/authMiddleware";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

interface Task {
  id: number;
  title: string;
  taskListId: number;
}

interface TaskList {
  id: number;
  title: string;
  tasks: Task[];
}

app.use("/api/auth", authRoutes);

app.use(authMiddleware);

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

app.delete("/tasks/:taskId", async (req, res) => {
  const taskId: number = parseInt(req.params.taskId);

  try {
    const task: Task | null = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        taskList: true,
      },
    });

    console.log("taskId", taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.patch("/tasks/:taskId/updateTitle", async (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const { title } = req.body;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: title || task.title, // Update the title if provided, otherwise keep the existing title
      },
    });

    res.json({ message: "Task title updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task title:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.patch("/tasks/:taskId/updateTaskListId", async (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const { taskListId } = req.body;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        taskListId: taskListId || task.taskListId, // Update the taskListId if provided, otherwise keep the existing taskListId
      },
    });

    res.json({
      message: "Task taskListId updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task taskListId:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
