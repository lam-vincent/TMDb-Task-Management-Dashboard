import React from "react";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";

const Register: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-orange-100 to-blue-100">
      <Header />
      <RegisterForm />
    </div>
  );
};

export default Register;
