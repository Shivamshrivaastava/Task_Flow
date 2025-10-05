import { useState, useEffect, useMemo } from "react";
import { useTasks } from "../store/useTasks";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import { useTranslation } from "react-i18next";
import { Search, Filter } from "lucide-react";

// simple debounce
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function TasksPage() {
  const { t } = useTranslation();
  const { tasks, loading, fetchTasks } = useTasks();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [filteredInProgress, setFilteredInProgress] = useState([]);
  const [filteredDone, setFilteredDone] = useState([]);

  // ✅ Fetch tasks when component mounts or user session restores
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const runSearch = useMemo(
    () =>
      debounce((query, filter, sort) => {
        const q = query.toLowerCase();
        let inProgress = tasks.filter((t) => t.status === "in_progress");
        let done = tasks.filter((t) => t.status === "done");

        // Filter by status
        if (filter !== "all") {
          inProgress = inProgress.filter((t) => t.status === filter);
          done = done.filter((t) => t.status === filter);
        }

        // Search
        if (q) {
          inProgress = inProgress.filter(
            (task) =>
              task.title.toLowerCase().includes(q) ||
              (task.notes && task.notes.toLowerCase().includes(q))
          );
          done = done.filter(
            (task) =>
              task.title.toLowerCase().includes(q) ||
              (task.notes && task.notes.toLowerCase().includes(q))
          );
        }

        // Sort
        const sortFn = (a, b) => {
          if (sort === "name_asc") return a.title.localeCompare(b.title);
          if (sort === "name_desc") return b.title.localeCompare(a.title);
          if (sort === "oldest")
            return new Date(a.created_at) - new Date(b.created_at);
          return new Date(b.created_at) - new Date(a.created_at);
        };

        inProgress.sort(sortFn);
        done.sort(sortFn);

        setFilteredInProgress(inProgress);
        setFilteredDone(done);
      }, 400),
    [tasks]
  );

  useEffect(() => {
    runSearch(search, statusFilter, sortBy);
  }, [search, statusFilter, sortBy, tasks, runSearch]);

  // 🦴 Skeleton loader (shows during Supabase restore or initial load)
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-lg p-4 border border-gray-200 shadow-sm space-y-3"
          >
            <div className="h-5 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-8 w-1/3 bg-indigo-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Task Creation Form */}
      <TaskForm />

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {t("tasks")}
        </h2>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_tasks")}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Filter */}
          <div className="relative w-full sm:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t("all_tasks")}</option>
              <option value="in_progress">{t("in_progress")}</option>
              <option value="done">{t("done")}</option>
            </select>
            <Filter
              size={16}
              className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">{t("sort_newest")}</option>
              <option value="oldest">{t("sort_oldest")}</option>
              <option value="name_asc">{t("sort_name_asc")}</option>
              <option value="name_desc">{t("sort_name_desc")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Sections */}
      {tasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-6">
          {t("no_tasks_available")}
        </p>
      ) : (
        <>
          {/* In Progress Section */}
          {filteredInProgress.length > 0 && (
            <section>
              {/* <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-3 flex items-center gap-2">
                {t("in_progress_tasks")}
              </h3> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredInProgress.map((task) => (
                  <TaskItem key={task.id} task={task} section="in_progress" />
                ))}
              </div>
            </section>
          )}

          {/* Completed Section */}
          {filteredDone.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-3 flex items-center gap-2">
                {t("completed_tasks")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDone.map((task) => (
                  <TaskItem key={task.id} task={task} section="done" />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
