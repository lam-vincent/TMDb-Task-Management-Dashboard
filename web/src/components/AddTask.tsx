import React, { useState } from "react";

interface AddTaskProps {
  taskListId: number;
  fetchTaskLists: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ taskListId, fetchTaskLists }) => {
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form inputs, perform any necessary checks

    // Call the addTask function to create a new task
    addTask(taskTitle, taskListId);

    // Reset form inputs and hide the form
    setTaskTitle("");
    setShowForm(false);
  };

  const addTask = async (title: string, taskListId: number) => {
    const taskData = {
      title,
      taskListId,
    };

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        console.log("Created task:", newTask);
        // Fetch the updated task lists
        fetchTaskLists();
      } else {
        console.error("Failed to create task:", response.status);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {!showForm && (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowForm(true)}
        >
          Add Task
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="mt-4 flex flex-col justify-center items-center gap-2"
        >
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
          <div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Add
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTask;
