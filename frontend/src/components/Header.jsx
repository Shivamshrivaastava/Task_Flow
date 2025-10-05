import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient";
import { LogOut, User, Menu, X } from "lucide-react";
import { useAutoTranslate } from "../hooks/useAutoTranslate";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState([""]);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    }
    loadUser();
  }, []);

  // Auto translate user email (if exists)
  useAutoTranslate([user?.email || ""], setTranslatedTexts, i18n.language);
  const [translatedEmail] = translatedTexts;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-gray-200 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo / Title */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600 select-none">
              {t("app_name")}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/dashboard"
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium transition"
            >
              {t("dashboard")}
            </Link>
            <Link
              to="/tasks"
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium transition"
            >
              {t("my_tasks")}
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium transition"
            >
              {t("profile")}
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language Switch */}
            <select
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              value={i18n.language}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>

            {/* User Info */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.email}&background=6366f1&color=fff`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                    {translatedEmail}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 hidden group-hover:block bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg w-44 overflow-hidden">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200"
                  >
                    <User size={16} /> {t("profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                  >
                    <LogOut size={16} /> {t("logout")}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/"
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
              >
                {t("login")}
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-600 px-4 py-3 space-y-2">
          <Link
            to="/dashboard"
            className="block text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium"
          >
            {t("dashboard")}
          </Link>
          <Link
            to="/tasks"
            className="block text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium"
          >
            {t("my_tasks")}
          </Link>
          <Link
            to="/profile"
            className="block text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium"
          >
            {t("profile")}
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left text-red-600 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 px-2 py-1"
            >
              {t("logout")}
            </button>
          ) : (
            <Link
              to="/"
              className="block px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
            >
              {t("login")}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
