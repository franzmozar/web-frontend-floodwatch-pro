import React from 'react';
import { MapPinIcon, ClockIcon, DocumentTextIcon, MapIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import Dialog from './Dialog';

interface ClosedRoad {
  id: string;
  title: string;
  coordinates: string;
  description: string;
  lastUpdated?: string;
}

interface ClosedRoadDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  closedRoad: ClosedRoad | null;
}

const ClosedRoadDetailsDialog: React.FC<ClosedRoadDetailsDialogProps> = ({ 
  isOpen, 
  onClose, 
  closedRoad 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate icon
  const roadIcon = (
    <div className={`${isDark ? 'bg-red-900' : 'bg-red-100'} h-full w-full flex items-center justify-center rounded-full`}>
      <MapIcon className="h-7 w-7 text-red-500" aria-hidden="true" />
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

  if (!closedRoad) return null;
  
  const mapsUrl = createMapsUrl(closedRoad.coordinates);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon={roadIcon}
      actions={actionButtons}
      maxWidth="3xl"
    >
      <div className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        {/* Header with title */}
        <div className={`relative mb-8 pb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">Road Closure {closedRoad.id}</h2>
          </div>
          <p className={`mt-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="font-medium">Road:</span> {closedRoad.title}
          </p>
        </div>

        {/* Road Details */}
        <div className="space-y-8">
          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">Location Details</h3>
            <div className="space-y-5">
              {/* Location */}
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                  <MapPinIcon className={`h-7 w-7 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                </div>
                <div className="ml-5">
                  <p className="text-base font-medium">Coordinates</p>
                  {mapsUrl ? (
                    <a 
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-base ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
                    >
                      {closedRoad.coordinates || 'N/A'}
                    </a>
                  ) : (
                    <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{closedRoad.coordinates || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          {closedRoad.lastUpdated && (
            <div className="flex items-start">
              <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                <ClockIcon className={`h-7 w-7 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
              </div>
              <div className="ml-5">
                <p className="text-base font-medium">Last Updated</p>
                <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {closedRoad.lastUpdated}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">Closure Details</h3>
            <div className="space-y-5">
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                  <DocumentTextIcon className={`h-7 w-7 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                </div>
                <div className="ml-5">
                  <p className="text-base font-medium">Description</p>
                  <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{closedRoad.description || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ClosedRoadDetailsDialog; 