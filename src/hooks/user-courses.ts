import { COURSE_URL } from "@/lib/constant";
import { useEffect, useState } from "react";

export interface Slide {
  _id: string;
  backgroundColor: string;
  color: string;
  title: string;
  titleFont: string;
  content: string;
  contentFont: string;
  code: string;
  startingCode: string;
  image: string;
  solution: string;
}

export interface Course {
  _id: number;
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  slides: Slide[];
  lessons: {
    lessonId: number;
    lessonTitle: string;
    lessonDescription: string;
    lessonLanguage: string;
    slides: Slide[];
    _id: string;
  }[];
  subType: string;
}

function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");


  useEffect(() => {
    setLoading(true);
    fetch(COURSE_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setLoading(false);
        setCourses(data.courses);
      })
      .catch((_) => {
        console.log(_)
        setLoading(false);
        setError(
          "Sorry, we couldn't load our courses due to errors. Try again later."
        );
      });
  }, []);

  return { courses, isLoading, error };
}

export default useCourses;
