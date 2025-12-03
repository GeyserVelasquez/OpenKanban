"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for logged in user on mount
    const storedUser = localStorage.getItem("OPENKANBAN_USER");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("OPENKANBAN_USER");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real local-only app, we might check against a list of registered users in localStorage
    // For now, we'll check if the user exists in "OPENKANBAN_USERS" array
    const usersJson = localStorage.getItem("OPENKANBAN_USERS");
    const users: any[] = usersJson ? JSON.parse(usersJson) : [];

    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("OPENKANBAN_USER", JSON.stringify(userWithoutPassword));
      router.push("/");
    } else {
      throw new Error("Credenciales inválidas");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const usersJson = localStorage.getItem("OPENKANBAN_USERS");
    const users: any[] = usersJson ? JSON.parse(usersJson) : [];

    if (users.some((u) => u.email === email)) {
      throw new Error("El correo electrónico ya está registrado");
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // In a real app, never store passwords in plain text! But this is a local mock.
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    };

    users.push(newUser);
    localStorage.setItem("OPENKANBAN_USERS", JSON.stringify(users));

    // Auto login after register
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("OPENKANBAN_USER", JSON.stringify(userWithoutPassword));
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("OPENKANBAN_USER");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
