import React from "react";

const Home: React.FC = () => {
  const tasks = [
    { id: 1, title: "Task 1", status: "tasks" },
    { id: 2, title: "Task 2", status: "inProgress" },
    { id: 3, title: "Task 3", status: "done" },
    // Add more tasks as needed
  ];

  const renderTasksByStatus = (status: string) => {
    const filteredTasks = tasks.filter((task) => task.status === status);

    return filteredTasks.map((task) => (
      <div key={task.id} className="border p-4 mb-4">
        <h3 className="text-lg font-bold">{task.title}</h3>
        {/* Additional task details */}
      </div>
    ));
  };

  return (
    <div className="flex">
      <div className="w-1/3">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        {renderTasksByStatus("tasks")}
      </div>
      <div className="w-1/3">
        <h2 className="text-xl font-bold mb-4">In Progress</h2>
        {renderTasksByStatus("inProgress")}
      </div>
      <div className="w-1/3">
        <h2 className="text-xl font-bold mb-4">Done</h2>
        {renderTasksByStatus("done")}
      </div>
    </div>
  );
};

export default Home;
