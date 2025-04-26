import React, { useRef } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import Dialog from './Dialog';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ isOpen, onClose, onConfirm }) => {
  const cancelButtonRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Create the warning icon with the appropriate styling
  const warningIcon = (
    <div className={`${isDark ? 'bg-red-900' : 'bg-red-100'} h-full w-full flex items-center justify-center`}>
      <ExclamationTriangleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
    </div>
  );

  // Create the action buttons
  const actionButtons = (
    <>
      <button
        type="button"
        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 cursor-pointer sm:ml-3 sm:w-auto"
        onClick={onConfirm}
      >
        Logout
      </button>
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

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Logout Confirmation"
      icon={warningIcon}
      actions={actionButtons}
      initialFocus={cancelButtonRef}
    >
      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
        Are you sure you want to log out? Any unsaved changes will be lost.
      </p>
    </Dialog>
  );
};

export default LogoutConfirmation; 