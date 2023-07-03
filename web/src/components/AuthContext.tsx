import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async (email: string, password: string) => {},
  logout: () => {},
});

// Create a User interface to define the user object
interface User {
  id: string;
  email: string;
}

// Create the AuthProvider component
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to check if the user is authenticated
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/check-auth");
      if (response.ok) {
        const user = await response.json();
        setUser(user);
      } else {
        // Handle authentication error
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle user login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const user = await response.json();
        setUser(user);
      } else {
        // Handle login error
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
