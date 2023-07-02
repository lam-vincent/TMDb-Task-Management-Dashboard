import React from "react";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";

const Register: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <RegisterForm />
    </div>
  );
};

export default Register;
