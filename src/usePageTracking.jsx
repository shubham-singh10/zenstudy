import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        // Google Analytics
        if (window.gtag) {
            window.gtag('config', 'G-Y5L03F2HBX', {
                page_path: location.pathname,
            });

            window.gtag('event', 'page_view', {
                page_path: location.pathname,
            });
        }

        // Meta (Facebook) Pixel
        if (window.fbq) {
            window.fbq('track', 'PageView');
        }
    }, [location]);
};
