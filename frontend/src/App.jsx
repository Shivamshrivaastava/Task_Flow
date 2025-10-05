import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./lib/supabaseClient"
import AuthPage from "./pages/AuthPage"
import TasksPage from "./pages/TasksPage"
import DashboardPage from "./pages/DashboardPage"
import CalendarPage from "./pages/CalendarPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import Layout from "./components/Layout"

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  if (session === undefined) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!session) return <AuthPage />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  )
}
