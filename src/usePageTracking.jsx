import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
    const location = useLocation();
    useEffect(() => {
        // Google Analytics
        if (location.pathname === '/webinar') {
            window.gtag('event', 'ads_conversion_Sign_up_Page_load_zenst_1', {
              // <event_parameters>
            });
          }
    }, [location]);
};
