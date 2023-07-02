import React from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <LoginForm />
    </div>
  );
};

export default Login;
