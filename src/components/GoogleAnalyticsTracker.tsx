import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gaPageView } from '../utils/gtag';

const GoogleAnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Send a page view event to Google Analytics on route changes
    gaPageView(location.pathname + location.search, document.title);
  }, [location]); // Re-run effect when location changes

  return null; // This component doesn't render anything
};

export default GoogleAnalyticsTracker; 