// src/store/useTasks.js
import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";

export const useTasks = create((set) => ({
  tasks: [],
  loading: true,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      //  Wait for Supabase to restore session
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) {
        set({ tasks: [], loading: false });
        return;
      }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ tasks: data || [], loading: false });
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      set({ tasks: [], loading: false });
    }
  },

  addTask: async (task) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) throw new Error("User not logged in");

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ ...task, user_id: user.id, status: "in_progress" }])
      .select();

    if (error) throw error;

    set((state) => ({ tasks: [data[0], ...state.tasks] }));
  },

  updateTask: async (id, updates) => {
    const { error } = await supabase.from("tasks").update(updates).eq("id", id);
    if (error) throw error;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  deleteTask: async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
}));
