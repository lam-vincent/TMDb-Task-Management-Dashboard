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

router.patch("/tasklists/:taskListId/updateTaskOrder", async (req, res) => {
  const taskListId = parseInt(req.params.taskListId);
  const { taskOrder } = req.body;

  try {
    const taskList = await prisma.taskList.findUnique({
      where: {
        id: taskListId,
      },
      include: {
        tasks: true,
      },
    });

    if (!taskList) {
      return res.status(404).json({ error: "Task list not found" });
    }

    // Create a map of taskId to its corresponding task object
    const taskMap: { [key: number]: Task } = {};
    taskList.tasks.forEach((task) => {
      taskMap[task.id] = task;
    });

    // Create a new array of tasks based on the provided task order
    const updatedTasks: Task[] = [];
    taskOrder.forEach((taskId: number) => {
      const task = taskMap[taskId];
      if (task) {
        updatedTasks.push(task);
      }
    });

    // Update the order of tasks in the task list
    await prisma.taskList.update({
      where: {
        id: taskListId,
      },
      data: {
        tasks: {
          // Set the tasks array to the updatedTasks array
          set: updatedTasks,
        },
      },
    });

    res.json({ message: "Task order updated successfully" });
  } catch (error) {
    console.error("Error updating task order:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export default router;
