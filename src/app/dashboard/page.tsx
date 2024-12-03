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
  // Check for cookies to determine if the user is authenticated
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    // If no session cookie, redirect to sign-in
    redirect("/sign-in");
  }

  try {
    const [data, school, coursesJson] = await Promise.all([
      getDashboardData(),
      getSchools(),
      fetch(COURSE_URL)
        .then((res) => (res.ok ? res.json() : { courses: [] }))
        .catch(() => ({ courses: [] })),
    ]);

    if (!data) {
      redirect("/sign-in");
    }

    const courses: Course[] = coursesJson.courses || [];

    return (
      <div>
        <SubscriptionModal />
        {data.role === "parent" ? (
          <ParentDashboard
            students={Array.isArray(data.student) ? data.student : []}
            courses={courses}
          />
        ) : data.role === "school" ? (
          <SchoolDashboard
            data={Array.isArray(school) ? school : []}
            courses={courses}
          />
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
  } catch (error) {
    console.error("Error fetching data:", error);
    redirect("/sign-in"); // Redirect on error
  }
}
