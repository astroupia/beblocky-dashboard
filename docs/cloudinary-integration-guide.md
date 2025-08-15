# Cloudinary Module

This module provides image and media upload functionality using Cloudinary's cloud storage service. It allows you to upload files directly to Cloudinary and receive secure URLs for accessing the uploaded media.

## 📋 Table of Contents

- [Features](#features)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Request/Response Formats](#requestresponse-formats)
- [Error Handling](#error-handling)
- [Configuration](#configuration)

## ✨ Features

- **File Upload**: Upload images and media files to Cloudinary
- **Buffer Upload**: Upload file buffers with custom folder organization
- **Automatic Resource Detection**: Automatically detects file type (image, video, etc.)
- **Secure URLs**: Returns HTTPS URLs for uploaded media
- **Folder Organization**: Support for organizing uploads in folders

## 🔧 Setup

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Module Import

Import the CloudinaryModule in your app module:

```typescript
import { CloudinaryModule } from "./cloudinary/cloudinary.module";

@Module({
  imports: [
    // ... other imports
    CloudinaryModule,
  ],
})
export class AppModule {}
```

## 🌐 API Endpoints

### POST `/uploadMedia`

Upload a file to Cloudinary.

**Method**: `POST`  
**Content-Type**: `multipart/form-data`

#### Request Parameters

| Parameter | Type | Required | Description                             |
| --------- | ---- | -------- | --------------------------------------- |
| `file`    | File | Yes      | The file to upload (image, video, etc.) |

#### Response Format

**Success Response (200)**

```json
{
  "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/filename.jpg"
}
```

**Error Response (400/500)**

```json
{
  "message": "Upload failed",
  "statusCode": 400
}
```

## 📝 Usage Examples

### 1. Using cURL

```bash
curl -X POST http://localhost:8000/uploadMedia \
  -F "file=@/path/to/your/image.jpg"
```

### 2. Using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("http://localhost:8000/uploadMedia", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log("Uploaded URL:", result.url);
```

### 3. Using Axios

```javascript
import axios from "axios";

const formData = new FormData();
formData.append("file", file);

const response = await axios.post(
  "http://localhost:8000/uploadMedia",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

console.log("Uploaded URL:", response.data.url);
```

### 4. Using Postman/Insomnia

1. Set method to `POST`
2. Set URL to `http://localhost:8000/uploadMedia`
3. In Body tab, select `form-data`
4. Add key `file` with type `File`
5. Select your file and send request

## 🔄 Request/Response Formats

### Request Format

The endpoint expects a `multipart/form-data` request with a file field named `file`.

**Form Data Structure:**

```
file: [binary file data]
```

### Response Format

#### Success Response

```json
{
  "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/filename.jpg"
}
```

#### Error Response

```json
{
  "message": "Upload failed",
  "statusCode": 400
}
```

## ⚠️ Error Handling

The module handles various error scenarios:

1. **Missing File**: Returns 400 if no file is provided
2. **Invalid File**: Returns 400 for unsupported file types
3. **Cloudinary API Errors**: Returns 500 with error message
4. **Configuration Errors**: Returns 500 if Cloudinary credentials are missing

## ⚙️ Configuration

### Cloudinary Configuration

The service automatically configures Cloudinary using environment variables:

```typescript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

### Supported File Types

The module supports all file types that Cloudinary supports:

- **Images**: JPG, PNG, GIF, WebP, SVG, etc.
- **Videos**: MP4, MOV, AVI, etc.
- **Documents**: PDF, DOC, etc.
- **Audio**: MP3, WAV, etc.

## 🔧 Service Methods

### `uploadFile(file: Express.Multer.File)`

Uploads a file from a multipart form request.

**Parameters:**

- `file`: Express.Multer.File object

**Returns:** Promise<string> - Secure URL of uploaded file

### `uploadBuffer(buffer: Buffer, folder: string)`

Uploads a file buffer to a specific folder.

**Parameters:**

- `buffer`: File buffer data
- `folder`: Target folder name

**Returns:** Promise<string> - Secure URL of uploaded file

## 📁 File Organization

### Automatic Folder Structure

When using `uploadBuffer`, files are organized in Cloudinary folders:

```
cloudinary://your-cloud-name/folder-name/filename.jpg
```

### URL Structure

Uploaded files follow this URL pattern:

```
https://res.cloudinary.com/your-cloud-name/resource-type/upload/v[version]/[path]/filename.ext
```

## 🚀 Advanced Usage

### Using the Service in Other Modules

```typescript
import { CloudinaryService } from "./cloudinary/services/cloudinary.service";

@Injectable()
export class YourService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadProfilePicture(file: Express.Multer.File) {
    const url = await this.cloudinaryService.uploadFile(file);
    return { profilePictureUrl: url };
  }

  async uploadToFolder(buffer: Buffer, folder: string) {
    const url = await this.cloudinaryService.uploadBuffer(buffer, folder);
    return { uploadedUrl: url };
  }
}
```

### Custom Upload Options

You can extend the service to add custom upload options:

```typescript
async uploadWithOptions(file: Express.Multer.File, options: any) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'auto',
          ...options, // Custom options like transformation, folder, etc.
        },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          return resolve(result?.secure_url);
        },
      )
      .end(file.buffer);
  });
}
```

## 🔒 Security Considerations

1. **File Size Limits**: Consider implementing file size validation
2. **File Type Validation**: Validate file types before upload
3. **Rate Limiting**: Implement rate limiting for upload endpoints
4. **Authentication**: Add authentication to upload endpoints in production

## 📊 Monitoring

Monitor upload success/failure rates and file sizes:

```typescript
// Add logging to track uploads
async uploadFile(file: Express.Multer.File): Promise<any> {
  console.log(`Uploading file: ${file.originalname}, size: ${file.size} bytes`);

  try {
    const result = await // ... upload logic
    console.log(`Upload successful: ${result}`);
    return result;
  } catch (error) {
    console.error(`Upload failed: ${error.message}`);
    throw error;
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Upload failed" error**

   - Check Cloudinary credentials in environment variables
   - Verify file is not corrupted
   - Check file size limits

2. **"Missing file" error**

   - Ensure form field is named `file`
   - Check Content-Type is `multipart/form-data`

3. **CORS issues**
   - Configure CORS in your NestJS app
   - Check browser console for CORS errors

### Debug Mode

Enable debug logging by setting environment variable:

```env
DEBUG=cloudinary:*
```

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [Multer Documentation](https://github.com/expressjs/multer)
