import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Fetch all tasks
app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// Add a new task
app.post("/tasks", async (req: Request, res: Response) => {
  const { title, status } = req.body;
  const task = await prisma.task.create({
    data: {
      title,
      status,
    },
  });
  res.json(task);
});

// Update a task's status
app.patch("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updatedTask = await prisma.task.update({
    where: {
      id: parseInt(id),
    },
    data: {
      status,
    },
  });
  res.json(updatedTask);
});

// Delete a task
app.delete("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedTask = await prisma.task.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.json(deletedTask);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
