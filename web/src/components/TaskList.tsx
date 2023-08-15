import React, { useState, useEffect } from "react";
import AddTask from "./AddTask";
import AddTasklist from "./AddTasklist";
import DeleteTask from "./DeleteTask";
import DeleteTasklist from "./DeleteTasklist";
import UpdateTaskTitle from "./UpdateTaskTitle";
import UpdateTasklistTitle from "./UpdateTasklistTitle";
import { useNavigate } from "react-router-dom";
import { IDrag } from "./icons/IDrag";

interface Task {
  id: number;
  title: string;
  taskListId: number;
  userId: number;
  order: number;
}

interface TaskList {
  id: number;
  title: string;
  tasks: Task[];
  userId: number;
  order: number;
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

      if (res.status === 401) {
        navigate("/login");
        alert("Not logged in");
        return; // Exit early if not logged in
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
        fetchTaskLists();
      } else {
        console.error("Failed to update task list ID:", res.status);
      }
    } catch (error) {
      console.error("Error updating task list ID:", error);
    }
  };

  async function updateTaskOrder(
    taskIdOrder: number[],
    orderValue: number
  ): Promise<void> {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) throw new Error("Not logged in");

      const res = await fetch(
        `http://localhost:3000/tasks/${taskIdOrder}/updateOrder`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
          body: JSON.stringify({ order: orderValue }),
        }
      );

      if (res.ok) {
        console.log("updateTaskOrder(): Task order updated successfully");
      } else {
        console.error("Failed to update task order:", res.status);
      }
    } catch (error) {
      console.error("Error updating task order:", error);
    }
  }

  const updateTaskListOrder = async (
    taskListOrder: number[]
  ): Promise<void> => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) throw new Error("Not logged in");

      for (let i = 0; i < taskListOrder.length; i++) {
        const taskListId = taskListOrder[i];

        const res = await fetch(
          `http://localhost:3000/tasklists/${taskListId}/updateOrder`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwtToken,
            },
            body: JSON.stringify({ order: i }),
          }
        );

        if (res.ok) {
          console.log(
            `Task list order updated successfully for taskListId: ${taskListId}`
          );
        } else {
          console.error(
            `Failed to update task list order for taskListId: ${taskListId}, Status: ${res.status}`
          );
        }
      }
    } catch (error) {
      console.error("Error updating task list order:", error);
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

  const handleDragStartList = (
    e: React.DragEvent<HTMLDivElement>,
    sourceListId: number
  ) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ sourceListId }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDropTaskInAnotherList = (
    e: React.DragEvent<HTMLDivElement>,
    targetListId: number
  ) => {
    e.preventDefault();
    const { task, sourceListId } = JSON.parse(
      e.dataTransfer.getData("text/plain")
    );

    // Move the task from sourceListId to targetListId
    if (sourceListId !== targetListId) {
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

      // Call the changeTaskListId function to update the task list ID in the database
      changeTaskListId(task.id, targetListId);
    }
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    targetListId: number,
    taskId?: number
  ) => {
    e.preventDefault();
    const { task, sourceListId } = JSON.parse(
      e.dataTransfer.getData("text/plain")
    );

    // Check if the drop occurred within the same task list
    if (sourceListId === targetListId) {
      const { tasks } =
        taskLists.find((list) => list.id === targetListId) || {};
      if (!tasks) return;

      // Calculate the target task index where the task is dropped
      const targetTaskIndex = taskId
        ? tasks.findIndex((t) => t.id === taskId)
        : tasks.length;

      if (targetTaskIndex !== undefined && targetTaskIndex !== -1) {
        // Remove the old task when the drop occurs within the same task list
        const updatedTaskLists = [...taskLists];
        const listIndex = updatedTaskLists.findIndex(
          (list) => list.id === targetListId
        );

        if (taskId) {
          const oldTaskIndex = updatedTaskLists[listIndex].tasks.findIndex(
            (t) => t.id === task.id
          );
          if (oldTaskIndex !== undefined && oldTaskIndex !== -1) {
            updatedTaskLists[listIndex].tasks.splice(oldTaskIndex, 1);
          }
        }

        updatedTaskLists[listIndex].tasks.splice(targetTaskIndex, 0, task); // Insert the task at the targetTaskIndex

        const taskIdOrder = updatedTaskLists[listIndex].tasks.map((t) => t.id);

        for (let i = 0; i < taskIdOrder.length; i++) {
          try {
            await updateTaskOrder([taskIdOrder[i]], i);
            console.log("updatedTaskLists", updatedTaskLists);
          } catch (error) {
            console.error(`Failed to update task order ${i + 1}:`, error);
          }
        }

        fetchTaskLists();
      }
    }
  };

  const handleDropList = async (
    e: React.DragEvent<HTMLDivElement>,
    targetListId: number
  ) => {
    e.preventDefault();
    const { sourceListId } = JSON.parse(e.dataTransfer.getData("text/plain"));

    if (sourceListId !== targetListId) {
      const updatedTaskLists = [...taskLists];

      const sourceListIndex = updatedTaskLists.findIndex(
        (list) => list.id === sourceListId
      );

      if (sourceListIndex === -1) {
        console.log("Source list not found");
        return;
      }

      const targetListIndex = updatedTaskLists.findIndex(
        (list) => list.id === targetListId
      );

      if (targetListIndex === -1) {
        console.log("Target list not found");
        return;
      }

      if (targetListIndex < sourceListIndex) {
        updatedTaskLists.splice(
          targetListIndex,
          0,
          updatedTaskLists[sourceListIndex]
        ); // add case where targetListIndex <  sourceListIndex
        updatedTaskLists.splice(sourceListIndex + 1, 1); // remove case where targetListIndex < sourceListIndex
      } else {
        updatedTaskLists.splice(
          targetListIndex + 1,
          0,
          updatedTaskLists[sourceListIndex]
        ); // add case where targetListIndex > sourceListIndex
        updatedTaskLists.splice(sourceListIndex, 1); // remove case where targetListIndex > sourceListIndex
      }

      setTaskLists(updatedTaskLists);

      await updateTaskListOrder(updatedTaskLists.map((list) => list.id));

      fetchTaskLists();
    }
  };

  return (
    <div className="flex m-4 gap-4 overflow-x-auto pb-4">
      {taskLists
        .sort((a, b) => a.order - b.order)
        .map((list) => (
          <div
            key={list.id}
            className="task-list w-80 shrink-0 pr-2 pb-4 bg-neutral-800 rounded-3xl text-white relative"
          >
            <div
              draggable
              onDragStart={(e) => handleDragStartList(e, list.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropList(e, list.id)}
              className="flex justify-between px-2"
            >
              <UpdateTasklistTitle
                tasklistId={list.id}
                currentTitle={list.title}
                fetchTaskLists={fetchTaskLists}
              />
              <IDrag />
              <DeleteTasklist taskListId={list.id} onDelete={fetchTaskLists} />
            </div>
            <div
              className="task-container h-80 overflow-auto rounded-3xl p-4 pr-2"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropTaskInAnotherList(e, list.id)}
            >
              {list.tasks
                .sort((a, b) => a.order - b.order)
                .map((task) => (
                  <div
                    key={task.id}
                    className="task rounded-lg px-2 py-1 border-2 border-neutral-600 my-1"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, list.id)}
                    onDrop={(e) => handleDrop(e, list.id, task.id)}
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
