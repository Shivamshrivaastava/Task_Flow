import { useTranslation } from "react-i18next";
import { useTasks } from "../store/useTasks";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { tasks } = useTasks();

  const data = [
    { name: t("all"), value: tasks.filter((t) => t.status === "todo").length },
    { name: t("in_progress"), value: tasks.filter((t) => t.status === "in_progress").length },
    { name: t("done"), value: tasks.filter((t) => t.status === "done").length },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("analytics")}</h1>
      <div className="card p-6">
        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
