import express, { Request, Response } from "express";
const app = express();
const port = 3000;

app.get("/api/tasks", (req: Request, res: Response) => {
  const tasks = [
    { id: 1, title: "Task 1", status: "inProgress" },
    { id: 2, title: "Task 2", status: "done" },
  ];
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
