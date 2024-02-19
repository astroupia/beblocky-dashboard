import { getDashboardData } from "@/actions/parents";
import { getSchools } from "@/actions/schools";
import { SubscriptionModal } from "@/components/dialogs/subscribtion-modal";
import { ParentDashboard } from "@/components/parent-dashboard";
import { SchoolDashboard } from "@/components/school-dashboard";
import { StudentDashboard } from "@/components/student-dashboard";
import { Course } from "@/hooks/user-courses";
import { COURSE_URL } from "@/lib/constant";
import { redirect } from "next/navigation";

export default async function page() {
  const data = await getDashboardData();
  const school = await getSchools();
  if (!data) {
    return redirect("/");
  }
  const courses = await fetch(
    COURSE_URL
  )
    .then(async (res) => (await res.json()) as { courses: Course[] })
    .then((res) => res.courses);
  return (
    <div>
      <SubscriptionModal />
      {data.role === "parent" ? (
        <ParentDashboard students={data.student} courses={courses ?? []} />
      ) : data.role === "school" ? (
        <SchoolDashboard data={school ?? []} courses={courses ?? []} />
      ) : (
        <StudentDashboard courses={courses.filter((course) => data.classroom?.courses.includes(course._id.toString()))
          .concat(
            courses.filter((course) =>
              data.student.courses?.includes(course._id.toString())
            )
          )} />
      )}
    </div>
  );
}
