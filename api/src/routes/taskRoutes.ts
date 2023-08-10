import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { log } from "console";

const prisma = new PrismaClient();
const router = express.Router();

interface Task {
  id: number;
  title: string;
  taskListId: number;
  userId: number;
  order: number;
}

interface TaskList {
  id: number;
  title: string;
  tasks: Task[];
  userId: number;
  order: number;
}

router.post("/tasks", async (req, res) => {
  const { title, taskListId } = req.body;

  // @ts-ignore
  const userId = req.userId;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        taskList: {
          connect: { id: taskListId },
        },
        user: {
          connect: { id: userId },
        },
      },
      include: {
        taskList: {
          include: {
            user: true,
          },
        },
      },
    });
    res.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.delete("/tasks/:taskId", async (req, res) => {
  const taskId: number = parseInt(req.params.taskId);

  try {
    const task: Task | null = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        taskList: {
          include: {
            user: true,
          },
        },
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

router.patch("/tasks/:taskId/updateTitle", async (req, res) => {
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

router.patch("/tasks/:taskId/updateTaskListId", async (req, res) => {
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

router.patch("/tasks/:taskId/updateOrder", async (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const { order } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        order: order,
      },
    });

    res.json({ message: "Task order updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task order:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export default router;
