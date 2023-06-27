import React from "react";
import TaskList from "./pages/TaskList";

function App() {
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
