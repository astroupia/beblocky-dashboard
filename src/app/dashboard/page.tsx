import { getDashboardData } from "@/actions/parents";
import { getSchools } from "@/actions/schools";
import { SubscriptionModal } from "@/components/dialogs/subscribtion-modal";
import { ParentDashboard } from "@/components/parent-dashboard";
import { SchoolDashboard } from "@/components/school-dashboard";
import { StudentDashboard } from "@/components/student-dashboard";
import { redirect } from "next/navigation";

export default async function page() {
  const data = await getDashboardData();
  const school = await getSchools();
  if (!data) {
    return redirect("/");
  }
  return (
    <div>
      <SubscriptionModal />
      {data.role === "parent" ? (
        <ParentDashboard students={data.student} />
      ) : data.role === "school" ? (
        <SchoolDashboard data={school ?? []} />
      ) : (
        <StudentDashboard courses={data.courses} />
      )}
    </div>
  );
}
