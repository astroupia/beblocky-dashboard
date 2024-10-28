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
  try {
    const [data, school, coursesResponse] = await Promise.all([
      getDashboardData(),
      getSchools(),
      fetch(COURSE_URL),
    ]);

    if (!data) {
      return redirect("/sign-in");
    }

    let courses: Course[] = [];
    if (coursesResponse.ok) {
      const json = await coursesResponse.json();
      courses = json.courses;
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
  } catch (error) {
    redirect("/sign-in");
  }
}
