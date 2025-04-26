import React from 'react';
import { BeakerIcon, ClockIcon, MapPinIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import Dialog from './Dialog';

interface Floodwatch {
  id: string;
  location: string;
  coordinates: string;
  waterLevel: string;
  status: string;
  lastUpdated: string;
  description: string;
}

interface FloodwatchDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  floodwatch: Floodwatch | null;
}

const FloodwatchDetailsDialog: React.FC<FloodwatchDetailsDialogProps> = ({ 
  isOpen, 
  onClose, 
  floodwatch 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate icon
  const floodwatchIcon = (
    <div className={`${isDark ? 'bg-blue-900' : 'bg-blue-100'} h-full w-full flex items-center justify-center rounded-full`}>
      <BeakerIcon className="h-7 w-7 text-blue-500" aria-hidden="true" />
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

  if (!floodwatch) return null;
  
  const mapsUrl = createMapsUrl(floodwatch.coordinates);
  
  // Get status color based on flood risk level
  let statusColor = '';
  switch(floodwatch.status.toLowerCase()) {
    case 'high':
      statusColor = 'bg-red-500';
      break;
    case 'medium':
      statusColor = 'bg-yellow-500';
      break;
    case 'safe': 
    case 'low':
      statusColor = 'bg-emerald-500';
      break;
    default:
      statusColor = 'bg-gray-500';
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon={floodwatchIcon}
      actions={actionButtons}
      maxWidth="4xl"
    >
      <div className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        {/* Header with location and status */}
        <div className={`relative mb-8 pb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">Sensor {floodwatch.id}</h2>
            <span className={`px-5 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor} text-white ${isDark ? 'shadow-[0_0_8px_rgba(255,255,255,0.2)]' : ''}`}>
              {floodwatch.status}
            </span>
          </div>
          <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="font-medium">Location:</span> {floodwatch.location}
          </p>
        </div>

        {/* Floodwatch Details */}
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">Floodwatch Details</h3>
            <div className="space-y-6">
              {/* Water Level */}
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                  <BeakerIcon className={`h-7 w-7 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div className="ml-5">
                  <p className="text-base font-medium">Water Level</p>
                  <p className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {floodwatch.waterLevel}
                  </p>
                </div>
              </div>
              
              {/* Last Updated */}
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                  <ClockIcon className={`h-7 w-7 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div className="ml-5">
                  <p className="text-base font-medium">Last Updated</p>
                  <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {floodwatch.lastUpdated || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">Location Details</h3>
            <div className="space-y-5">
              {/* Location */}
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                  <MapPinIcon className={`h-7 w-7 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div className="ml-5">
                  <p className="text-base font-medium">Address</p>
                  {mapsUrl ? (
                    <a 
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-base ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
                    >
                      {floodwatch.location || 'N/A'}
                    </a>
                  ) : (
                    <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{floodwatch.location || 'N/A'}</p>
                  )}
                  {floodwatch.coordinates && (
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {floodwatch.coordinates}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {floodwatch.description && (
            <div>
              <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">Additional Details</h3>
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                    <DocumentTextIcon className={`h-7 w-7 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                  </div>
                  <div className="ml-5">
                    <p className="text-base font-medium">Details</p>
                    <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{floodwatch.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default FloodwatchDetailsDialog; 