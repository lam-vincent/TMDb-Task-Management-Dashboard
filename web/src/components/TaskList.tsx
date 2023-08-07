import React, { useState, useEffect } from "react";
import AddTask from "./AddTask";
import AddTasklist from "./AddTasklist";
import DeleteTask from "./DeleteTask";
import DeleteTasklist from "./DeleteTasklist";
import UpdateTaskTitle from "./UpdateTaskTitle";
import UpdateTasklistTitle from "./UpdateTasklistTitle";
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

      if (res.status === 401) {
        navigate("/login");
        alert("Not logged in");
        return; // Exit early if not logged in
      }

      const data = await res.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortedData = data.map((taskList: { tasks: any[] }) => {
        return {
          ...taskList,
          tasks: taskList.tasks.sort(
            (a: { order: number }, b: { order: number }) => a.order - b.order
          ),
        };
      });

      setTaskLists(sortedData);
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

  async function updateTaskOrder(
    taskListId: number,
    taskOrder: number[]
  ): Promise<void> {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) throw new Error("Not logged in");

      const res = await fetch(
        `http://localhost:3000/tasklists/${taskListId}/updateTaskOrder`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
          body: JSON.stringify({ taskOrder }),
        }
      );

      if (res.ok) {
        console.log("Task order updated successfully");
      } else {
        console.error("Failed to update task order:", res.status);
      }
    } catch (error) {
      console.error("Error updating task order:", error);
    }
  }

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

  const handleDropList = (
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

      setTaskLists(updatedTaskLists);

      // Call the changeTaskListId function to update the task list ID in the database
      changeTaskListId(task.id, targetListId);
    }
  };

  const handleDrop = (
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

        setTaskLists(updatedTaskLists);

        // Call the updateTaskOrder function to update the task order in the database
        const newTaskOrder = updatedTaskLists[listIndex].tasks.map((t) => t.id);
        updateTaskOrder(targetListId, newTaskOrder);
      }
    }
  };

  return (
    <div className="flex m-4 gap-4 overflow-x-auto pb-4">
      {taskLists.map((list) => (
        <div
          key={list.id}
          className="w-80 shrink-0 pr-2 pb-4 bg-neutral-800 rounded-3xl text-white relative"
        >
          <div className="flex justify-between px-2">
            {/* <h2 className="text-lg font-semibold p-4 pb-0">{list.title}</h2> */}
            <UpdateTasklistTitle
              tasklistId={list.id}
              currentTitle={list.title}
              fetchTaskLists={fetchTaskLists}
            />
            <DeleteTasklist taskListId={list.id} onDelete={fetchTaskLists} />
          </div>
          <div
            className="task-container h-80 overflow-auto rounded-3xl p-4 pr-2"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDropList(e, list.id)}
          >
            {list.tasks.map((task) => (
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
