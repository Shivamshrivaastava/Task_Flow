/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTasks } from "../store/useTasks";
import { translateText } from "../lib/translateText";
import { CalendarDays, Clock, CheckCircle2, ListTodo } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { tasks, fetchTasks } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, []);

  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const completion = total > 0 ? Math.round((done / total) * 100) : 0;

  const recentTasks = [...tasks].slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">{t("dashboard")}</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t("total")} value={total} color="blue" icon={<ListTodo size={20} />} />
        <StatCard label={t("todo")} value={todo} color="red" icon={<Clock size={20} />} />
        <StatCard label={t("in_progress")} value={inProgress} color="yellow" icon={<CalendarDays size={20} />} />
        <StatCard label={t("done")} value={done} color="green" icon={<CheckCircle2 size={20} />} />
      </div>

      {/* Completion Progress */}
      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4">{t("completion")}</h2>
        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-indigo-500 h-4 rounded-full transition-all"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-600">{completion}%</p>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mini Calendar */}
        <MiniCalendar tasks={tasks} />

        {/* Recent Tasks */}
        <div className="card p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ListTodo size={18} className="text-blue-600" /> {t("recent_tasks")}
          </h2>
          <ul className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => <RecentTask key={task.id} task={task} />)
            ) : (
              <p className="text-slate-500">{t("no_tasks")}</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------
   Stat Card Component
------------------------- */
function StatCard({ label, value, color, icon }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="card p-4 flex flex-col items-center shadow-sm border border-gray-200 rounded-lg bg-white">
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors[color]}`}
      >
        {icon} {label}
      </div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}

/* ------------------------
   Mini Calendar Component
------------------------- */
function MiniCalendar({ tasks }) {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayTasks, setDayTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      if (!selectedDate) return;
      const dateStr = selectedDate.toISOString().split("T")[0];
      const filtered = tasks.filter(
        (task) => task.created_at.split("T")[0] === dateStr
      );
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

  return (
    <div className="card p-6 flex flex-col">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <CalendarDays size={18} className="text-blue-600" /> {t("calendar")}
      </h2>

      <div className="flex justify-center">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="rounded-md border border-gray-200 shadow-sm"
          tileContent={({ date }) => {
            const dateStr = date.toISOString().split("T")[0];
            const dayTasks = tasks.filter(
              (task) => task.created_at.split("T")[0] === dateStr
            );

            if (dayTasks.length === 0) return null;

            return (
              <div className="flex justify-center gap-1 mt-1">
                {["todo", "in_progress", "done"].map(
                  (status) =>
                    dayTasks.some((task) => task.status === status) && (
                      <span
                        key={status}
                        className={`w-2 h-2 rounded-full ${
                          status === "todo"
                            ? "bg-red-500"
                            : status === "in_progress"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></span>
                    )
                )}
              </div>
            );
          }}
        />
      </div>

      {selectedDate && (
        <div className="mt-4 text-left border-t pt-3 max-h-40 overflow-y-auto">
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
  );
}

/* ------------------------
   Recent Task Item
------------------------- */
function RecentTask({ task }) {
  const { t, i18n } = useTranslation();
  const [translatedTitle, setTranslatedTitle] = useState(task.title);

  useEffect(() => {
    let ignore = false;
    async function doTranslate() {
      const titleTr = await translateText(task.title, i18n.language);
      if (!ignore) setTranslatedTitle(titleTr || task.title);
    }
    doTranslate();
    return () => {
      ignore = true;
    };
  }, [task.title, i18n.language]);

  const statusColors = {
    todo: "bg-red-100 text-red-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    done: "bg-green-100 text-green-700",
  };

  return (
    <li className="flex justify-between items-center border-b pb-2">
      <span className="font-medium">{translatedTitle}</span>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}
      >
        {t(task.status)}
      </span>
    </li>
  );
}
