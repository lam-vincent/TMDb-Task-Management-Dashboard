import { useState } from "react";

const AddTask = ({ onAddTask }) => {
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Validate form inputs, perform any necessary checks

    // Call the onAddTask function with the new task data
    onAddTask({ title: taskTitle, status: taskStatus });

    // Reset form inputs and hide the form
    setTaskTitle("");
    setTaskStatus("");
    setShowForm(false);
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
          <input
            type="text"
            placeholder="Task Status"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
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
