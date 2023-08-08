import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
}

router.get("/tasklists", async (req, res) => {
  // @ts-ignore
  const userID = parseInt(req.userId);
  const taskLists = await prisma.taskList.findMany({
    where: {
      user: {
        id: userID,
      },
    },
    include: {
      tasks: true,
    },
  });
  res.json(taskLists);
});

router.post("/tasklists", async (req, res) => {
  try {
    // @ts-ignore
    const userID = parseInt(req.userId);
    const { title } = req.body;

    const createdTaskList = await prisma.taskList.create({
      data: {
        title,
        user: {
          connect: { id: userID },
        },
      },
      include: {
        tasks: true,
      },
    });

    res.json(createdTaskList);
  } catch (error) {
    console.error("Error creating task list:", error);
    res.status(500).json({ error: "Failed to create task list" });
  }
});

router.delete("/tasklists/:taskListId", async (req, res) => {
  try {
    const taskListId = parseInt(req.params.taskListId);

    await prisma.taskList.delete({
      where: { id: taskListId },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting task list:", error);
    res.status(500).json({ error: "Failed to delete task list" });
  }
});

router.patch("/tasklists/:taskListId", async (req, res) => {
  try {
    const taskListId = parseInt(req.params.taskListId);
    const { title } = req.body;

    const updatedTaskList = await prisma.taskList.update({
      where: { id: taskListId },
      data: { title },
      include: { tasks: true },
    });

    res.json(updatedTaskList);
  } catch (error) {
    console.error("Error updating task list:", error);
    res.status(500).json({ error: "Failed to update task list" });
  }
});

router.patch("/tasklists/updateOrder", async (req, res) => {
  const { taskListOrder } = req.body;

  try {
    // Update the order of task lists in the database
    for (let i = 0; i < taskListOrder.length; i++) {
      const taskListId = taskListOrder[i];
      await prisma.taskList.update({
        where: {
          id: taskListId,
        },
        data: {
          order: i, // Set the new order
        },
      });
    }

    res.json({ message: "Task list order updated successfully" });
  } catch (error) {
    console.error("Error updating task list order:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export default router;
