import { ISlide } from "@/types/slide";

export interface CreateSlideData {
  title: string;
  content?: string;
  order: number;
  courseId: string;
  lessonId?: string;
  titleFont?: string;
  contentFont?: string;
  startingCode?: string;
  solutionCode?: string;
  backgroundColor?: string;
  textColor?: string;
  themeColors?: {
    main: string;
    secondary: string;
    accent?: string;
  };
  videoUrl?: string;
}

export interface UpdateSlideData extends Partial<CreateSlideData> {
  _id?: string;
}

/**
 * Create a slide with optional image uploads
 */
export async function createSlideWithImages(
  slideData: CreateSlideData,
  imageFiles?: File[]
): Promise<ISlide> {
  const formData = new FormData();

  // Add image files if provided
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append("uploadImage", file);
    });
  }

  // Add slide data as JSON string
  formData.append("data", JSON.stringify(slideData));

  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/slides`, {
    method: "POST",
    body: formData,
    credentials: "include",
    // Don't set Content-Type header - browser will set it automatically for FormData
  });

  if (!response.ok) {
    let errorData = null;
    try {
      const errorText = await response.text();
      console.error("Raw error response:", errorText);
      errorData = errorText ? JSON.parse(errorText) : null;
    } catch (parseError) {
      console.error("Error parsing error response:", parseError);
    }
    throw new Error(
      errorData?.message ||
        `Failed to create slide: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Update an existing slide
 */
export async function updateSlide(
  slideId: string,
  slideData: UpdateSlideData,
  imageFiles?: File[]
): Promise<ISlide> {
  const formData = new FormData();

  // Add image files if provided
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append("uploadImage", file);
    });
  }

  // Add slide data as JSON string (without _id since it's in the URL)
  const { _id, ...dataToSend } = slideData;
  formData.append("data", JSON.stringify(dataToSend));

  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/slides/${slideId}`,
    {
      method: "PUT",
      body: formData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    let errorData = null;
    try {
      const errorText = await response.text();
      console.error("Raw error response:", errorText);
      errorData = errorText ? JSON.parse(errorText) : null;
    } catch (parseError) {
      console.error("Error parsing error response:", parseError);
    }
    throw new Error(
      errorData?.message ||
        `Failed to update slide: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Delete a slide
 */
export async function deleteSlide(slideId: string): Promise<void> {
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
      const errorText = await response.text();
      errorData = errorText ? JSON.parse(errorText) : null;
    } catch (parseError) {
      console.error("Error parsing error response:", parseError);
    }
    throw new Error(
      errorData?.message ||
        `Failed to delete slide: ${response.status} ${response.statusText}`
    );
  }
}

/**
 * Get slides for a course
 */
export async function getSlidesForCourse(courseId: string): Promise<ISlide[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/slides?courseId=${courseId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    let errorData = null;
    try {
      const errorText = await response.text();
      errorData = errorText ? JSON.parse(errorText) : null;
    } catch (parseError) {
      console.error("Error parsing error response:", parseError);
    }
    throw new Error(
      errorData?.message ||
        `Failed to fetch slides: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Get slides for a lesson
 */
export async function getSlidesForLesson(lessonId: string): Promise<ISlide[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/slides?lessonId=${lessonId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    let errorData = null;
    try {
      const errorText = await response.text();
      errorData = errorText ? JSON.parse(errorText) : null;
    } catch (parseError) {
      console.error("Error parsing error response:", parseError);
    }
    throw new Error(
      errorData?.message ||
        `Failed to fetch slides: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}
