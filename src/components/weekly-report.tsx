"use client";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  getFirestore,
} from "firebase/firestore";
import firebase_app from "@/lib/firebase/firebase-client";
import { FirebaseApp } from "firebase/app";

const db = getFirestore(firebase_app as FirebaseApp);

interface TimeData {
  name: string;
  total: number;
  label: string;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Generate skeleton data based on period
const generateSkeletonData = (period: "weekly" | "monthly" | "yearly") => {
  const data: TimeData[] = [];
  const count = period === "weekly" ? 7 : period === "monthly" ? 30 : 12;

  for (let i = 0; i < count; i++) {
    data.push({
      name: i.toString(),
      label: period === "weekly" ? WEEKDAYS[i] : i.toString(),
      total: 0,
    });
  }
  return data;
};

export function Overview({
  period = "weekly",
}: {
  period?: "weekly" | "monthly" | "yearly";
}) {
  const [chartData, setChartData] = useState<TimeData[]>(
    generateSkeletonData(period)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeData = async () => {
      setLoading(true);
      const now = new Date();
      let startDate = new Date();

      // Set date range based on period
      switch (period) {
        case "weekly":
          startDate.setDate(now.getDate() - 7);
          break;
        case "monthly":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "yearly":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      try {
        const q = query(
          collection(db, "timeEntries"),
          where("timestamp", ">=", Timestamp.fromDate(startDate)),
          where("userId", "==", "currentUserId")
        );

        const querySnapshot = await getDocs(q);
        const entries = querySnapshot.docs.map((doc) => doc.data());

        if (entries.length === 0) {
          setChartData(generateSkeletonData(period));
        } else {
          // Your existing aggregation logic
          const aggregatedData = entries.reduce((acc, entry) => {
            const date = entry.timestamp.toDate();
            const dateKey =
              period === "weekly"
                ? date.getDay() === 0
                  ? 6
                  : date.getDay() - 1 // Convert Sunday (0) to 6, and others to 0-5
                : period === "monthly"
                ? date.getDate() - 1
                : date.getMonth();

            if (!acc[dateKey]) {
              acc[dateKey] = {
                name: dateKey.toString(),
                label:
                  period === "weekly"
                    ? WEEKDAYS[dateKey]
                    : period === "monthly"
                    ? (dateKey + 1).toString()
                    : (dateKey + 1).toString(),
                total: 0,
              };
            }
            acc[dateKey].total += entry.duration || 0;
            return acc;
          }, {} as Record<string, TimeData>);

          // Fill in missing days with zero values
          const filledData = [
            ...Array(period === "weekly" ? 7 : period === "monthly" ? 31 : 12),
          ].map((_, index) => {
            return (
              aggregatedData[index] || {
                name: index.toString(),
                label:
                  period === "weekly"
                    ? WEEKDAYS[index]
                    : (index + 1).toString(),
                total: 0,
              }
            );
          });

          setChartData(filledData);
        }
      } catch (error) {
        console.error("Error fetching time data:", error);
        setChartData(generateSkeletonData(period));
      } finally {
        setLoading(false);
      }
    };

    fetchTimeData();
  }, [period]);

  return (
    <ResponsiveContainer height={350} width="100%">
      <BarChart data={chartData}>
        <XAxis
          dataKey="label"
          stroke="#3E1F04"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={10}
        />
        <YAxis
          stroke="#3E1F04"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          width={10}
          tickMargin={0}
          interval="preserveStartEnd"
        />
        <Bar
          dataKey="total"
          fill={loading ? "#E5E7EB" : "#F57C13"}
          width={10}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
