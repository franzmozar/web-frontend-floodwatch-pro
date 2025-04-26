import React, { useState, useRef } from 'react';
import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
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

interface UserManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  mode: 'add' | 'edit' | 'delete';
  onConfirm: (userData: User | string) => void;
}

const UserManagementDialog: React.FC<UserManagementDialogProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  mode, 
  onConfirm 
}) => {
  const cancelButtonRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // State for form fields
  const [userData, setUserData] = useState<User>(
    user || {
      id: '',
      name: '',
      location: '',
      coordinates: '',
      contactNo: '',
      gender: 'Male',
      status: 'Stable'
    }
  );

  // Update userData when user prop changes
  React.useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (mode === 'delete') {
      onConfirm(userData.id);
    } else {
      onConfirm(userData);
    }
    onClose();
  };

  // Generate icon based on mode
  const getIcon = () => {
    if (mode === 'delete') {
      return (
        <div className={`${isDark ? 'bg-red-900' : 'bg-red-100'} h-full w-full flex items-center justify-center`}>
          <UserMinusIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
        </div>
      );
    }
    
    return (
      <div className={`${isDark ? 'bg-blue-900' : 'bg-blue-100'} h-full w-full flex items-center justify-center`}>
        <UserPlusIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />
      </div>
    );
  };

  // Generate dialog title
  const getTitle = () => {
    switch (mode) {
      case 'add': return 'Add New User';
      case 'edit': return 'Edit User';
      case 'delete': return 'Delete User';
      default: return '';
    }
  };

  // Generate action buttons
  const getActionButtons = () => {
    const confirmButton = mode === 'delete' ? (
      <button
        type="button"
        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 cursor-pointer sm:ml-3 sm:w-auto"
        onClick={handleSubmit}
      >
        Delete
      </button>
    ) : (
      <button
        type="button"
        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 cursor-pointer sm:ml-3 sm:w-auto"
        onClick={handleSubmit}
      >
        {mode === 'add' ? 'Add' : 'Save'}
      </button>
    );

    return (
      <>
        {confirmButton}
        <button
          type="button"
          className={`mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset cursor-pointer ${
            isDark 
              ? 'bg-gray-700 text-gray-300 ring-gray-600 hover:bg-gray-600' 
              : 'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50'
          } sm:mt-0 sm:w-auto`}
          onClick={onClose}
          ref={cancelButtonRef}
        >
          Cancel
        </button>
      </>
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      icon={getIcon()}
      actions={getActionButtons()}
      initialFocus={cancelButtonRef}
    >
      {mode === 'delete' ? (
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          Are you sure you want to delete user <strong>{userData.name}</strong> with ID <strong>{userData.id}</strong>? This action cannot be undone.
        </p>
      ) : (
        <div className={`mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          <div>
            <label htmlFor="id" className="block text-sm font-medium mb-1">
              User ID
            </label>
            <input
              type="text"
              name="id"
              id="id"
              className={`w-full rounded-md px-3 py-2 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={userData.id}
              onChange={handleChange}
              readOnly={mode === 'edit'}
            />
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className={`w-full rounded-md px-3 py-2 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={userData.name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              className={`w-full rounded-md px-3 py-2 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={userData.location}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="coordinates" className="block text-sm font-medium mb-1">
              Coordinates
            </label>
            <input
              type="text"
              name="coordinates"
              id="coordinates"
              className={`w-full rounded-md px-3 py-2 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={userData.coordinates}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="contactNo" className="block text-sm font-medium mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNo"
              id="contactNo"
              className={`w-full rounded-md px-3 py-2 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={userData.contactNo}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-1">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              className={`w-full rounded-md px-3 py-2 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white cursor-pointer' 
                  : 'bg-white border-gray-300 text-gray-900 cursor-pointer'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={userData.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              name="status"
              id="status"
              className={`w-full rounded-md px-3 py-2 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white cursor-pointer' 
                  : 'bg-white border-gray-300 text-gray-900 cursor-pointer'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={userData.status}
              onChange={handleChange}
            >
              <option value="Stable">Stable</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default UserManagementDialog; 