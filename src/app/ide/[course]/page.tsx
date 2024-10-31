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

  const courses = await fetch(COURSE_URL)
    .then(async (res) => await res.json())
    .then((res) => res.courses as Course[]);
  const course = courses?.find((c) => c._id.toString() === params.course);
  const slides: Slide[] = course?.slides ?? [];
  course?.lessons.map((d) => slides.push(...d.slides));

  if (!slides.length) {
    return null;
  }

  return (
    <>
      {userId && <TimeTracker userId={userId} />}
      <IdePage slides={slides} courseId={course?._id ?? 0} />
    </>
  );
}
