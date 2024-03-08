import IdePage from "@/components/ide/ide-page";
import { Course, Slide } from "@/hooks/user-courses";
import { COURSE_URL } from "@/lib/constant";

export default async function page({ params }: { params: { course: string } }) {
    const courses = await fetch(COURSE_URL).then(async (res) => await res.json()).then(res => res.courses as Course[])
    const course = courses?.find(c => c._id.toString() === params.course)
    const slides: Slide[] = course?.slides ?? []
    course?.lessons.map(d => slides.push(...d.slides))
    if (!slides.length) {
        return null
    }
    return <IdePage slides={slides} courseId={course?._id ?? 0} />
}