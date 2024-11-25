interface StatsCardProps {
  title: string;
  value: string | number;
  colorClass?: string;
}

export function StatsCard({ title, value, colorClass = "text-primary" }: StatsCardProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}