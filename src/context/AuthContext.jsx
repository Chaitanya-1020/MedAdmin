import { createContext, useContext, useState } from "react";
import { MOCK_USERS } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Load from sessionStorage so refresh keeps user logged in within tab
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("hms_user")) || null; }
    catch { return null; }
  });
  const [registeredUsers, setRegisteredUsers] = useState([...MOCK_USERS]);

  const login = (email, password, role) => {
    const found = registeredUsers.find(
      u => u.email === email && u.password === password && u.role === role && u.status === "active"
    );
    if (!found) return { success: false, message: "Invalid credentials or account inactive." };
    sessionStorage.setItem("hms_user", JSON.stringify(found));
    setUser(found);
    return { success: true };
  };

  const signup = (data) => {
    const exists = registeredUsers.find(u => u.email === data.email);
    if (exists) return { success: false, message: "Email already registered." };
    const newUser = {
      ...data,
      id: `USR${Date.now()}`,
      status: data.role === "admin" ? "active" : "active", // in prod, admin approves
      createdAt: new Date().toISOString(),
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    sessionStorage.setItem("hms_user", JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    sessionStorage.removeItem("hms_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, registeredUsers, setRegisteredUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
