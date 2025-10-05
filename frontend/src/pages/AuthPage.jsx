import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      if (err.message.includes("Invalid login credentials")) {
        setError(t("invalid_login"));
      } else {
        setError(err.message || t("something_went_wrong"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 relative overflow-hidden px-4">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 flex items-center bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => i18n.changeLanguage("en")}
          className={`px-4 py-1.5 text-sm font-medium transition-all ${
            i18n.language === "en"
              ? "bg-blue-600 text-white font-semibold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          English
        </button>
        <button
          onClick={() => i18n.changeLanguage("hi")}
          className={`px-4 py-1.5 text-sm font-medium transition-all ${
            i18n.language === "hi"
              ? "bg-blue-600 text-white font-semibold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          हिंदी
        </button>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 transform transition-all hover:shadow-blue-100">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-3">
          {t("app_name")}
        </h1>

        <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
          {isLogin ? t("login_to_continue") : t("signup_to_get_started")}
        </p>

        {/* Toggle Tabs */}
        <div className="flex mb-8 rounded-full overflow-hidden border border-gray-200 bg-gray-50">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 font-medium text-sm transition ${
              isLogin ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t("login")}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 font-medium text-sm transition ${
              !isLogin ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t("signup")}
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-lg font-semibold text-center text-gray-800">
            {isLogin ? t("welcome_back") : t("create_account")}
          </h2>

          {error && (
            <p className="text-red-600 text-sm text-center font-medium bg-red-50 py-2 rounded-md">
              {error}
            </p>
          )}

          <div>
            <input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? t("loading") : isLogin ? t("login") : t("signup")}
          </button>
        </form>
      </div>
    </div>
  );
}
