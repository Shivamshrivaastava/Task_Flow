import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient";
import { LogOut, Globe, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loginTime, setLoginTime] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setLoginTime(new Date().toLocaleString());
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">{t("profile")}</h1>

      {/* Profile Header */}
      <div className="card p-6 flex flex-col items-center text-center bg-white rounded-xl shadow border border-gray-200">
        <img
          src={`https://ui-avatars.com/api/?name=${displayName}&size=120&background=0D8ABC&color=fff`}
          alt="profile"
          className="rounded-full mb-4"
        />
        <h2 className="text-lg font-semibold">{displayName}</h2>

        {user ? (
          <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
            <ShieldCheck size={14} /> {t("authenticated")}
          </span>
        ) : (
          <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">
            {t("not_authenticated")}
          </span>
        )}

        {loginTime && (
          <p className="text-sm text-gray-500 mt-2">
            {t("login_time")}: {loginTime}
          </p>
        )}
      </div>

      {/* Account Info */}
      <div className="card p-6 bg-white rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">{t("account_information")}</h2>
        {user ? (
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>{t("name")}:</strong> {displayName}
            </li>
            <li>
              <strong>{t("email")}:</strong> {user.email}
            </li>
            <li>
              <strong>{t("user_id")}:</strong> {user.id}
            </li>
            <li>
              <strong>{t("role")}:</strong>{" "}
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  user.role === "authenticated"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role ? t(user.role) : t("standard_user")}
              </span>
            </li>
          </ul>
        ) : (
          <p className="text-gray-500">{t("no_user_logged_in")}</p>
        )}
      </div>

      {/* Preferences */}
      <div className="card p-6 bg-white rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">{t("preferences")}</h2>
        <div className="flex items-center gap-3">
          <Globe className="text-blue-600" size={20} />
          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      {user && (
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            <LogOut size={16} /> {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
