import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform validation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the JWT in local storage
        localStorage.setItem("jwtToken", data.token);
        // Navigate to the login page after successful registration
        navigate("/login");
      } else {
        // Handle registration error
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto border p-8 rounded-lg bg-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create a new account
      </h2>

      <div className="mb-4">
        <label
          htmlFor="username"
          className="block mb-2 text-lg font-medium text-gray-800"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
          value={username}
          minLength={6}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block mb-2 text-lg font-medium text-gray-800"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="confirm-password"
          className="block mb-2 text-lg font-medium text-gray-800"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-lg font-semibold hover:text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
      >
        Register
      </button>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="text-center w-full underline mt-6 hover:text-blue-500"
      >
        already have an account ?
      </button>
    </form>
  );
};

export default RegisterForm;
