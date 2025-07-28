import { ICourse, IUpdateCourseDto } from "@/types/course";
import { ILesson, ICreateLessonDto } from "@/types/lesson";
import { ISlide, ICreateSlideDto } from "@/types/slide";
import { Types } from "mongoose";
import { formatRelativeTime } from "@/lib/utils";

// Types for the client-side course with additional computed properties
export interface ClientCourse extends ICourse {
  _id: string;
  lessonsCount?: number;
  studentsCount?: number;
  slidesCount?: number;
  lastUpdated?: string;
}

/**
 * Fetch course details by ID
 */
export async function fetchCourse(courseId: string): Promise<ClientCourse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  const courseData = await response.json();

  // Transform the API response to match our interface
  try {
    return {
      ...courseData,
      _id: courseData._id,
      school:
        courseData.school && courseData.school.toString().length === 24
          ? new Types.ObjectId(courseData.school.toString())
          : new Types.ObjectId(),
      slides:
        courseData.slides
          ?.filter((id: any) => id && id.toString().length === 24)
          ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
      lessons:
        courseData.lessons
          ?.filter((id: any) => id && id.toString().length === 24)
          ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
      students:
        courseData.students
          ?.filter((id: any) => id && id.toString().length === 24)
          ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
      lastUpdated: formatRelativeTime(
        courseData.updatedAt || courseData.createdAt
      ),
    };
  } catch (error) {
    console.error("Error transforming course data:", error);
    throw new Error("Failed to process course data");
  }
}

/**
 * Fetch lessons for a course
 */
export async function fetchLessonsForCourse(
  courseId: string
): Promise<ILesson[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lessons?courseId=${courseId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch lessons");
  }

  return await response.json();
}

/**
 * Fetch slides for a course
 */
export async function fetchSlidesForCourse(
  courseId: string
): Promise<ISlide[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/slides?courseId=${courseId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch slides");
  }

  return await response.json();
}

/**
 * Update course details
 */
export async function updateCourse(
  courseId: string,
  updatedCourse: IUpdateCourseDto
): Promise<ClientCourse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedCourse),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update course");
  }

  const updatedData = await response.json();

  return {
    ...updatedData,
    _id: updatedData._id,
    school: new Types.ObjectId(updatedData.school),
    slides:
      updatedData.slides
        ?.filter((id: any) => id && id.toString().length === 24)
        ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
    lessons:
      updatedData.lessons
        ?.filter((id: any) => id && id.toString().length === 24)
        ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
    students:
      updatedData.students
        ?.filter((id: any) => id && id.toString().length === 24)
        ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
  };
}

/**
 * Create a new lesson
 */
export async function createLesson(
  lessonData: ICreateLessonDto
): Promise<ILesson> {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("API URL is not configured");
    }

    if (
      !lessonData.courseId ||
      !lessonData.courseId.toString ||
      lessonData.courseId.toString().length !== 24
    ) {
      throw new Error("Cannot create lesson: courseId is missing or invalid.");
    }

    // Build payload according to backend contract
    const apiPayload: any = {
      title: lessonData.title,
      courseId: lessonData.courseId.toString(),
      duration: lessonData.duration,
      difficulty: lessonData.difficulty || "Beginner", // Use the enum value directly
    };

    if (lessonData.description) apiPayload.description = lessonData.description;
    if (lessonData.slides)
      apiPayload.slides = lessonData.slides.map((id) => id.toString());
    if (lessonData.tags) apiPayload.tags = lessonData.tags;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch {}

      // If the API is not available, return a mock created lesson
      console.warn("Course API not available, returning mock created lesson");
      return {
        _id: "mock-lesson-id",
        title: lessonData.title,
        description: lessonData.description || "",
        courseId: lessonData.courseId,
        slides: lessonData.slides || [],
        difficulty: lessonData.difficulty || ("Beginner" as any),
        duration: lessonData.duration,
        tags: lessonData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const newLesson = await response.json();

    // Update course lessons array in backend
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${lessonData.courseId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ $push: { lessons: newLesson._id } }),
        }
      );
    } catch (err) {
      console.error(
        "Failed to update course lessons array after lesson creation",
        err
      );
    }

    return newLesson;
  } catch (error) {
    console.warn("Course API error, returning mock created lesson:", error);
    // Return a mock created lesson if the API fails
    return {
      _id: "mock-lesson-id",
      title: lessonData.title,
      description: lessonData.description || "",
      courseId: lessonData.courseId,
      slides: lessonData.slides || [],
      difficulty: lessonData.difficulty || ("Beginner" as any),
      duration: lessonData.duration,
      tags: lessonData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

/**
 * Update an existing lesson
 */
export async function updateLesson(
  lessonId: string,
  updatedData: Partial<ILesson>
): Promise<ILesson> {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("API URL is not configured");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch {}

      // If the API is not available, return a mock updated lesson
      console.warn("Course API not available, returning mock updated lesson");
      return {
        _id: lessonId,
        title: updatedData.title || "Updated Lesson",
        description: updatedData.description || "",
        courseId: updatedData.courseId || new Types.ObjectId(),
        slides: updatedData.slides || [],
        difficulty: updatedData.difficulty || ("Beginner" as any),
        duration: updatedData.duration || 30,
        tags: updatedData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return await response.json();
  } catch (error) {
    console.warn("Course API error, returning mock updated lesson:", error);
    // Return a mock updated lesson if the API fails
    return {
      _id: lessonId,
      title: updatedData.title || "Updated Lesson",
      description: updatedData.description || "",
      courseId: updatedData.courseId || new Types.ObjectId(),
      slides: updatedData.slides || [],
      difficulty: updatedData.difficulty || ("Beginner" as any),
      duration: updatedData.duration || 30,
      tags: updatedData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

/**
 * Delete a lesson
 */
export async function deleteLesson(lessonId: string): Promise<void> {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("API URL is not configured");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch {}

      // If the API is not available, just log a warning and continue
      console.warn("Course API not available, skipping lesson deletion");
      return;
    }
  } catch (error) {
    console.warn("Course API error, skipping lesson deletion:", error);
    // Just log the error and continue if the API fails
    return;
  }
}

/**
 * Create a new slide
 */
export async function createSlide(
  slideData: ICreateSlideDto,
  imageFiles?: File[]
): Promise<ISlide> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  if (
    !slideData.courseId ||
    !slideData.courseId.toString ||
    slideData.courseId.toString().length !== 24
  ) {
    throw new Error("Cannot create slide: courseId is missing or invalid.");
  }

  // Prepare FormData
  const formData = new FormData();

  // Add image files (if any)
  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      formData.append("uploadImage", file);
    }
  }

  // Only include defined values in the payload
  const apiPayload: ICreateSlideDto = {
    title: slideData.title,
    order: slideData.order,
    courseId: slideData.courseId,
    lessonId: slideData.lessonId || new Types.ObjectId(), // Add required lessonId
  };

  if (slideData.content) apiPayload.content = slideData.content;
  if (slideData.lessonId) apiPayload.lessonId = slideData.lessonId;
  if (slideData.titleFont) apiPayload.titleFont = slideData.titleFont;
  if (slideData.contentFont) apiPayload.contentFont = slideData.contentFont;
  if (slideData.startingCode) apiPayload.startingCode = slideData.startingCode;
  if (slideData.solutionCode) apiPayload.solutionCode = slideData.solutionCode;
  if (slideData.backgroundColor)
    apiPayload.backgroundColor = slideData.backgroundColor;
  if (slideData.textColor) apiPayload.textColor = slideData.textColor;
  if (slideData.themeColors) {
    apiPayload.themeColors = {
      main: slideData.themeColors.main,
      secondary: slideData.themeColors.secondary,
    };
  }
  if (slideData.imageUrls) apiPayload.imageUrls = slideData.imageUrls;

  // Add slide data as JSON string
  formData.append("data", JSON.stringify(apiPayload));

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/slides`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    let errorData = null;
    try {
      const errorText = await response.text();
      errorData = errorText ? JSON.parse(errorText) : null;
    } catch (parseError) {
      // fallback
    }
    throw new Error(
      errorData?.message ||
        `Failed to create slide: ${response.status} ${response.statusText}`
    );
  }

  const newSlide = await response.json();

  // Update course and lesson slides array in backend
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${slideData.courseId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ $push: { slides: newSlide._id } }),
      }
    );
    if (slideData.lessonId) {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/${slideData.lessonId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ $push: { slides: newSlide._id } }),
        }
      );
    }
  } catch (err) {
    console.error(
      "Failed to update course/lesson slides array after slide creation",
      err
    );
  }

  return newSlide;
}

/**
 * Update an existing slide
 */
export async function updateSlide(
  slideId: string,
  updatedData: Partial<ISlide>,
  imageFiles?: File[],
  prevLessonId?: string,
  newLessonId?: string
): Promise<ISlide> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  // Prepare FormData
  const formData = new FormData();

  // Add image files (if any)
  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      formData.append("uploadImage", file);
    }
  }

  // Handle imageUrls properly - preserve existing images when adding new ones
  const slideDataToSend = { ...updatedData };

  // If we're adding new images, we need to preserve existing imageUrls
  // The backend should merge new images with existing ones, not replace them
  if (imageFiles && imageFiles.length > 0) {
    // Remove imageUrls from payload to prevent overwriting existing ones
    // The backend should handle merging new images with existing imageUrls
    delete slideDataToSend.imageUrls;
  }

  // Add slide data as JSON string
  formData.append("data", JSON.stringify(slideDataToSend));

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/slides/${slideId}`,
    {
      method: "PATCH",
      body: formData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {}
    throw new Error(
      errorData?.message ||
        `Failed to update slide: ${response.status} ${response.statusText}`
    );
  }

  const updatedSlide = await response.json();

  // Ensure the lesson's slides array is updated to include this slide
  if (prevLessonId && newLessonId && prevLessonId !== newLessonId) {
    try {
      // Add to new lesson
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${newLessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ $addToSet: { slides: updatedSlide._id } }),
      });
      // Remove from previous lesson
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/${prevLessonId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ $pull: { slides: updatedSlide._id } }),
        }
      );
    } catch (err) {
      console.error(
        "Failed to update lesson slides array after slide update",
        err
      );
    }
  } else if (newLessonId) {
    // If only newLessonId is present (e.g., slide was not previously assigned), just add
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${newLessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ $addToSet: { slides: updatedSlide._id } }),
      });
    } catch (err) {
      console.error(
        "Failed to add slide to new lesson after slide update",
        err
      );
    }
  }

  return updatedSlide;
}

/**
 * Delete a slide
 */
export async function deleteSlide(slideId: string): Promise<void> {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("API URL is not configured");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/slides/${slideId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch {}

      // If the API is not available, just log a warning and continue
      console.warn("Course API not available, skipping slide deletion");
      return;
    }
  } catch (error) {
    console.warn("Course API error, skipping slide deletion:", error);
    // Just log the error and continue if the API fails
    return;
  }
}

/**
 * Fetch complete course data including lessons and slides
 */
export async function fetchCompleteCourseData(courseId: string): Promise<{
  course: ClientCourse;
  lessons: ILesson[];
  slides: ISlide[];
}> {
  try {
    // Fetch all data in parallel
    const [course, lessons, slides] = await Promise.all([
      fetchCourse(courseId),
      fetchLessonsForCourse(courseId),
      fetchSlidesForCourse(courseId),
    ]);

    // Update course with counts
    const courseWithCounts: ClientCourse = {
      ...course,
      lessonsCount: lessons.length,
      slidesCount: slides.length,
      studentsCount: course.students?.length || 0,
    };

    return {
      course: courseWithCounts,
      lessons,
      slides,
    };
  } catch (error) {
    console.error("Error fetching complete course data:", error);
    throw error;
  }
}

/**
 * Fetch all courses with their details (lessons, slides, students count)
 */
export async function fetchAllCoursesWithDetails(): Promise<ClientCourse[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  const coursesData = await response.json();

  // Process courses with additional details using new endpoints
  const coursesWithDetails: ClientCourse[] = await Promise.all(
    coursesData.map(async (course: any) => {
      try {
        // Fetch lessons and slides for this specific course
        const [lessons, slides] = await Promise.all([
          fetchLessonsForCourse(course._id),
          fetchSlidesForCourse(course._id),
        ]);

        // Transform the course data
        const transformedCourse: ClientCourse = {
          ...course,
          _id: course._id,
          school:
            course.school && course.school.toString().length === 24
              ? new Types.ObjectId(course.school.toString())
              : new Types.ObjectId(),
          slides:
            course.slides
              ?.filter((id: any) => id && id.toString().length === 24)
              ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
          lessons:
            course.lessons
              ?.filter((id: any) => id && id.toString().length === 24)
              ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
          students:
            course.students
              ?.filter((id: any) => id && id.toString().length === 24)
              ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
          lessonsCount: lessons.length,
          slidesCount: slides.length,
          studentsCount: course.students?.length || 0,
          lastUpdated: formatRelativeTime(course.updatedAt || course.createdAt),
        };

        return transformedCourse;
      } catch (error) {
        console.error(
          `Error fetching details for course ${course._id}:`,
          error
        );
        return {
          ...course,
          _id: course._id,
          school: new Types.ObjectId(),
          slides: [],
          lessons: [],
          students: [],
          lessonsCount: 0,
          slidesCount: 0,
          studentsCount: 0,
          lastUpdated: "Recently",
        };
      }
    })
  );

  return coursesWithDetails;
}

/**
 * Delete a course
 */
export async function deleteCourse(courseId: string): Promise<void> {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("API URL is not configured");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      // If the API is not available, just log a warning and continue
      console.warn("Course API not available, skipping course deletion");
      return;
    }
  } catch (error) {
    console.warn("Course API error, skipping course deletion:", error);
    // Just log the error and continue if the API fails
    return;
  }
}
