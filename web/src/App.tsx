import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TaskList from "./components/TaskList";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/tasks" component={TaskList} />
      </Switch>
    </Router>
  );
}

export default App;
