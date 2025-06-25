# Slide Creation with Images - Complete Guide

## Overview

This guide explains how to create slides with image uploads using the Cloudinary-powered API. The API expects a `multipart/form-data` request format.

## API Endpoint

```
POST /api/slides
```

## Request Format

The API expects a `multipart/form-data` request with two parts:

- `uploadImage`: The image file(s) (can be multiple)
- `data`: A JSON string containing all the slide data

## Required Fields for Slide Creation

### Required Fields:

- `title`: string - The slide title
- `order`: number - Slide order (minimum 0)
- `courseId`: string - MongoDB ObjectId of the course
- `lessonId`: string - MongoDB ObjectId of the lesson (optional)

### Optional Fields:

- `content`: string - Slide content text
- `titleFont`: string - Font for title (defaults to 'Arial')
- `contentFont`: string - Font for content
- `startingCode`: string - Initial code for coding slides
- `solutionCode`: string - Solution code for coding slides
- `backgroundColor`: string - Background color (defaults to '#FFFFFF')
- `textColor`: string - Text color (defaults to '#000000')
- `themeColors`: object - Theme colors with main, secondary, and accent properties
- `videoUrl`: string - Video URL for video slides

## Frontend Implementation

### Using the Slide API Utility

```typescript
import { createSlideWithImages, type CreateSlideData } from "@/lib/slide-api";

// Example slide data
const slideData: CreateSlideData = {
  title: "Introduction to Programming",
  content: "Learn the basics of programming with this interactive slide",
  order: 1,
  courseId: "507f1f77bcf86cd799439011",
  lessonId: "507f1f77bcf86cd799439012",
  backgroundColor: "#FFFFFF",
  textColor: "#000000",
  themeColors: {
    main: "#3b82f6",
    secondary: "#64748b",
    accent: "#007BFF",
  },
};

// Image files from file input
const imageFiles = [
  /* File objects from input */
];

try {
  const result = await createSlideWithImages(slideData, imageFiles);
  console.log("Slide created:", result);
} catch (error) {
  console.error("Error creating slide:", error);
}
```

### Manual Implementation with Fetch

```typescript
async function createSlideWithImage(slideData, imageFiles) {
  const formData = new FormData();

  // Add image files
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append("uploadImage", file);
    });
  }

  // Add slide data as JSON string
  formData.append("data", JSON.stringify(slideData));

  const response = await fetch("/api/slides", {
    method: "POST",
    body: formData,
    credentials: "include",
    // Don't set Content-Type header - browser will set it automatically for FormData
  });

  if (!response.ok) {
    throw new Error(`Failed to create slide: ${response.status}`);
  }

  return await response.json();
}
```

## Image Requirements

### Supported Formats:

- JPEG, PNG, GIF, WebP, and other formats supported by Cloudinary
- File size: Cloudinary handles large files, but consider reasonable limits (10MB per file recommended)
- Multiple images: You can upload multiple images at once

### File Input Example:

```typescript
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const fileArray = Array.from(files);
  setSelectedFiles((prev) => [...prev, ...fileArray]);

  // Create preview URLs for immediate display
  const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
  setUploadedImages((prev) => [...prev, ...previewUrls]);
};
```

## Response Format

The API returns the created slide with:

- All the slide data you provided
- `imageUrls`: Array of Cloudinary URLs for the uploaded images
- `_id`: The MongoDB ID of the created slide
- `createdAt` and `updatedAt`: Timestamps

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Introduction to Programming",
  "content": "Learn the basics of programming",
  "order": 1,
  "courseId": "507f1f77bcf86cd799439011",
  "lessonId": "507f1f77bcf86cd799439012",
  "imageUrls": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/slide1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/slide2.png"
  ],
  "backgroundColor": "#FFFFFF",
  "textColor": "#000000",
  "themeColors": {
    "main": "#3b82f6",
    "secondary": "#64748b",
    "accent": "#007BFF"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

### Common Errors:

- **400 Bad Request**: Invalid slide data or missing required fields
- **404 Not Found**: Course or lesson ID doesn't exist
- **413 Payload Too Large**: Image files too large
- **415 Unsupported Media Type**: Unsupported image format

### Error Response Format:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

## Validation

### Frontend Validation:

```typescript
const validateSlideData = (slideData: CreateSlideData, imageFiles: File[]) => {
  const errors: string[] = [];

  if (!slideData.title.trim()) {
    errors.push("Slide title is required");
  }

  if (slideData.order < 0) {
    errors.push("Slide order must be at least 0");
  }

  if (!slideData.courseId) {
    errors.push("Course ID is required");
  }

  if (
    !slideData.content?.trim() &&
    !slideData.startingCode?.trim() &&
    imageFiles.length === 0
  ) {
    errors.push("Slide must have content, code, or images");
  }

  return errors;
};
```

## Important Notes

1. **Course and Lesson Validation**: The API validates that the provided `courseId` and `lessonId` exist before creating the slide
2. **Image Processing**: Images are automatically uploaded to Cloudinary and the URLs are stored in the `imageUrls` array
3. **Default Values**: If you don't provide optional fields, sensible defaults are applied
4. **Memory Management**: Remember to revoke object URLs when removing images to prevent memory leaks
5. **File Input**: Use `accept="image/*"` and `multiple` attributes for better UX

## Complete Example Component

```typescript
import { useState } from 'react';
import { createSlideWithImages, type CreateSlideData } from '@/lib/slide-api';

export function SlideCreator({ courseId, lessonId, onComplete }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [order, setOrder] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const slideData: CreateSlideData = {
        title,
        content,
        order,
        courseId,
        lessonId,
        backgroundColor: "#FFFFFF",
        textColor: "#000000"
      };

      const result = await createSlideWithImages(slideData, selectedFiles);
      onComplete(result);
    } catch (error) {
      console.error('Error creating slide:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Slide title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Slide content"
      />
      <input
        type="number"
        value={order}
        onChange={(e) => setOrder(parseInt(e.target.value))}
        min="0"
        required
      />
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Slide'}
      </button>
    </form>
  );
}
```

This guide provides everything you need to create slides with images using the Cloudinary-powered API!
