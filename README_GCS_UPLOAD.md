# Google Cloud Storage Direct Upload Implementation

This implementation allows your application to upload images directly to the Google Cloud Storage "ens_images" bucket using the official Google Cloud Storage client library.

## How It Works

1. **Frontend**: User selects an image file in the Evacuation Center form
2. **Frontend → Backend**: Image file is sent to a Laravel backend endpoint
3. **Backend**: Uses Google Cloud Storage client library to upload the image to GCS
4. **Backend → Frontend**: Returns the public URL of the uploaded image
5. **Frontend → Backend**: Save evacuation center with the image URL

## Implementation Files

1. **Frontend Service**: `src/services/gcs-upload.service.ts`

   - Handles preparation and sending of files to the backend
   - Manages unique filename generation with UUID
   - Returns the public URL of the uploaded file

2. **EvacuationCenterAddDialog**: `src/components/ui/EvacuationCenterAddDialog.tsx`

   - Uses the GcsUploadService to upload files
   - Displays preview and upload progress
   - Associates the image URL with the evacuation center data

3. **Backend Implementation**: Outlined in `BACKEND_IMPLEMENTATION.md`
   - StorageController with uploadToGcs method
   - Uses the google/cloud-storage PHP library
   - Handles file validation and upload to GCS

## Advantages of this Approach

1. **Reliable Uploads**: Files go through your trusted backend server
2. **Server-Side Validation**: Robust validation of files before uploading
3. **Credential Security**: GCS credentials never exposed to the client
4. **Simple Implementation**: No need for complex client-side libraries
5. **Progress Tracking**: Backend can implement upload progress tracking
6. **Flexible Processing**: Can perform image processing before upload (resize, compress, etc.)

## Backend Requirements

Your Laravel backend needs:

1. **Google Cloud Storage Client Library**: `composer require google/cloud-storage`
2. **Service Account Key**: Stored at `storage/app/google-cloud-key.json`
3. **Controller Implementation**: See BACKEND_IMPLEMENTATION.md for details
4. **Route Configuration**: POST endpoint at `/web/uploadToGcs`

## Sample Usage

```typescript
// Example usage in a component
const handleUpload = async (file) => {
  try {
    const imageUrl = await GcsUploadService.uploadFile(file);
    console.log("Uploaded image URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

## Google Cloud Storage Client Library vs. Signed URLs

This implementation uses the Google Cloud Storage client library on the backend instead of signed URLs. Benefits include:

1. **Server Control**: Your server has complete control over the upload process
2. **Simplified Frontend**: Frontend doesn't need to handle complex upload logic
3. **Reduced Security Concerns**: No exposure of signed URLs that could be misused
4. **Better Error Handling**: Server can provide detailed error messages
5. **Metadata Control**: Server can add, modify, and validate metadata

## Configuration and Security

1. **Bucket Configuration**: The "ens_images" bucket should be properly configured with access controls
2. **Service Account**: The service account should have Storage Object Creator permissions at minimum
3. **File Validation**: The backend enforces file size and type validation
4. **Success Monitoring**: Both frontend and backend log success/failure of uploads

For detailed backend implementation, see `BACKEND_IMPLEMENTATION.md`.
