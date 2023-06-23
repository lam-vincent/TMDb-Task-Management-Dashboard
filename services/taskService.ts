import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new task
const createTask = async (title: string, status: string) => {
  const task = await prisma.task.create({
    data: {
      title,
      status,
    },
  });
  return task;
};

// Get all tasks
const getAllTasks = async () => {
  const tasks = await prisma.task.findMany();
  return tasks;
};

// Get a task by ID
const getTaskById = async (taskId: number) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
  return task;
};

// Update a task
const updateTask = async (taskId: number, data: Partial<Task>) => {
  const task = await prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  });
  return task;
};

// Delete a task
const deleteTask = async (taskId: number) => {
  const task = await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
  return task;
};

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
