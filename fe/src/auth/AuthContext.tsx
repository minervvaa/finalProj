import { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthHeaders } from "../api";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw) as User;
      setUser(u);
      setAuthHeaders({ id: u.id, role: u.role });
    }
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    // backend returns: { user: { id, first_name, last_name, email, role } }
    const row = res.data.user;
    const u: User = {
      id: row.id,
      firstName: row.first_name ?? row.firstName,
      lastName: row.last_name ?? row.lastName,
      email: row.email,
      role: row.role,
    };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    setAuthHeaders({ id: u.id, role: u.role });
  }

  async function register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const res = await api.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });
    const row = res.data.user;
    const u: User = {
      id: row.id,
      firstName: row.first_name ?? firstName,
      lastName: row.last_name ?? lastName,
      email: row.email,
      role: row.role,
    };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    setAuthHeaders({ id: u.id, role: u.role });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    setAuthHeaders(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
