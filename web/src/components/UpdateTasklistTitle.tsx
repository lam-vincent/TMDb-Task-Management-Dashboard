import React, { useState } from "react";

interface UpdateTasklistTitleProps {
  tasklistId: number;
  currentTitle: string;
  fetchTaskLists: () => void;
}

const UpdateTasklistTitle: React.FC<UpdateTasklistTitleProps> = ({
  tasklistId,
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
      updateTasklistTitle(tasklistId, newTitle);
    }
    setEditing(false);
  };

  const handleCancelClick = () => {
    setNewTitle(currentTitle);
    setEditing(false);
  };

  const updateTasklistTitle = async (
    tasklistId: number,
    newTitle: string
  ): Promise<void> => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");

      const res = await fetch(`http://localhost:3000/tasklists/${tasklistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + jwtToken,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (res.ok) {
        fetchTaskLists(); // Refresh the task lists after updating the title
      } else {
        console.error("Failed to update tasklist title:", res.status);
      }
    } catch (error) {
      console.error("Error updating tasklist title:", error);
    }
  };

  return (
    <div>
      {editing ? (
        <div className="mt-4 mx-3">
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            className="w-2/4 border px-1 mx-1 bg-inherit rounded"
          />
          <button
            onClick={handleSaveClick}
            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-2 rounded"
          >
            Save
          </button>
          <button
            onClick={handleCancelClick}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded ml-1"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-4 mx-3">
          {newTitle}
          <button
            onClick={handleEditClick}
            className="hover:text-green-500 ml-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateTasklistTitle;
