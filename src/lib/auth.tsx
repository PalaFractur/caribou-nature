import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";
import { Navigate } from "react-router-dom";
import PageLoader from "@/components/PageLoader";

export interface ClientProfile {
  id: string;
  prenom: string;
  nom: string;
  telephone?: string;
  created_at: string;
}

// ── Mode démo local (sans Supabase) ──────────────────────────────────────────
const LOCAL_ADMIN_EMAIL = "admin@caribounature.fr";
const LOCAL_ADMIN_PASSWORD = "caribou2024";
const LOCAL_SESSION_KEY = "cn_local_admin";

function getLocalAdminSession(): boolean {
  return localStorage.getItem(LOCAL_SESSION_KEY) === "1";
}

// Fake User object pour le mode local
function makeFakeUser(): User {
  return {
    id: "local-admin",
    email: LOCAL_ADMIN_EMAIL,
    app_metadata: {},
    user_metadata: { prenom: "Admin", nom: "Local" },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as unknown as User;
}

// ── Auth Context ──────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  profile: ClientProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (prenom: string, nom: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Mode local : restaurer la session depuis localStorage
      if (getLocalAdminSession()) {
        const fakeUser = makeFakeUser();
        setUser(fakeUser);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data as ClientProfile);
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      if (email === LOCAL_ADMIN_EMAIL && password === LOCAL_ADMIN_PASSWORD) {
        localStorage.setItem(LOCAL_SESSION_KEY, "1");
        setUser(makeFakeUser());
        return { success: true };
      }
      return { success: false, error: "Email ou mot de passe incorrect." };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: "Email ou mot de passe incorrect." };
    return { success: true };
  };

  const signUp = async (prenom: string, nom: string, email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: "Inscription non disponible en mode local." };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { prenom, nom } },
    });
    if (error) {
      if (error.message.includes("already registered")) {
        return { success: false, error: "Un compte existe déjà avec cet email." };
      }
      return { success: false, error: error.message };
    }
    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, prenom, nom });
    }
    return { success: true };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: "Non disponible en mode local." };
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signIn, signUp, signOut, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ── Admin guard ───────────────────────────────────────────────────────────────
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || LOCAL_ADMIN_EMAIL;

export function useAdmin() {
  const { user, session, loading, signIn, signOut } = useAuth();
  const isAuthenticated = !loading && !!user && user.email === ADMIN_EMAIL;

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.success) return false;
    if (!isSupabaseConfigured) return email === ADMIN_EMAIL;
    const { data: { user: u } } = await supabase.auth.getUser();
    return u?.email === ADMIN_EMAIL;
  };

  const logout = () => signOut();

  return { isAuthenticated, loading, login, logout, session };
}

export function AdminProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
