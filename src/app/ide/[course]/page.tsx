import IdePage from "@/components/ide/ide-page";
import { TimeTracker } from "@/components/time-tracker";
import { Course, Slide } from "@/hooks/user-courses";
import { COURSE_URL } from "@/lib/constant";
import { auth } from "@/lib/firebase/firebase-admin";
import { cookies } from "next/headers";

export default async function page({ params }: { params: { course: string } }) {
  // Get the session token from cookies
  const session = cookies().get("session")?.value;
  let userId = "";

  if (session) {
    // Verify the session and get user ID
    const decodedClaims = await auth().verifySessionCookie(session);
    userId = decodedClaims.uid;
  }

  try {
    const response = await fetch(COURSE_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const coursesJson = await response.json();
    const courses: Course[] = coursesJson.courses || [];

    console.log(courses);

    const course = courses.find((c) => c._id.toString() === params.course);
    const slides: Slide[] = course?.slides ?? [];
    course?.lessons.map((d) => slides.push(...d.slides));

    if (!slides.length) {
      return null;
    }

    console.log(slides);

    return (
      <>
        {userId && <TimeTracker userId={userId} />}
        <IdePage slides={slides} courseId={course?._id ?? 0} />
      </>
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return <div>Error loading courses. Please try again later.</div>;
  }
}
