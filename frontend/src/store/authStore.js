import { create } from "zustand";
import api from "../lib/api";
import useLanguageStore from "./languageStore";

const getInitialToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || null;
};

const initialToken = getInitialToken();

const useAuthStore = create((set) => ({
  token: initialToken,
  user: null,
  isHydrating: !!initialToken,
  isHydrated: !initialToken,

  login: (token, user) => {
    localStorage.setItem("token", token);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    if (user?.language) {
      useLanguageStore.getState().setLanguage(user.language);
    }
    set({ token, user, isHydrating: false, isHydrated: true });
  },

  updateUser: (user) => {
    if (user?.language) {
      useLanguageStore.getState().setLanguage(user.language);
    }
    set((state) => {
      const updated = { ...state.user, ...user };
      localStorage.setItem("user", JSON.stringify(updated));
      return { user: updated };
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isHydrating: false, isHydrated: true });
  },

  hydrate: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ token: null, user: null, isHydrating: false, isHydrated: true });
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    set({ token, user: savedUser, isHydrating: true });

    try {
      const data = await api.get("/auth/me");
      if (data?.language) {
        useLanguageStore.getState().setLanguage(data.language);
      }
      localStorage.setItem("user", JSON.stringify(data));
      set({ token, user: data, isHydrating: false, isHydrated: true });
    } catch (error) {
      console.error("Hydration failed:", error);
      if (error?.code === "UNAUTHORIZED") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null, isHydrating: false, isHydrated: true });
      } else {
        // Fallback to saved user or default active session to keep app accessible
        set({ token, user: savedUser || { name: "Daksh" }, isHydrating: false, isHydrated: true });
      }
    }
  },
}));

export default useAuthStore;
