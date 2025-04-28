# Backend Implementation for Direct Google Cloud Storage Uploads

This document outlines the necessary changes required on your Laravel backend to enable direct uploads to Google Cloud Storage using the official client library.

## 1. Install Required Dependencies

```bash
composer require google/cloud-storage
```

## 2. Create the Storage Controller

Create a new controller file at `app/Http/Controllers/StorageController.php`:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Cloud\Storage\StorageClient;
use Illuminate\Support\Facades\Validator;

class StorageController extends Controller
{
    /**
     * Upload a file directly to Google Cloud Storage
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadToGcs(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // Max 10MB
            'filename' => 'required|string',
            'contentType' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            // Initialize Google Cloud Storage client
            $storage = new StorageClient([
                'keyFilePath' => storage_path('app/google-cloud-key.json')
            ]);

            $bucketName = 'ens_images';
            $bucket = $storage->bucket($bucketName);

            // Create a unique object name in the bucket
            $objectName = 'uploads/' . date('Y/m/d') . '/' . $request->filename;

            // Get the file content
            $fileContents = file_get_contents($request->file('file')->getRealPath());

            // Upload the file to Google Cloud Storage
            $object = $bucket->upload($fileContents, [
                'name' => $objectName,
                'predefinedAcl' => 'publicRead',
                'metadata' => [
                    'contentType' => $request->contentType,
                    'cacheControl' => 'public, max-age=31536000'
                ]
            ]);

            return response()->json([
                'objectName' => $objectName,
                'url' => "https://storage.googleapis.com/{$bucketName}/{$objectName}",
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
```

## 3. Add the Route

Update your `routes/web.php` file to include the new endpoint:

```php
use App\Http\Controllers\StorageController;

// Add this route for direct uploads to Google Cloud Storage
Route::post('/web/uploadToGcs', [StorageController::class, 'uploadToGcs']);
```

## 4. Set Up Google Cloud Service Account Key

1. Create a service account with Storage Admin permissions in the Google Cloud Console
2. Download the service account key JSON file
3. Create the directory `storage/app` if it doesn't exist
4. Store the key file at `storage/app/google-cloud-key.json`
5. Ensure the file has appropriate permissions:

```bash
chmod 600 storage/app/google-cloud-key.json
```

## 5. Configure Your GCS Bucket

1. Go to Google Cloud Console
2. Navigate to Cloud Storage > Buckets
3. Select your "ens_images" bucket
4. Go to the "Permissions" tab
5. Make sure your service account has the "Storage Object Creator" role at minimum
6. Consider setting up a uniform bucket-level access for better security

## 6. Update Evacuation Center Controller

When you receive an image URL from the frontend, update your evacuation center controller to save this URL to the database:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
        'description' => 'required|string',
        'descriptionImage' => 'nullable|string|url'
    ]);

    $evacuationCenter = EvacuationCenter::create($validated);

    return response()->json([
        'message' => 'Evacuation center created successfully',
        'data' => $evacuationCenter
    ], 201);
}
```

## 7. Increase PHP Upload Limits (Optional)

If you need to handle larger files, update your PHP configuration:

```
# php.ini
upload_max_filesize = 20M
post_max_size = 20M
```

## Testing

To test this implementation:

1. Ensure your backend is running and accessible
2. Try to upload an image via the frontend
3. Check the browser console for any errors during the upload process
4. Verify that the image appears in your Google Cloud Storage bucket
5. Confirm that the evacuation center is created with the correct image URL
