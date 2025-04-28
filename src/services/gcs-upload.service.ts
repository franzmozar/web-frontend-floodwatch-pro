import { v4 as uuidv4 } from 'uuid';
import FloodWatchApiService from './floodwatch-api.service';

/**
 * Service for handling direct uploads to Google Cloud Storage
 */
const GcsUploadService = {
  /**
   * Uploads a file directly to Google Cloud Storage
   * 
   * @param file The file to upload
   * @returns Promise with the public URL of the uploaded file
   */
  uploadFile: async (file: File): Promise<string> => {
    try {
      console.log('Starting GCS upload process');
      
      // Generate a unique filename with original extension
      const fileExtension = file.name.split('.').pop();
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      
      // Convert File object to ArrayBuffer for upload
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      
      // Prepare the upload request to the backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', uniqueFilename);
      formData.append('contentType', file.type);
      
      console.log(`Sending file to backend for direct upload to GCS`);
      
      // The backend will use the Google Cloud Storage client library to upload the file
      const response = await FloodWatchApiService.postFile<{url: string, objectName: string}>(
        '/web/uploadToGcs',
        formData
      );
      
      if (!response || !response.data || !response.data.objectName) {
        throw new Error('Failed to upload file to Google Cloud Storage');
      }
      
      // Construct the public URL
      const publicUrl = `https://storage.googleapis.com/ens_images/${response.data.objectName}`;
      console.log('File uploaded successfully to GCS. Public URL:', publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('GCS upload failed:', error);
      throw error;
    }
  }
};

export default GcsUploadService; 