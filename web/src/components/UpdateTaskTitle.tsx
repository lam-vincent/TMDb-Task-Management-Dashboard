import React, { useState } from "react";

interface UpdateTaskTitleProps {
  taskId: number;
  currentTitle: string;
  fetchTaskLists: () => void;
}

const UpdateTaskTitle: React.FC<UpdateTaskTitleProps> = ({
  taskId,
  currentTitle,
  fetchTaskLists,
}) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(currentTitle);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    if (newTitle.trim() !== "") {
      updateTaskTitle(taskId, newTitle);
    }
    setEditing(false);
  };

  const handleCancelClick = () => {
    setNewTitle(currentTitle);
    setEditing(false);
  };

  const updateTaskTitle = async (
    taskId: number,
    newTitle: string
  ): Promise<void> => {
    try {
      const res = await fetch(
        `http://localhost:3000/tasks/${taskId}/updateTitle`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle }),
        }
      );

      if (res.ok) {
        fetchTaskLists(); // Refresh the task lists after updating the title
      } else {
        console.error("Failed to update task title:", res.status);
      }
    } catch (error) {
      console.error("Error updating task title:", error);
    }
  };

  return (
    <div>
      {editing ? (
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            className="w-16 border px-1 mx-1"
          />
          <button
            onClick={handleSaveClick}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-1 px-2 rounded"
          >
            Save
          </button>
          <button
            onClick={handleCancelClick}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-2 rounded ml-1"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={handleEditClick}>✏️</button>
      )}
    </div>
  );
};

export default UpdateTaskTitle;
