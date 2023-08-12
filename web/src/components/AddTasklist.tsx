import React, { useState } from "react";

interface AddTasklistProps {
  fetchTaskLists: () => void;
}

const AddTasklist: React.FC<AddTasklistProps> = ({ fetchTaskLists }) => {
  const [showForm, setShowForm] = useState(false);
  const [tasklistTitle, setTasklistTitle] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addTasklist(tasklistTitle);

    setTasklistTitle("");
    setShowForm(false);
  };

  const addTasklist = async (title: string) => {
    const taskData = {
      title,
    };

    const jwtToken = localStorage.getItem("jwtToken");

    try {
      // Fetch the existing task lists
      const response = await fetch("http://localhost:3000/tasklists", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + jwtToken,
        },
      });

      if (response.ok) {
        const existingTaskLists = await response.json();

        // Determine the maximum order value from the existing task lists
        const maxOrder = existingTaskLists.reduce(
          (max: number, taskList: { order: number }) =>
            Math.max(max, taskList.order),
          0
        );

        // Increment the max order value by 1 for the new task list
        const newTasklistOrder = maxOrder + 1;

        // Now send the data to create the task list, including the order value
        const createResponse = await fetch("http://localhost:3000/tasklists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + jwtToken,
          },
          body: JSON.stringify({ ...taskData, order: newTasklistOrder }),
        });

        if (createResponse.ok) {
          const newTaskList = await createResponse.json();
          console.log("Created task list:", newTaskList);
          fetchTaskLists();
        } else {
          console.error("Failed to create task list:", createResponse.status);
        }
      } else {
        console.error("Failed to fetch existing task lists:", response.status);
      }
    } catch (error) {
      console.error("Error creating task list:", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {!showForm && (
        <button
          className="flex justify-center items-center w-80 gap-2 ml-4 mr-2 bg-yellow-500 hover:bg-yellow-600 text-neutral-800 font-bold p-1 rounded-xl"
          onClick={() => setShowForm(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              clipRule="evenodd"
            />
          </svg>
          add a new list
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="mt-2 flex flex-col justify-center items-center gap-2"
        >
          <input
            type="text"
            placeholder="Tasklist Title"
            value={tasklistTitle}
            onChange={(e) => setTasklistTitle(e.target.value)}
            className="border border-gray-300 bg-inherit rounded p-2 w-60"
          />
          <div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded"
            >
              Add
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-8 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTasklist;
