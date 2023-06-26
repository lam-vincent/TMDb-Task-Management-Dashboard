import React, { useEffect, useState } from "react";
import TaskList from "./pages/TaskList";

type TaskList = {
  id: number;
  title: string;
  tasks: {
    id: number;
    title: number;
    taskListId: number;
  }[];
};

function App() {
  const [data, setData] = useState<TaskList[] | null>(null);
  useEffect(() => {
    async function getTaskLists() {
      const res = await fetch("http://localhost:3000/taskLists");
      const data = await res.json();
      setData(data);
    }

    getTaskLists();
  }, []);
  return (
    <div>
      <header className="text-3xl text-center py-4 mb-4 font-bold">
        <h1>🛒 Trolley - To help you carry the burden of your tasks</h1>
      </header>
      <TaskList />
    </div>
  );
}

export default App;
