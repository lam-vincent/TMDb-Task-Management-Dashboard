import React, { useState, useEffect } from "react";
import AddTask from "../components/AddTask";

interface Task {
  id: number;
  title: string;
  taskListId: number;
}

interface TaskList {
  id: number;
  title: string;
  tasks: Task[];
}

const TaskList: React.FC = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);

  useEffect(() => {
    fetchTaskLists();
  }, []);

  const fetchTaskLists = async () => {
    try {
      const res = await fetch("http://localhost:3000/taskLists");
      const data = await res.json();
      setTaskLists(data);
    } catch (error) {
      console.error("Error retrieving task lists:", error);
    }
  };

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

  return (
    <div>
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
            <AddTask taskListId={list.id} fetchTaskLists={fetchTaskLists} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
