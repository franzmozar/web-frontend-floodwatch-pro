import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * A custom hook to set the page title dynamically
 * @param title The title to set for the current page
 * @param appName Optional app name to append to the title
 */
export const usePageTitle = (title: string, appName = 'Emergency Notification System') => {
  // Update the document title directly as a side effect
  useEffect(() => {
    // For browsers that don't support Helmet or as a fallback
    document.title = appName ? `${title} | ${appName}` : title;
  }, [title, appName]);

  // Return the Helmet component to be used in the component
  return (
    <Helmet>
      <title>{appName ? `${title} | ${appName}` : title}</title>
    </Helmet>
  );
};

export default usePageTitle; 