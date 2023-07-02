import React, { useState } from "react";
import axios from "axios";

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform validation here

    try {
      const response = await axios.post("/api/register", {
        username,
        password,
        email,
      });

      // Handle successful registration
      console.log(response.data);
    } catch (error) {
      // Handle registration error
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          value={username}
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block mb-2 text-lg font-medium text-gray-800"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
