import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";
import { useTasks } from "../store/useTasks";
import { translateText } from "../lib/translateText";

export default function CalendarPage() {
  const { t, i18n } = useTranslation();
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayTasks, setDayTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      if (!selectedDate) return;
      const dateStr = selectedDate.toISOString().split("T")[0];
      const filtered = tasks.filter((task) => task.created_at.split("T")[0] === dateStr);
      const translated = await Promise.all(
        filtered.map(async (task) => {
          const titleTr = await translateText(task.title, i18n.language);
          return { ...task, title: titleTr };
        })
      );
      setDayTasks(translated);
    }
    loadTasks();
  }, [selectedDate, tasks, i18n.language]);

  const statusColors = {
    todo: "bg-red-500",
    in_progress: "bg-yellow-500",
    done: "bg-green-500",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("calendar")}</h1>
      <div className="card p-6 flex flex-col">
        <div className="flex justify-center">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded-md border border-gray-200 shadow-sm w-full sm:w-auto"
            tileContent={({ date }) => {
              const dateStr = date.toISOString().split("T")[0];
              const dayTasks = tasks.filter((task) => task.created_at.split("T")[0] === dateStr);
              if (dayTasks.length === 0) return null;
              return (
                <div className="flex justify-center gap-1 mt-1">
                  {["todo", "in_progress", "done"].map(
                    (status) =>
                      dayTasks.some((task) => task.status === status) && (
                        <span
                          key={status}
                          className={`w-2 h-2 rounded-full ${statusColors[status]}`}
                        ></span>
                      )
                  )}
                </div>
              );
            }}
          />
        </div>
        {selectedDate && (
          <div className="mt-4 text-left border-t pt-3 max-h-56 overflow-y-auto">
            <h3 className="font-semibold mb-2 text-sm">
              {t("tasks_on")} {selectedDate.toDateString()}
            </h3>
            {dayTasks.length > 0 ? (
              <ul className="list-disc ml-6 space-y-1 text-sm">
                {dayTasks.map((task) => (
                  <li key={task.id}>{task.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">{t("no_tasks")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
