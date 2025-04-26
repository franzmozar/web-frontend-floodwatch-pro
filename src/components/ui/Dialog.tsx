import React, { Fragment, useRef, ReactNode } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { useTheme } from '../../contexts/ThemeContext';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  initialFocus?: React.MutableRefObject<HTMLElement | null>;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  icon,
  actions,
  maxWidth = 'lg',
  initialFocus
}) => {
  const defaultCancelButtonRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Map maxWidth to Tailwind class
  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl'
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <HeadlessDialog 
        as="div" 
        className="relative z-50" 
        initialFocus={initialFocus || defaultCancelButtonRef} 
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <HeadlessDialog.Panel 
                className={`relative transform overflow-hidden rounded-lg ${
                  isDark 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-white text-gray-900'
                } shadow-xl transition-all sm:my-8 sm:w-full w-full ${maxWidthClasses[maxWidth]}`}
              >
                <div className="px-8 pb-8 pt-6 sm:p-10 sm:pb-8">
                  <div className="sm:flex sm:items-start">
                    {icon && (
                      <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-14 sm:w-14">
                        {icon}
                      </div>
                    )}
                    <div className={`mt-4 text-center ${icon ? 'sm:ml-6' : ''} sm:mt-0 sm:text-left w-full`}>
                      <HeadlessDialog.Title as="h3" className="text-xl font-semibold leading-6">
                        {title}
                      </HeadlessDialog.Title>
                      <div className="mt-4 w-full">
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
                {actions && (
                  <div className={`px-8 py-5 sm:flex sm:flex-row-reverse sm:px-10 ${
                    isDark ? 'border-t border-gray-700' : 'bg-gray-50'
                  }`}>
                    {actions}
                  </div>
                )}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  );
};

export default Dialog; 