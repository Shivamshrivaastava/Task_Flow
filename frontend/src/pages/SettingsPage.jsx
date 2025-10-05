import { useTranslation } from "react-i18next";
import { CheckSquare, CalendarDays, BarChart3, Globe } from "lucide-react";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{t("settings")}</h1>

      {/* Features Overview */}
      <div className="card p-6 rounded-xl shadow border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{t("features")}</h2>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-center gap-2">
            <CheckSquare className="text-indigo-500" size={18} />
            {t("manage_tasks")} – {t("add_edit_delete_tasks")}
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays className="text-green-500" size={18} />
            {t("calendar_integration")} – {t("hover_view_tasks")}
          </li>
          <li className="flex items-center gap-2">
            <BarChart3 className="text-orange-500" size={18} />
            {t("dashboard_stats")} – {t("track_progress_completion")}
          </li>
          <li className="flex items-center gap-2">
            <Globe className="text-pink-500" size={18} />
            {t("multilingual_support")} – {t("english_hindi")}
          </li>
        </ul>
      </div>

      {/* Language Settings */}
      <div className="card p-6 rounded-xl shadow border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold mb-4">{t("language")}</h2>
        <select
          onChange={handleLanguageChange}
          value={i18n.language}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
    </div>
  );
}
