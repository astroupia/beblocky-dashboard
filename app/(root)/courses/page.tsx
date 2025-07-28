"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { teacherApi } from "@/lib/api/teacher";
import { userApi } from "@/lib/api/user";
import type { ITeacher } from "@/types/teacher";
import type { IUser } from "@/types/user";
import ModernCourseDashboard from "@/components/courses/modern-course-dashboard";
import { OrganizationRequirementMessage } from "@/components/courses/organization-requirement-message";

export default function CoursesPage() {
  const session = useSession();
  const [teacherData, setTeacherData] = useState<ITeacher | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOrganization, setHasOrganization] = useState(false);

  useEffect(() => {
    const checkUserAccess = async () => {
      console.log("Courses page - useEffect triggered");
      console.log("Courses page - Session data:", session.data);
      console.log("Courses page - Session user:", session.data?.user);

      if (!session.data?.user?.email) {
        console.log(
          "Courses page - No session user email, setting loading to false"
        );
        setIsLoading(false);
        return;
      }

      try {
        // Get user data
        const user = await userApi.getUserByEmail(session.data.user.email);
        console.log("Courses page - Retrieved user data:", user);
        setUserData(user);

        // Check if user is teacher or admin
        if (user.role === "teacher" || user.role === "admin") {
          try {
            // Use session user ID directly from better-auth
            const sessionUserId = session.data.user.id;
            console.log("Courses page - Session user ID:", sessionUserId);
            console.log("Courses page - Session user data:", session.data.user);

            const teacher = await teacherApi.getTeacherByUserId(
              sessionUserId,
              user
            );
            console.log("Courses page - Teacher data retrieved:", teacher);
            console.log(
              "Courses page - Teacher organizationId:",
              teacher.organizationId
            );
            console.log(
              "Courses page - Teacher organizationId type:",
              typeof teacher.organizationId
            );
            console.log(
              "Courses page - Teacher organizationId truthy check:",
              !!teacher.organizationId
            );

            // Check for different possible organization ID field names
            const possibleOrgFields = [
              "organizationId",
              "organization_id",
              "organization",
              "orgId",
              "org_id",
            ];
            const foundOrgField = possibleOrgFields.find(
              (field) => (teacher as any)[field]
            );
            console.log("Courses page - Possible org fields check:", {
              possibleFields: possibleOrgFields,
              foundField: foundOrgField,
              foundValue: foundOrgField
                ? (teacher as any)[foundOrgField]
                : null,
            });

            setTeacherData(teacher);

            // Check if teacher has organization - try multiple field names
            const hasOrg =
              !!teacher.organizationId ||
              !!(teacher as any).organization_id ||
              !!(teacher as any).organization ||
              !!(teacher as any).orgId ||
              !!(teacher as any).org_id;
            console.log(
              "Courses page - Has organization check result:",
              hasOrg
            );
            setHasOrganization(hasOrg);
          } catch (teacherError) {
            console.log("Teacher lookup error:", teacherError);

            // If teacher is not found (404), show organization requirement
            if (
              teacherError instanceof Error &&
              teacherError.message === "Teacher not found"
            ) {
              console.log(
                "Teacher not found - showing organization requirement"
              );
              setHasOrganization(false);
            } else {
              // For other errors, allow access to prevent blocking users
              console.error("Teacher API error:", teacherError);
              setHasOrganization(true);
            }
          }
        } else {
          // For non-teacher/admin users, allow access
          setHasOrganization(true);
        }
      } catch (error) {
        console.error("Error checking user access:", error);
        // On error, allow access to prevent blocking users
        setHasOrganization(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAccess();
  }, [session.data?.user?.email]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6 py-8 pt-24">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="ml-3 text-muted-foreground">
              Checking access...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show organization requirement message if user is teacher/admin without organization
  if (
    userData &&
    (userData.role === "teacher" || userData.role === "admin") &&
    !hasOrganization
  ) {
    return (
      <OrganizationRequirementMessage
        userRole={userData.role}
        organizationId={teacherData?.organizationId?.toString()}
      />
    );
  }

  // Show normal course dashboard for users with organization or non-teacher/admin users
  return <ModernCourseDashboard />;
}
