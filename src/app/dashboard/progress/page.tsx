import { getDashboardData } from "@/actions/parents";
import { getSchools } from "@/actions/schools";
import { PageHeader } from "@/components/page-header";
import { Student } from "@/types";
import { redirect } from "next/navigation";
import { ProgressTabs } from "./client";
import { cookies } from "next/headers";

export default async function Page() {
  try {
    const [data, schools] = await Promise.all([
      getDashboardData(),
      getSchools(),
    ]);

    if (!data) {
      redirect("/sign-in");
    }

    // Handle student role redirect
    if (data?.role === "student" && data.student) {
      redirect(`/dashboard/progress/${data.student.userId}`);
    }

    // Prepare students data
    const students =
      data?.role === "parent"
        ? data?.student ?? []
        : schools?.flatMap((school) => school.students ?? []) ?? [];

    return (
      <div>
        <PageHeader />
        <div className="my-4">
          <ProgressTabs data={students} />
        </div>
      </div>
    );
  } catch (error) {
    redirect("/sign-in");
  }
}
