import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";

// Specify the path to the sqlite3.dll file
const sqlitePath = "./lib/sqlite-dll-win64-x64-3420000/sqlite3.dll";

// Create a new SQLite database connection
const db = new sqlite3.Database(
  ":memory:",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the SQLite database.");

      // Perform database operations
      // ...
    }
  }
);

// Use the SQLite database connection
// ...

const app = express();
const port = 3000;

app.get("/api/tasks", (req: Request, res: Response) => {
  const tasks = [
    { id: 1, title: "Task 1", status: "inProgress" },
    { id: 2, title: "Task 2", status: "done" },
  ];

  res.json(tasks);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
