/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTasks } from "../store/useTasks";
import { translateText } from "../lib/translateText";

// --- Custom debounce ---
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// --- Custom throttle ---
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export default function TaskItem({ task, section }) {
  const { t, i18n } = useTranslation();
  const { updateTask, deleteTask } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const [translatedTitle, setTranslatedTitle] = useState(task.title);
  const [translatedNotes, setTranslatedNotes] = useState(task.notes || "");
  const [toast, setToast] = useState(null);

  // --- Translate dynamically on language change ---
  useEffect(() => {
    let ignore = false;
    async function doTranslate() {
      if (!task.title && !task.notes) return;
      const titleTr = await translateText(task.title, i18n.language);
      const notesTr = task.notes
        ? await translateText(task.notes, i18n.language)
        : "";
      if (!ignore) {
        setTranslatedTitle(titleTr || task.title);
        setTranslatedNotes(notesTr || task.notes);
      }
    }
    doTranslate();
    return () => {
      ignore = true;
    };
  }, [task.title, task.notes, i18n.language]);

  // --- Toast helper ---
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Debounced update ---
  const handleUpdate = useCallback(
    debounce(() => {
      if (!title.trim()) {
        showToast(t("all_fields_required"), "error");
        return;
      }
      updateTask(task.id, { title, notes });
      setIsEditing(false);
      showToast(t("task_updated"));
    }, 400),
    [title, notes, task.id]
  );

  // --- Throttled delete ---
  const handleDelete = useCallback(
    throttle(() => {
      deleteTask(task.id);
      showToast(t("task_deleted"));
    }, 800),
    [task.id]
  );

  // --- Mark as Completed (immediate done) ---
  const handleMarkCompleted = useCallback(
    throttle(() => {
      if (task.status !== "done") {
        updateTask(task.id, { status: "done" });
        showToast(t("task_completed"));
      }
    }, 800),
    [task.id]
  );

  // --- Mark as In Progress (from done -> in_progress) ---
  const handleMarkInProgress = useCallback(
    throttle(() => {
      if (task.status === "done") {
        updateTask(task.id, { status: "in_progress" });
        showToast(t("task_in_progress"));
      }
    }, 800),
    [task.id]
  );

  return (
    <div
      className={`p-4 flex flex-col border rounded-lg shadow-sm transition-all duration-300 ${
        task.status === "done"
          ? "bg-green-50 border-green-200 shadow-md"
          : task.status === "in_progress"
          ? "bg-yellow-50 border-yellow-200 shadow-sm"
          : "bg-white border-gray-200"
      }`}
    >
      {isEditing ? (
        <div className="flex flex-col flex-1">
          {/* --- Edit Mode --- */}
          <div className="space-y-3 flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
              placeholder={t("title")}
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              placeholder={t("notes")}
            />
          </div>

          {/* --- Update / Cancel Buttons --- */}
          <div className="flex flex-wrap sm:flex-nowrap justify-stretch gap-2 mt-auto pt-3">
            <button
              onClick={handleUpdate}
              className="flex-1 min-w-[110px] px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all duration-200"
            >
              {t("update")}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 min-w-[110px] px-3 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-all duration-200"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          {/* --- View Mode --- */}
          <div className="space-y-2 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg break-words text-gray-900">
                {translatedTitle}
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded-full border ${
                  task.status === "done"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : task.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {t(task.status)}
              </span>
            </div>

            {translatedNotes && (
              <p className="text-sm text-gray-600">{translatedNotes}</p>
            )}

            <p className="text-xs text-gray-400">
              • {t("created")}: {new Date(task.created_at).toLocaleString()} <br />
              • {t("updated")}: {new Date(task.updated_at).toLocaleString()}
            </p>
          </div>

          {/* --- Action Buttons (Aligned for all devices) --- */}
          <div className="mt-auto pt-3">
            <div className="flex flex-wrap justify-stretch sm:justify-between gap-2 w-full">
              {section === "in_progress" && (
                <>
                  <button
                    onClick={handleMarkCompleted}
                    className="flex-1 min-w-[110px] px-3 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-all duration-200"
                  >
                    {t("mark_completed")}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 min-w-[110px] px-3 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-all duration-200"
                  >
                    {t("edit_task")}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 min-w-[110px] px-3 py-2 rounded-md border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 transition-all duration-200"
                  >
                    {t("delete")}
                  </button>
                </>
              )}

              {section === "done" && (
                <button
                  onClick={handleMarkInProgress}
                  className="w-full sm:w-auto flex-1 min-w-[140px] px-3 py-2 rounded-md border border-yellow-500 text-yellow-700 text-sm font-medium hover:bg-yellow-50 transition-all duration-200"
                >
                  {t("mark_in_progress")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Toast Popup --- */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-white text-sm transition-all duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
