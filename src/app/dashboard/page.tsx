import { useEffect, useState } from "react";
import { getDashboardData } from "@/actions/parents";
import { getSchools } from "@/actions/schools";
import { SubscriptionModal } from "@/components/dialogs/subscribtion-modal";
import { ParentDashboard } from "@/components/parent-dashboard";
import { SchoolDashboard } from "@/components/school-dashboard";
import { StudentDashboard } from "@/components/student-dashboard";
import { Course } from "@/hooks/user-courses";
import { COURSE_URL } from "@/lib/constant";
import { redirect } from "next/navigation";
import { Student, Classroom } from "@/types";

// Define types for your data
type DashboardData =
  | { role: "parent"; student: Student[]; classroom?: undefined }
  | { role: "school"; student?: undefined; classroom?: undefined }
  | { role: "student"; student: Student; classroom: Classroom };

type SchoolData = {
  classRoom: Classroom;
  students: Student[];
}[];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, schoolData, coursesResponse] = await Promise.all([
          getDashboardData(),
          getSchools(),
          fetch(COURSE_URL),
        ]);

        if (!dashboardData) {
          redirect("/sign-in");
          return;
        }
        setData(dashboardData);
        setSchool(schoolData as SchoolData);

        if (coursesResponse.ok) {
          const json = await coursesResponse.json();
          setCourses(json.courses);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : String(err));
        redirect("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state
  }

  if (error) {
    return <div>Error loading dashboard. Please try again later.</div>; // Handle errors
  }

  if (!data) {
    return <div>No data available.</div>; // Handle case where data is null
  }

  return (
    <div>
      <SubscriptionModal />
      {data.role === "parent" ? (
        <ParentDashboard students={data.student ?? []} courses={courses} />
      ) : data.role === "school" ? (
        <SchoolDashboard data={school ?? []} courses={courses} />
      ) : (
        <StudentDashboard
          courses={courses.filter(
            (course) =>
              data.classroom?.courses.includes(course._id.toString()) ||
              (Array.isArray(data.student) &&
                data.student.some(
                  (student) =>
                    Array.isArray(student.courses) &&
                    student.courses.includes(course._id.toString())
                ))
          )}
        />
      )}
    </div>
  );
}
