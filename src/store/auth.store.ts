// src/store/auth.store.ts
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { api } from "../lib/api";

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  verified: boolean;
  available: boolean;
  totalConnections: number;
  totalPosts: number;
  totalAppreciations: number;
  pricingFrom?: number;
  skills?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    fullName: string;
    email: string;
    password: string;
    city?: string;
    bio?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  updateUser: (u: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const token = data.accessToken ?? data.data?.accessToken;
    const user = data.user ?? data.data?.user;
    await SecureStore.setItemAsync("kinship_token", token);
    set({ user, token, isAuthenticated: true });
  },

  register: async (registerData) => {
    const { data } = await api.post("/auth/register", registerData);
    const token = data.accessToken ?? data.data?.accessToken;
    const user = data.user ?? data.data?.user;
    await SecureStore.setItemAsync("kinship_token", token);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("kinship_token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync("kinship_token");
      if (token) {
        const { data } = await api.get("/auth/me");
        const user = data.data ?? data;
        set({ user, token, isAuthenticated: true });
      }
    } catch (_) {
      await SecureStore.deleteItemAsync("kinship_token").catch(() => {});
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: (u) =>
    set((s) => ({ user: s.user ? { ...s.user, ...u } : s.user })),
}));
