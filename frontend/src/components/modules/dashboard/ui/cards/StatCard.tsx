interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  badge?: string;
  icon: string;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType,
  badge,
  icon,
  subtitle,
}: StatCardProps) {
  return (
    <div className="card stat-card p-5">
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold mr-2">{value}</span>
          {change && (
            <span
              className={`text-sm flex items-center ${changeType === "positive" ? "text-success" : "text-warning"}`}
            >
              <i
                className={`fas ${changeType === "positive" ? "fa-arrow-up" : "fa-arrow-down"} mr-1`}
              ></i>
              {change}
            </span>
          )}
          {badge && (
            <span className="text-success bg-green-900 bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
              {badge}
            </span>
          )}
        </div>
        <i className={`${icon} text-2xl text-gray-500`}></i>
      </div>
      {subtitle && <div className="mt-2 text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
}
