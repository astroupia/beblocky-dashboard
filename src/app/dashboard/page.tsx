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

  let courses: Course[] = [];
  try {
    const response = await fetch(COURSE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    courses = json.courses; // Assuming the response has a 'courses' field
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    // Handle the error as needed, e.g., set courses to an empty array or show a message
  }

  return (
    <div>
      <SubscriptionModal />
      {data.role === "parent" ? (
        <ParentDashboard students={data.student} courses={courses ?? []} />
      ) : data.role === "school" ? (
        <SchoolDashboard data={school ?? []} courses={courses ?? []} />
      ) : (
        <StudentDashboard
          courses={courses
            .filter((course) =>
              data.classroom?.courses.includes(course._id.toString())
            )
            .concat(
              courses.filter((course) =>
                data.student.courses?.includes(course._id.toString())
              )
            )}
        />
      )}
    </div>
  );
}
