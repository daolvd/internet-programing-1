interface Stat {
  icon: React.ComponentType<{ className: string }>;
  change: string;
  title: string;
  value: string | number;
}

export default function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;

  const isPositive = stat.change.includes("+");
  const isNegative = stat.change.includes("-");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">

      <div className="flex justify-between items-start">

        {/* ICON */}
        <div className="rounded-xl bg-slate-100 p-3">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>

        {/* CHANGE */}
        <span
          className={`text-sm font-medium ${
            isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500"
          }`}
        >
          {stat.change}
        </span>

      </div>

      <p className="text-gray-500 mt-3 text-sm">
        {stat.title}
      </p>

      <p className="text-xl font-bold mt-1">
        {stat.value}
      </p>

    </div>
  );
}
