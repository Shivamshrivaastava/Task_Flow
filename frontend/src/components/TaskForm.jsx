/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTasks } from "../store/useTasks";

export default function TaskForm() {
  const { t, i18n } = useTranslation();
  const { addTask } = useTasks();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleAddTask = async () => {
    setError("");

    // validation (translated)
    if (!title.trim() || !notes.trim()) {
      setError(t("all_fields_required"));
      return;
    }

    try {
      setLoading(true);
      await addTask({ title, notes, status: "in_progress" });
      setTitle("");
      setNotes("");
      showToast(t("task_added_success"));
    } catch (err) {
      setError(err.message || t("something_went_wrong"));
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Skeleton Loader
  const Skeleton = () => (
    <div className="animate-pulse space-y-4 p-6 bg-white rounded-lg shadow border border-gray-200">
      <div className="h-5 w-32 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-20 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="bg-white p-6 mb-6 rounded-lg shadow border border-gray-200 relative">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{t("add_task")}</h2>

      {loading ? (
        <Skeleton />
      ) : (
        <>
          {/* Title Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("title")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("title")}
            />
          </div>

          {/* Notes Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("notes")}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              placeholder={t("notes")}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          {/* Add Button */}
          <button
            onClick={handleAddTask}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? t("loading") : t("add_task")}
          </button>
        </>
      )}

      {/* Toast Popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg text-sm transition-opacity duration-300">
          {toast}
        </div>
      )}
    </div>
  );
}
