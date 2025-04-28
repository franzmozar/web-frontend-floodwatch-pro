import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Dialog from './Dialog';
import { MapIcon } from '@heroicons/react/24/outline';

interface ClosedRoadAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (data: {
    title: string;
    latitude: string;
    longitude: string;
    description: string;
  }) => Promise<void>;
}

const ClosedRoadAddDialog: React.FC<ClosedRoadAddDialogProps> = ({ isOpen, onClose, onAdd }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    latitude: '',
    longitude: '',
    description: ''
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (onAdd) {
        const apiData = {
          title: formData.title,
          latitude: formData.latitude,
          longitude: formData.longitude,
          description: formData.description
        };
        
        await onAdd(apiData);
      } else {
        console.log('Closed road data to be added:', formData);
        onClose();
      }
      
      // Reset form
      setFormData({
        id: '',
        title: '',
        latitude: '',
        longitude: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate icon
  const addIcon = (
    <div className={`${isDark ? 'bg-red-900' : 'bg-red-100'} h-full w-full flex items-center justify-center rounded-full`}>
      <MapIcon className="h-7 w-7 text-red-500" aria-hidden="true" />
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
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="add-road-form"
        className={`inline-flex justify-center rounded-md px-6 py-3 text-base font-semibold cursor-pointer shadow-sm transition-colors 
          bg-red-600 text-white hover:bg-red-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Road'}
      </button>
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Closed Road"
      icon={addIcon}
      actions={actionButtons}
      maxWidth="2xl"
    >
      <form id="add-road-form" onSubmit={handleSubmit}>
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
                placeholder="RD001"
              />
            </div>

            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Road Name
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
                placeholder="Road or Highway Name"
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
              rows={3}
              required
              className={`w-full px-4 py-2 rounded-md border ${
                isDark 
                  ? 'bg-gray-800 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Details about road closure, alternate routes, etc."
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default ClosedRoadAddDialog; 