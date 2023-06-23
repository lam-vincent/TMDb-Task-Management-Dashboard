import React, { useState } from "react";

const TaskList = () => {
  const [taskLists, setTaskLists] = useState([
    {
      id: 1,
      title: "Task List 1",
      tasks: [
        { id: 1, title: "Task 1" },
        { id: 2, title: "Task 2" },
      ],
    },
    {
      id: 2,
      title: "Task List 2",
      tasks: [
        { id: 3, title: "Task 3" },
        { id: 4, title: "Task 4" },
      ],
    },
  ]);

  const handleDragStart = (e, task, sourceListId) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ task, sourceListId })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetListId) => {
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
      {taskLists.map((list) => (
        <div key={list.id} className="task-list">
          <h2>{list.title}</h2>
          <div
            className="task-container"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, list.id)}
          >
            {list.tasks.map((task) => (
              <div
                key={task.id}
                className="task"
                draggable
                onDragStart={(e) => handleDragStart(e, task, list.id)}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
