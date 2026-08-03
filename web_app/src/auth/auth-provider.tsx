"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { demoUsers, defaultUserPreferences } from "@/data/auth-fixtures";
import type { User, UserPreferences } from "@/data/types";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface AuthUser extends User {
  preferences: UserPreferences;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  updatePreferences: (preferences: UserPreferences) => void;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  organization: string;
  role: string;
}

interface StoredAuthUser extends AuthUser {
  password: string;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [storedUser, setStoredUser] = useLocalStorage<AuthUser | null>("bioevent.auth.user", null);
  const [registeredUsers, setRegisteredUsers] = useLocalStorage<StoredAuthUser[]>(
    "bioevent.auth.registeredUsers",
    [],
  );
  const [sessionUser, setSessionUser] = useState<AuthUser | null>(null);
  const user = storedUser ?? sessionUser;

  const login = useCallback(
    async (email: string, password: string, remember: boolean) => {
      await delay();
      const found = [...demoUsers, ...registeredUsers].find(
        (item) => item.email.toLowerCase() === email.toLowerCase(),
      );
      if (!found || found.password !== password) throw new Error("邮箱或密码不正确");
      const safeUser: AuthUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        avatarUrl: found.avatarUrl,
        organization: found.organization,
        role: found.role,
        bio: found.bio,
        createdAt: found.createdAt,
        preferences: found.preferences,
      };
      if (remember) {
        setStoredUser(safeUser);
        setSessionUser(null);
      } else {
        setSessionUser(safeUser);
        setStoredUser(null);
      }
    },
    [registeredUsers, setStoredUser],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      await delay();
      const exists = [...demoUsers, ...registeredUsers].some(
        (item) => item.email.toLowerCase() === input.email.toLowerCase(),
      );
      if (exists) throw new Error("该邮箱已经注册");
      const nextUser: AuthUser = {
        id: `user-${Date.now()}`,
        name: input.name,
        email: input.email,
        avatarUrl: "",
        organization: input.organization,
        role: input.role,
        bio: "",
        createdAt: new Date().toISOString(),
        preferences: defaultUserPreferences,
      };
      setRegisteredUsers([{ ...nextUser, password: input.password }, ...registeredUsers]);
      setStoredUser(nextUser);
      setSessionUser(null);
      router.push("/onboarding");
    },
    [registeredUsers, router, setRegisteredUsers, setStoredUser],
  );

  const logout = useCallback(() => {
    setStoredUser(null);
    setSessionUser(null);
    router.push("/");
  }, [router, setStoredUser]);

  const updateUser = useCallback(
    (patch: Partial<AuthUser>) => {
      if (!user) return;
      const next = { ...user, ...patch };
      setStoredUser(next);
      setSessionUser(null);
    },
    [setStoredUser, user],
  );

  const updatePreferences = useCallback(
    (preferences: UserPreferences) => {
      if (!user) return;
      const next = { ...user, preferences };
      setStoredUser(next);
      setSessionUser(null);
    },
    [setStoredUser, user],
  );

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      updateUser,
      updatePreferences,
    }),
    [login, logout, register, updatePreferences, updateUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

function delay() {
  return new Promise((resolve) => window.setTimeout(resolve, 350));
}
