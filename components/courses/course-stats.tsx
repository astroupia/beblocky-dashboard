import { Card } from "@/components/ui/card";
import { Book, Users, Clock, Trophy } from "lucide-react";

export function CourseStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Courses"
        value="8"
        icon={Book}
        trend="+3 this month"
      />
      <StatCard
        title="Active Students"
        value="32"
        icon={Users}
        trend="+12% from last month"
        trendUp={true}
      />
      <StatCard
        title="Average Completion"
        value="65%"
        icon={Clock}
        trend="+5% from last month"
        trendUp={true}
      />
      <StatCard
        title="Certifications"
        value="10"
        icon={Trophy}
        trend="+48 this month"
        trendUp={true}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: any;
  trend: string;
  trendUp?: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = false,
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <span
          className={`text-sm ${
            trendUp ? "text-[#FF932C]" : "text-muted-foreground"
          }`}
        >
          {trend}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-3xl font-bold text-[primary]">{value}</p>
    </Card>
  );
}
