/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  Calendar,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  Languages,
} from "lucide-react";

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      setTimeout(() => setLoading(false), 800);
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { name: t("dashboard"), icon: LayoutDashboard, path: "/dashboard" },
    { name: t("tasks"), icon: CheckSquare, path: "/tasks" },
    { name: t("analytics"), icon: BarChart2, path: "/analytics" },
    { name: t("calendar"), icon: Calendar, path: "/calendar" },
    { name: t("profile"), icon: User, path: "/profile" },
    { name: t("settings"), icon: Settings, path: "/settings" },
  ];

  // 🌐 Language switcher
  const LanguageSlider = () => (
    <div className="flex items-center gap-2">
      <Languages size={18} className="text-gray-500 dark:text-gray-300" />
      <div
        onClick={() => i18n.changeLanguage(i18n.language === "en" ? "hi" : "en")}
        className={`relative w-28 h-9 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600 transition-all duration-300 ${
          i18n.language === "hi"
            ? "bg-indigo-100 dark:bg-indigo-600"
            : "bg-gray-300 dark:bg-slate-700"
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            i18n.language === "hi" ? "translate-x-[68px]" : "translate-x-0"
          }`}
        ></div>
        <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold">
          <span
            className={`transition-colors ${
              i18n.language === "en"
                ? "text-indigo-700 dark:text-indigo-300"
                : "text-gray-400 dark:text-gray-400"
            }`}
          >
            EN
          </span>
          <span
            className={`transition-colors ${
              i18n.language === "hi"
                ? "text-blue-700 dark:text-blue-300 font-extrabold"
                : "text-gray-400 dark:text-gray-400"
            }`}
          >
            हिंदी
          </span>
        </div>
      </div>
    </div>
  );

  // 🦴 Skeleton Layout
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="space-y-4 w-[90%] max-w-xl animate-pulse">
          <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-6 w-2/3 bg-gray-300 rounded"></div>
          <div className="h-6 w-full bg-gray-300 rounded"></div>
          <div className="h-6 w-[70%] bg-gray-300 rounded"></div>
          <div className="h-10 w-[50%] bg-indigo-300 rounded"></div>
        </div>
      </div>
    );
  }

  // 🧭 Main Layout
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 bg-white dark:bg-slate-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-40`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-indigo-600">{t("app_name")}</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X size={20} className="text-gray-600 dark:text-gray-200" />
          </button>
        </div>

        <nav className="px-4 py-4 space-y-1">
          {navItems.map(({ name, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${
                  active
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-y-auto">
        {/* ✅ Responsive Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <Menu size={20} className="text-gray-600 dark:text-gray-200" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 capitalize">
              {t(location.pathname.split("/")[1]) || t("dashboard")}
            </h2>
          </div>

          {/* ✅ Compact language + logout section */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <LanguageSlider />
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-red-700 transition"
              >
                <LogOut size={14} /> {t("logout")}
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 pb-16 bg-gray-50 dark:bg-slate-900 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
//updated