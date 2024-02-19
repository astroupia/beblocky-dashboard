import { Course } from "@/hooks/user-courses";
import { CourseCard } from "./course-card";
import { PageHeader } from "./page-header";


export function StudentDashboard({ courses }: { courses: Course[] }) {

    return (
        <div>
            <PageHeader />
            <div className="flex flex-col py-4 gap-2">
                <h3 className=" text-3xl font-bold">
                    Your Courses
                </h3>
                <p className=" text-sm">
                    Course you're enrolled to
                </p>
                <div className="md:flex-row flex flex-col items-start gap-4">
                    {courses.map(course => (
                        <CourseCard course={course} progress />
                    ))}
                </div>
            </div>
        </div>
    )
}