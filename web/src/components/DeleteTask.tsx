import React from "react";

interface DeleteTaskProps {
  taskId: number;
  onDelete: () => void;
}

const DeleteTask: React.FC<DeleteTaskProps> = ({ taskId, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Task deleted successfully");
        onDelete(); // Notify parent component that the task is deleted
      } else {
        console.error("Failed to delete task:", response.status);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="delete-task-btn"
      title="Delete Task"
    >
      ✖️
    </button>
  );
};

export default DeleteTask;
