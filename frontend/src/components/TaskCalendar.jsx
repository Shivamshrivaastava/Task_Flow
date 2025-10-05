import { useState, useEffect } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { useTranslation } from "react-i18next"
import { translateText } from "../lib/translateText"

export default function TaskCalendar({ tasks }) {
  const { t, i18n } = useTranslation()
  const [hoveredTasks, setHoveredTasks] = useState([])
  const [hoverDate, setHoverDate] = useState(null)

  useEffect(() => {
    async function loadTasks() {
      if (!hoverDate) return
      const dateStr = hoverDate.toISOString().split("T")[0]
      const filtered = tasks.filter(
        (task) => task.created_at.split("T")[0] === dateStr
      )

      const translated = await Promise.all(
        filtered.map(async (task) => {
          const titleTr = await translateText(task.title, i18n.language)
          return { ...task, title: titleTr }
        })
      )

      setHoveredTasks(translated)
    }
    loadTasks()
  }, [hoverDate, tasks, i18n.language])

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="calendar-wrap">
        <Calendar
          tileContent={({ date }) => {
            const hasTasks = tasks.some(
              (task) => task.created_at.split("T")[0] === date.toISOString().split("T")[0]
            )
            return hasTasks ? (
              <div
                onMouseEnter={() => setHoverDate(date)}
                className="mt-1 flex justify-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              </div>
            ) : null
          }}
        />
      </div>

      {hoverDate && (
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">
            {t("tasks_on")} {hoverDate.toDateString()}
          </h3>
          {hoveredTasks.length > 0 ? (
            <ul className="list-disc ml-6">
              {hoveredTasks.map((task) => (
                <li key={task.id}>
                  {task.title} — {t(task.status)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">{t("no_tasks")}</p>
          )}
        </div>
      )}
    </div>
  )
}
