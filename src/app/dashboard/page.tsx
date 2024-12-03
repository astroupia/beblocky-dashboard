import { getDashboardData } from "@/actions/parents";
import { getSchools } from "@/actions/schools";
import { SubscriptionModal } from "@/components/dialogs/subscribtion-modal";
import { ParentDashboard } from "@/components/parent-dashboard";
import { SchoolDashboard } from "@/components/school-dashboard";
import { StudentDashboard } from "@/components/student-dashboard";
import { Course } from "@/hooks/user-courses";
import { COURSE_URL } from "@/lib/constant";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    redirect("/sign-in");
  }

  try {
    // Fetch all data concurrently
    const [dashboardData, schoolData, coursesResponse] = await Promise.all([
      getDashboardData(),
      getSchools(),
      fetch(COURSE_URL),
    ]);

    if (!dashboardData) {
      redirect("/sign-in");
    }

    // Check if the courses response is ok and parse JSON
    const coursesJson = coursesResponse.ok
      ? await coursesResponse.json().catch(() => ({ courses: [] }))
      : { courses: [] };
    const courses: Course[] = coursesJson.courses || [];

    return (
      <div>
        <SubscriptionModal />
        {dashboardData.role === "parent" ? (
          <ParentDashboard
            students={
              Array.isArray(dashboardData.student) ? dashboardData.student : []
            }
            courses={courses}
          />
        ) : dashboardData.role === "school" ? (
          <SchoolDashboard
            data={Array.isArray(schoolData) ? schoolData : []}
            courses={courses}
          />
        ) : (
          <StudentDashboard
            courses={courses.filter(
              (course) =>
                dashboardData.classroom?.courses.includes(
                  course._id.toString()
                ) ||
                (Array.isArray(dashboardData.student) &&
                  dashboardData.student.some(
                    (student) =>
                      Array.isArray(student.courses) &&
                      student.courses.includes(course._id.toString())
                  ))
            )}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    redirect("/sign-in");
  }
}
