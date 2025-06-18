import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safely parse localStorage user
  const storedUser = localStorage.getItem("user");
  let parsedUser = null;

  try {
    if (storedUser && storedUser !== "undefined") {
      parsedUser = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Invalid user data in localStorage:", e);
    localStorage.removeItem("user");
  }

  const [user, setUser] = useState(parsedUser);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userId", userData.id); // ✅ Corrected: was userData.userId
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
