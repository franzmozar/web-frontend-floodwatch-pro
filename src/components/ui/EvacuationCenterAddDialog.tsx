import React, { useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Dialog from './Dialog';
import { BuildingOfficeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import FloodWatchApiService from '../../services/floodwatch-api.service';
import { extractErrorMessage } from '../../utils/api-utils';
import GcsUploadService from '../../services/gcs-upload.service';

interface EvacuationCenterAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (data: {
    title: string;
    latitude: string;
    longitude: string;
    description: string;
    descriptionImage: string;
  }) => Promise<void>;
}

const EvacuationCenterAddDialog: React.FC<EvacuationCenterAddDialogProps> = ({ isOpen, onClose, onAdd }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    latitude: '',
    longitude: '',
    description: '',
    descriptionImage: ''
  });
  
  // Image preview state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  // Handle file upload to Google Cloud Storage
  const handleFileUpload = async () => {
    if (!selectedFile) return null;
    
    setIsUploading(true);
    setUploadError(null);
    
    console.log('DEBUG: Starting file upload process');
    console.log('DEBUG: File details:', {
      name: selectedFile.name,
      type: selectedFile.type,
      size: `${(selectedFile.size / 1024).toFixed(2)} KB`
    });
    
    try {
      // Use the GCS upload service
      const imageUrl = await GcsUploadService.uploadFile(selectedFile);
      console.log('DEBUG: Image uploaded successfully to GCS, URL:', imageUrl);
      
      return imageUrl;
    } catch (err) {
      const errorMsg = extractErrorMessage(err);
      console.error('DEBUG: Error uploading image:', err);
      console.error('DEBUG: Error details:', {
        message: errorMsg,
        originalError: err
      });
      setUploadError(errorMsg);
      return null;
    } finally {
      setIsUploading(false);
      console.log('DEBUG: File upload process completed');
    }
  };
  
  // Handle browsing for file
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle removing selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Upload the image first if selected
      let imageUrl = formData.descriptionImage;
      
      if (selectedFile) {
        const uploadedUrl = await handleFileUpload();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else if (uploadError) {
          // Don't proceed if upload failed
          return;
        }
      }
      
      if (onAdd) {
        const apiData = {
          title: formData.title,
          latitude: formData.latitude,
          longitude: formData.longitude,
          description: formData.description,
          descriptionImage: imageUrl || 'https://via.placeholder.com/640x360'
        };
        
        await onAdd(apiData);
      } else {
        console.log('Evacuation center data to be added:', {
          ...formData,
          descriptionImage: imageUrl
        });
        onClose();
      }
      
      // Reset form
      setFormData({
        id: '',
        title: '',
        latitude: '',
        longitude: '',
        description: '',
        descriptionImage: ''
      });
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate icon
  const addIcon = (
    <div className={`${isDark ? 'bg-green-900' : 'bg-green-100'} h-full w-full flex items-center justify-center rounded-full`}>
      <BuildingOfficeIcon className="h-7 w-7 text-green-500" aria-hidden="true" />
    </div>
  );

  // Generate action buttons
  const actionButtons = (
    <div className="flex space-x-3">
      <button
        type="button"
        className={`inline-flex justify-center rounded-md px-6 py-3 text-base font-semibold cursor-pointer shadow-sm transition-colors ${
          isDark 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
        }`}
        onClick={onClose}
        disabled={isSubmitting || isUploading}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="add-evacuation-center-form"
        className={`inline-flex justify-center rounded-md px-6 py-3 text-base font-semibold cursor-pointer shadow-sm transition-colors 
          bg-green-600 text-white hover:bg-green-700 ${(isSubmitting || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isSubmitting || isUploading}
      >
        {isSubmitting ? 'Adding...' : (isUploading ? 'Uploading...' : 'Add Center')}
      </button>
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Evacuation Center"
      icon={addIcon}
      actions={actionButtons}
      maxWidth="3xl"
    >
      <form id="add-evacuation-center-form" onSubmit={handleSubmit}>
        <div className={`${isDark ? 'text-gray-200' : 'text-gray-700'} space-y-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Field - for internal reference only */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium mb-2">
                ID (Internal Reference)
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  isDark 
                    ? 'bg-gray-800 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="EC001"
              />
            </div>

            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-md border ${
                  isDark 
                    ? 'bg-gray-800 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Evacuation Center Name"
              />
            </div>

            {/* Latitude Field */}
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium mb-2">
                Latitude
              </label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-md border ${
                  isDark 
                    ? 'bg-gray-800 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="9.7850"
              />
            </div>

            {/* Longitude Field */}
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium mb-2">
                Longitude
              </label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-md border ${
                  isDark 
                    ? 'bg-gray-800 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="125.4883"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Image Upload
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-50/50'}`}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="space-y-3">
                  <div className="relative aspect-video max-w-md mx-auto overflow-hidden rounded-lg">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm truncate max-w-xs">
                      {selectedFile?.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className={`text-sm px-3 py-1 rounded ${
                        isDark 
                          ? 'bg-red-900/50 text-red-400 hover:bg-red-900' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-6 cursor-pointer"
                  onClick={handleBrowseClick}
                >
                  <PhotoIcon className={`h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className="mt-2 text-sm font-medium">
                    Click to upload an image
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
            
            {uploadError && (
              <div className="mt-2 text-red-500 text-sm">
                {uploadError}
              </div>
            )}
            
            <div className="mt-3">
              <p className="text-sm font-medium mb-1">
                Or enter an image URL directly
              </p>
              <input
                type="text"
                id="descriptionImage"
                name="descriptionImage"
                value={formData.descriptionImage}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  isDark 
                    ? 'bg-gray-800 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="https://storage.googleapis.com/npx_ens_mobile_app_dev/example.jpg"
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Leave empty to use a default placeholder image
              </p>
            </div>
            
            {/* Debug Options */}
            <div className="mt-3 border-t border-dashed pt-3 border-gray-500">
              <p className="text-sm font-semibold mb-2 text-orange-500">Debug Options</p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      descriptionImage: 'https://via.placeholder.com/640x360?text=Test+Evacuation+Center'
                    });
                  }}
                  className={`text-xs px-2 py-1 rounded bg-orange-500 text-white hover:bg-orange-600`}
                >
                  Use Test Placeholder
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    console.log('DEBUG: Form data state:', formData);
                    console.log('DEBUG: Selected file:', selectedFile);
                  }}
                  className={`text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600`}
                >
                  Log Debug Info
                </button>
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className={`w-full px-4 py-2 rounded-md border ${
                isDark 
                  ? 'bg-gray-800 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Details about the evacuation center, capacity, facilities, etc."
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default EvacuationCenterAddDialog; 