import React from 'react';
import { UserCircleIcon, PhoneIcon, MapPinIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import Dialog from './Dialog';

interface User {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  contactNo: string;
  gender: string;
  status: string;
}

interface ViewUserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewUserDetailsDialog: React.FC<ViewUserDetailsDialogProps> = ({ 
  isOpen, 
  onClose, 
  user 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate icon
  const userIcon = (
    <div className={`${isDark ? 'bg-blue-900' : 'bg-blue-100'} h-full w-full flex items-center justify-center rounded-full`}>
      <UserCircleIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />
    </div>
  );

  // Generate action buttons
  const actionButtons = (
    <button
      type="button"
      className={`inline-flex w-full justify-center rounded-md px-5 py-3 text-base font-semibold cursor-pointer shadow-sm transition-colors ${
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

  if (!user) return null;

  const mapsUrl = createMapsUrl(user.coordinates);
  
  const statusColor = user.status === 'Emergency' 
    ? isDark ? 'bg-red-600' : 'bg-red-500'
    : isDark ? 'bg-green-600' : 'bg-green-500';

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon={userIcon}
      actions={actionButtons}
      maxWidth="4xl"
    >
      <div className={`-mt-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        {/* Header with status and name */}
        <div className={`relative mb-8 pb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${statusColor} text-white`}>
              {user.status}
            </span>
          </div>
          <p className={`mt-1 text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="font-medium">ID:</span> {user.id}
          </p>
        </div>

        {/* Content grid */}
        <div className="space-y-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">Contact Information</h3>
            <div className="space-y-5">
              {/* Phone */}
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <PhoneIcon className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">Phone Number</p>
                  <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.contactNo}</p>
                </div>
              </div>
              
              {/* Gender */}
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <IdentificationIcon className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">Gender</p>
                  <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.gender}</p>
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
                <div className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <MapPinIcon className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">Address</p>
                  {mapsUrl ? (
                    <a 
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-base ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
                    >
                      {user.location || 'N/A'}
                    </a>
                  ) : (
                    <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.location || 'N/A'}</p>
                  )}
                  {user.coordinates && (
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {user.coordinates}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewUserDetailsDialog; 