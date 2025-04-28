import React from 'react';
import { MapPinIcon, ClockIcon, DocumentTextIcon, BuildingOfficeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import Dialog from './Dialog';

interface EvacuationCenter {
  id: string;
  title: string;
  coordinates: string;
  descriptionIOS: string | null;
  descriptionIOSImageUrl?: string;
  descriptionAndroid: string;
  lastUpdated?: string;
}

interface EvacuationCenterDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  evacuationCenter: EvacuationCenter | null;
}

const EvacuationCenterDetailsDialog: React.FC<EvacuationCenterDetailsDialogProps> = ({ 
  isOpen, 
  onClose, 
  evacuationCenter 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate icon
  const evacuationCenterIcon = (
    <div className={`${isDark ? 'bg-green-900' : 'bg-green-100'} h-full w-full flex items-center justify-center rounded-full`}>
      <BuildingOfficeIcon className="h-7 w-7 text-green-500" aria-hidden="true" />
    </div>
  );

  // Generate action buttons
  const actionButtons = (
    <button
      type="button"
      className={`inline-flex w-full justify-center rounded-md px-6 py-3 text-base font-semibold cursor-pointer shadow-sm transition-colors ${
        isDark 
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
      } sm:w-auto`}
      onClick={onClose}
    >
      Close
    </button>
  );

  // Function to create a Google Maps URL from coordinates
  const createMapsUrl = (coords: string) => {
    if (!coords || coords === '') return null;
    return `https://www.google.com/maps?q=${coords}`;
  };

  if (!evacuationCenter) return null;
  
  const mapsUrl = createMapsUrl(evacuationCenter.coordinates);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon={evacuationCenterIcon}
      actions={actionButtons}
      maxWidth="4xl"
    >
      <div className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        {/* Header with title */}
        <div className={`relative mb-8 pb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">Evacuation Center {evacuationCenter.id}</h2>
          </div>
          <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="font-medium">Name:</span> {evacuationCenter.title}
          </p>
        </div>

        {/* Evacuation Center Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Section */}
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">Image</h3>
            {evacuationCenter.descriptionIOSImageUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700">
                  <img 
                    src={evacuationCenter.descriptionIOSImageUrl} 
                    alt={`Image of ${evacuationCenter.title}`}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <a 
                    href={evacuationCenter.descriptionIOSImageUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                  >
                    View full-size image
                  </a>
                </div>
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-100/50'}`}>
                <PhotoIcon className={`h-16 w-16 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className="mt-2 text-sm">No image available</p>
              </div>
            )}
          </div>

          {/* Location Section */}
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">Details</h3>
            <div className="space-y-5">
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                  <MapPinIcon className={`h-7 w-7 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div className="ml-5">
                  <p className="text-base font-medium">Location Coordinates</p>
                  <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {mapsUrl ? (
                      <a 
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
                      >
                        {evacuationCenter.coordinates}
                      </a>
                    ) : (
                      evacuationCenter.coordinates || 'N/A'
                    )}
                  </p>
                </div>
              </div>

              {evacuationCenter.lastUpdated && (
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                    <ClockIcon className={`h-7 w-7 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                  </div>
                  <div className="ml-5">
                    <p className="text-base font-medium">Last Updated</p>
                    <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{evacuationCenter.lastUpdated}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                  <DocumentTextIcon className={`h-7 w-7 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                </div>
                <div className="ml-5">
                  <p className="text-base font-medium">Description</p>
                  <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{evacuationCenter.descriptionAndroid || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EvacuationCenterDetailsDialog; 