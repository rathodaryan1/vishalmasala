import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (
    payload: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      mobile: string;
    }
  ) => Promise<{ error: string | null }>;
  updateProfileMetadata: (payload: Record<string, string>) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const isUserAdmin = (user: User | null) => {
  const roleInMetadata = user?.user_metadata?.role ?? user?.app_metadata?.role;
  return roleInMetadata === "admin";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase || !hasSupabaseConfig) {
      return { error: "Supabase is not configured. Add env variables first." };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
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
    if (!supabase || !hasSupabaseConfig) {
      return { error: "Supabase is not configured. Add env variables first." };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          mobile,
          full_name: `${first_name} ${last_name}`.trim(),
        },
      },
    });
    return { error: error?.message ?? null };
  };

  const updateProfileMetadata = async (payload: Record<string, string>) => {
    if (!supabase || !hasSupabaseConfig) {
      return { error: "Supabase is not configured. Add env variables first." };
    }
    const { error } = await supabase.auth.updateUser({ data: payload });
    return { error: error?.message ?? null };
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isAdmin: isUserAdmin(user),
      login,
      signup,
      updateProfileMetadata,
      logout,
    }),
    [user, session, loading]
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
