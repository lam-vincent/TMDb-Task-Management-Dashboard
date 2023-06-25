import React, { useState } from "react";
import AddTask from "../components/AddTask";

interface Task {
  id: number;
  title: string;
}

interface TaskList {
  id: number;
  title: string;
  tasks: Task[];
}

const TaskList: React.FC = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([
    {
      id: 1,
      title: "Tasks",
      tasks: [
        { id: 1, title: "Task 1" },
        { id: 2, title: "Task 2" },
      ],
    },
    {
      id: 2,
      title: "In Progress",
      tasks: [
        { id: 3, title: "Task 3" },
        { id: 4, title: "Task 4" },
      ],
    },
    {
      id: 3,
      title: "Done",
      tasks: [
        { id: 3, title: "Task 5" },
        { id: 4, title: "Task 6" },
      ],
    },
  ]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    task: Task,
    sourceListId: number
  ) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ task, sourceListId })
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetListId: number
  ) => {
    e.preventDefault();
    const { task, sourceListId } = JSON.parse(
      e.dataTransfer.getData("text/plain")
    );

    // Move the task from sourceListId to targetListId
    const updatedTaskLists = [...taskLists];
    const sourceListIndex = updatedTaskLists.findIndex(
      (list) => list.id === sourceListId
    );
    const targetListIndex = updatedTaskLists.findIndex(
      (list) => list.id === targetListId
    );

    const taskIndex = updatedTaskLists[sourceListIndex].tasks.findIndex(
      (t) => t.id === task.id
    );
    const movedTask = updatedTaskLists[sourceListIndex].tasks.splice(
      taskIndex,
      1
    )[0];
    updatedTaskLists[targetListIndex].tasks.push(movedTask);

    setTaskLists(updatedTaskLists);
  };

  const addTask = (newTask: Task) => {
    // Perform the necessary API request or database operation to add the new task
    console.log("Adding task:", newTask);
    // Update the tasks state or trigger a refetch of tasks from the server
  };

  return (
    <div className="flex m-4 gap-4">
      {taskLists.map((list) => (
        <div key={list.id} className="task-list w-1/3">
          <h2 className="text-xl font-bold mb-4">{list.title}</h2>
          <div
            className="task-container border p-4 mb-4"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, list.id)}
          >
            {list.tasks.map((task) => (
              <div
                key={task.id}
                className="task text-lg"
                draggable
                onDragStart={(e) => handleDragStart(e, task, list.id)}
              >
                {task.title}
              </div>
            ))}
          </div>
          <AddTask addTask={addTask} />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
