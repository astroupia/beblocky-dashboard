"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, School } from "lucide-react";

interface MetricsProps {
  metrics: {
    totalRevenue: number;
    totalStudents: number;
    totalTeachers: number;
    totalSchools: number;
  };
}

export default function Metrics({ metrics }: MetricsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className=" bg-white dark:bg-gray-800">
        <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-[#892FFF]" />
          </div>
          <CardTitle className="text-lg font-semibold mb-1 dark:text-gray-300">
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#892FFF]">
            ${metrics.totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-[#FF932C]">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Students
          </CardTitle>
          <Users className="h-4 w-4 text-[#892FFF]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#892FFF]">
            {metrics.totalStudents.toLocaleString()}
          </div>
          <p className="text-xs text-[#FF932C]">+180 this week</p>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Teachers
          </CardTitle>
          <BookOpen className="h-4 w-4 text-[#892FFF]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#892FFF]">
            {metrics.totalTeachers}
          </div>
          <p className="text-xs text-[#FF932C]">+3 this week</p>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Schools
          </CardTitle>
          <School className="h-4 w-4 text-[#892FFF]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#892FFF]">
            {metrics.totalSchools}
          </div>
          <p className="text-xs text-[#FF932C]">+2 this month</p>
        </CardContent>
      </Card>
    </div>
  );
}
