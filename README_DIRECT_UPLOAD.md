# Direct Upload to Google Cloud Storage

This solution implements direct uploads from your frontend to Google Cloud Storage, bypassing the Laravel backend for file transfer while still updating your database.

## How It Works

1. **Frontend**: User selects an image file
2. **Frontend → Backend**: Request a signed URL
3. **Backend**: Generates signed URL for direct upload
4. **Frontend → GCS**: Upload file directly to Google Cloud Storage
5. **Frontend → Backend**: Save evacuation center with the image URL
6. **Backend**: Record is stored in database

## Advantages

- **Reduced Server Load**: Files don't pass through your Laravel backend
- **Faster Uploads**: Direct browser-to-GCS connection
- **Reduced Bandwidth Costs**: Your backend server doesn't process large files
- **Scalability**: Better handling of concurrent uploads

## Implementation Overview

### Frontend Changes

1. Added `gcs-upload.service.ts` for handling direct uploads
2. Modified `EvacuationCenterAddDialog.tsx` to use the new service
3. Added UUID generation for unique filenames

### Backend Changes (Required)

See `BACKEND_IMPLEMENTATION.md` for detailed instructions on implementing:

1. A controller for generating signed URLs
2. Configuration for Google Cloud Storage authentication
3. CORS settings for your bucket

## Current Workflow vs New Workflow

**Current Workflow**:

- Frontend uploads file to backend
- Backend uploads to Google Cloud Storage
- Backend returns URL
- Frontend saves record with URL

**New Workflow**:

- Frontend requests signed URL from backend
- Frontend uploads directly to Google Cloud Storage
- Frontend saves record with URL

## Security Considerations

- Signed URLs expire after 15 minutes
- Backend still controls what files can be uploaded (type, size validation)
- No GCS credentials are exposed in the frontend
- CORS settings limit which domains can upload files
