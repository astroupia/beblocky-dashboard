"use client";
import { AddChildModal } from "@/components/dialogs/add-child-modal";
import { EmptyPlaceholder } from "@/components/empty-placehoder";
import { StudentCard } from "@/components/student-card";
import useCourses from "@/hooks/user-courses";
import { Student } from "@/types";

interface props {
  data: Student[];
}
export const ProgressTabs = ({ data }: props) => {
  const courses = useCourses();
  return (
    <>
      {data?.length ? (
        <div className=" py-4 flex md:flex-row flex-col items-start gap-4">
          {data.map((student) => (
            <StudentCard
              key={student.userId}
              classrooms={[]}
              student={student}
              courses={courses.courses ?? []}
            />
          ))}
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="Student" />
          <EmptyPlaceholder.Title>
            No Children/Student Added
          </EmptyPlaceholder.Title>
          <AddChildModal studentsCount={data.length} />
        </EmptyPlaceholder>
      )}
    </>
  );
};
