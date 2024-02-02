"use client"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"



export const CourseButton = ({ course_id }: { course_id: number }) => {
    const router = useRouter()
    return (
        <div role="button" className="rounded-full p-1 bg-gray-100 ml-auto" onClick={() => {
            router.push(`/ide/${course_id}`)
        }}>
            <ArrowRight size={24} className="text-ecstasy" />
        </div>
    )
}