import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://vishalmasala.onrender.com"; // Default to future Render URL

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  user_metadata?: Record<string, any>; // For backward compatibility
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    mobile: string;
  }) => Promise<{ error: string | null }>;
  updateProfileMetadata: (payload: Record<string, string>) => Promise<{ error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const formatUser = (data: any): AuthUser => ({
    id: data._id,
    name: data.name,
    email: data.email,
    role: data.role,
    token: data.token,
    phone: data.phone,
    address: data.address,
    user_metadata: {
      first_name: data.name.split(" ")[0],
      last_name: data.name.split(" ").slice(1).join(" "),
      mobile: data.phone,
      address_line_1: data.address?.line1,
      address_line_2: data.address?.line2,
      city: data.address?.city,
      state: data.address?.state,
      pincode: data.address?.pincode,
      country: data.address?.country,
      role: data.role
    }
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("vishal_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem("vishal_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.message || "Login failed" };

      const authUser = formatUser(data);
      setUser(authUser);
      localStorage.setItem("vishal_user", JSON.stringify(authUser));
      return { error: null };
    } catch (err: any) {
      return { error: err.message || "Server connection error" };
    }
  };

  const signup = async ({
    email,
    password,
    first_name,
    last_name,
    mobile,
  }: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    mobile: string;
  }) => {
    try {
      const name = `${first_name} ${last_name}`.trim();
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.message || "Signup failed" };

      const authUser = formatUser(data);
      setUser(authUser);
      localStorage.setItem("vishal_user", JSON.stringify(authUser));
      return { error: null };
    } catch (err: any) {
      return { error: err.message || "Server connection error" };
    }
  };

  const updateProfileMetadata = async (payload: Record<string, string>) => {
    try {
      if (!user?.token) return { error: "Not authenticated" };

      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: `${payload.first_name || ""} ${payload.last_name || ""}`.trim(),
          phone: payload.mobile,
          address: {
            line1: payload.address_line_1,
            line2: payload.address_line_2,
            city: payload.city,
            state: payload.state,
            pincode: payload.pincode,
            country: payload.country,
          }
        }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.message || "Profile update failed" };

      const authUser = formatUser(data);
      setUser(authUser);
      localStorage.setItem("vishal_user", JSON.stringify(authUser));
      return { error: null };
    } catch (err: any) {
      return { error: err.message || "Server connection error" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vishal_user");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      login,
      signup,
      updateProfileMetadata,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
