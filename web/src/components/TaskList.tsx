import React, { useState, useEffect } from "react";
import AddTask from "./AddTask";
import AddTasklist from "./AddTasklist";
import DeleteTask from "./DeleteTask";
import DeleteTasklist from "./DeleteTasklist";
import UpdateTaskTitle from "./UpdateTaskTitle";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);

  useEffect(() => {
    fetchTaskLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTaskLists = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) navigate("/login");

    try {
      const res = await fetch("http://localhost:3000/tasklists", {
        headers: { authorization: "Bearer " + jwtToken },
      });
      if (res.status == 401) {
        navigate("/login");
        alert("not logged in");
      }
      const data = await res.json();
      setTaskLists(data);
    } catch (error) {
      console.error("Error retrieving task lists:", error);
    }
  };

  const changeTaskListId = async (
    taskId: number,
    newTaskListId: number
  ): Promise<void> => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) navigate("/login");

    try {
      const res = await fetch(
        `http://localhost:3000/tasks/${taskId}/updateTaskListId`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + jwtToken,
          },
          body: JSON.stringify({ taskListId: newTaskListId }),
        }
      );

      if (res.ok) {
        fetchTaskLists(); // Refresh the task lists after updating the task list ID
      } else {
        console.error("Failed to update task list ID:", res.status);
      }
    } catch (error) {
      console.error("Error updating task list ID:", error);
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
    movedTask.taskListId = targetListId; // Update the taskListId of the moved task
    updatedTaskLists[targetListIndex].tasks.push(movedTask);

    setTaskLists(updatedTaskLists);

    // Call the changeTaskListId function to update the task list ID in the database
    changeTaskListId(task.id, targetListId);
  };

  return (
    <div className="flex m-4 gap-4 overflow-x-auto pb-4">
      {taskLists.map((list) => (
        <div
          key={list.id}
          className="w-80 shrink-0 pr-2 pb-4 bg-neutral-800 rounded-3xl text-white"
        >
          <div className="flex justify-between px-2">
            <h2 className="text-lg font-semibold p-4 pb-0">{list.title}</h2>
            <DeleteTasklist taskListId={list.id} onDelete={fetchTaskLists} />
          </div>
          <div
            className="task-container h-80 overflow-auto rounded-3xl p-4 pr-2"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, list.id)}
          >
            {list.tasks.map((task) => (
              <div
                key={task.id}
                className="task mb-2 rounded-lg px-2 py-1 border-2 border-neutral-600"
                draggable
                onDragStart={(e) => handleDragStart(e, task, list.id)}
              >
                <div className="flex">
                  <div className="w-full">
                    <UpdateTaskTitle
                      taskId={task.id}
                      currentTitle={task.title}
                      fetchTaskLists={fetchTaskLists}
                    />
                  </div>
                  <DeleteTask taskId={task.id} onDelete={fetchTaskLists} />
                </div>
              </div>
            ))}
          </div>
          <AddTask taskListId={list.id} fetchTaskLists={fetchTaskLists} />
        </div>
      ))}
      <AddTasklist fetchTaskLists={fetchTaskLists} />
    </div>
  );
};

export default TaskList;
