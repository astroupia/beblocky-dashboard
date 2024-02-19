import { getDashboardData } from "@/actions/parents";
import { getSchools } from "@/actions/schools";
import { PageHeader } from "@/components/page-header";
import { Student } from "@/types";
import { redirect } from "next/navigation";
import { ProgressTabs } from "./client";

export default async function page() {
  const data = await getDashboardData();
  const school = await getSchools();
  let students: Student[] = [];
  if (data?.role === "student") {
    return redirect(`/dashboard/progress/${data.student.userId}`);
  }
  return (
    <div>
      <PageHeader />
      <div className=" my-4">
        <ProgressTabs
          data={
            data?.role === "parent"
              ? data?.student
              : students.concat(...school!.map((d) => d.students))
          }
        />
      </div>
    </div>
  );
}
