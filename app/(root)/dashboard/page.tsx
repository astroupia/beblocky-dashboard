import CourseDashboard from "@/components/courses/course-dashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import TeacherDashboard from "@/components/dashboard/teacher-dashboard";
import { getUserRole } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await auth();
  if (!user || !user.userId) return null;

  try {
    const userRole = await getUserRole(user.userId);
    return userRole === "admin" ? <AdminDashboard /> : <TeacherDashboard />;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return <div>Error fetching user role. Please try again later.</div>;
  }
}
