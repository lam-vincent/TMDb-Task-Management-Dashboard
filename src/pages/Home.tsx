import React from "react";
import AddTask from "../components/AddTask";

const Home: React.FC = () => {
  const tasks = [
    { id: 1, title: "Task 1", status: "tasks" },
    { id: 2, title: "Task 2", status: "inProgress" },
    { id: 3, title: "Task 3", status: "done" },
    { id: 1, title: "Task 1", status: "tasks" },
    { id: 2, title: "Task 2", status: "inProgress" },
    { id: 3, title: "Task 3", status: "done" },
    { id: 1, title: "Task 1", status: "tasks" },
    { id: 2, title: "Task 2", status: "inProgress" },
    { id: 3, title: "Task 3", status: "done" },
  ];

  const renderTasksByStatus = (status: string) => {
    const filteredTasks = tasks.filter((task) => task.status === status);

    return filteredTasks.map((task) => (
      <div key={task.id} className="border p-4 mb-4">
        <h3 className="text-lg">{task.title}</h3>
        {/* Additional task details */}
      </div>
    ));
  };

  const handleAddTask = (newTask) => {
    // Perform the necessary API request or database operation to add the new task
    console.log("Adding task:", newTask);
    // Update the tasks state or trigger a refetch of tasks from the server
  };

  return (
    <div>
      <div className="flex m-4 gap-4">
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Tasks</h2>
          {renderTasksByStatus("tasks")}
          <AddTask onAddTask={handleAddTask} />
        </div>
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">In Progress</h2>
          {renderTasksByStatus("inProgress")}
          <AddTask onAddTask={handleAddTask} />
        </div>
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Done</h2>
          {renderTasksByStatus("done")}
          <AddTask onAddTask={handleAddTask} />
        </div>
      </div>
    </div>
  );
};

export default Home;
