import React from "react";
import Home from "./pages/Home";
import TaskList from "./pages/TaskList";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <TaskList />
    </div>
  );
};

export default App;
