import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// Create the custom hook to fetch the task lists
const fetchTaskLists = async () => {
  const response = await fetch("/api/taskLists");
  const data = await response.json();
  return data;
};

// Create the custom hook to create a task list
const createTaskList = async (title: string) => {
  const response = await fetch("/api/taskLists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  const data = await response.json();
  return data;
};

// Create the custom hook to create a task
const createTask = async (title: string, taskListId: number) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, taskListId }),
  });
  const data = await response.json();
  return data;
};

const TaskListsPage = () => {
  const {
    data: taskLists,
    isLoading,
    isError,
  } = useQuery("taskLists", fetchTaskLists);
  const [newTaskListTitle, setNewTaskListTitle] = useState("");

  const handleNewTaskListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskList(newTaskListTitle);
    setNewTaskListTitle("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading task lists</div>;
  }

  return (
    <div>
      <h1>Task Lists</h1>
      {taskLists && (
        <ul>
          {taskLists.map((taskList: any) => (
            <li key={taskList.id}>
              <Link to={`/taskLists/${taskList.id}`}>{taskList.title}</Link>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleNewTaskListSubmit}>
        <input
          type="text"
          value={newTaskListTitle}
          onChange={(e) => setNewTaskListTitle(e.target.value)}
        />
        <button type="submit">Create Task List</button>
      </form>
    </div>
  );
};

const TaskListPage = ({ match }: any) => {
  const taskListId = parseInt(match.params.id);
  const {
    data: taskLists,
    isLoading,
    isError,
  } = useQuery("taskLists", fetchTaskLists);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const taskList =
    taskLists && taskLists.find((list: any) => list.id === taskListId);

  const handleNewTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask(newTaskTitle, taskListId);
    setNewTaskTitle("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading task lists</div>;
  }

  if (!taskList) {
    return <div>Task list not found</div>;
  }

  return (
    <div>
      <h1>{taskList.title}</h1>
      <ul>
        {taskList.tasks.map((task: any) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      <form onSubmit={handleNewTaskSubmit}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Route exact path="/" component={TaskListsPage} />
      <Route path="/taskLists/:id" component={TaskListPage} />
    </Router>
  );
};

export default App;
