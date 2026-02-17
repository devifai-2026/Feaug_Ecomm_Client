import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import guestApi from '../apis/guestApi';

/**
 * Hook to track page views and guest sessions
 */
const usePageTracking = () => {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);

    // Initialize guest session
    useEffect(() => {
        const initSession = async () => {
            const existingGuestId = guestApi.getGuestId();

            if (!existingGuestId) {
                try {
                    await guestApi.initGuestSession({
                        sessionId: Date.now().toString(), // Simple session ID
                        referrer: document.referrer,
                        onSuccess: (res) => {
                            if (res.data && res.data.guestId) {
                                guestApi.setGuestId(res.data.guestId);
                                setInitialized(true);
                            }
                        },
                        onError: (err) => {
                            console.error('Failed to init guest session:', err);
                        }
                    });
                } catch (error) {
                    console.error('Error in guest initialization:', error);
                }
            } else {
                setInitialized(true);
            }
        };

        initSession();
    }, []);

    // Track page view
    useEffect(() => {
        if (initialized) {
            // Small delay to ensure route change is complete
            const timeoutId = setTimeout(() => {
                guestApi.trackPageView({
                    url: location.pathname + location.search,
                    onError: (err) => console.error('Failed to track page view:', err)
                });
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [location, initialized]);

    return { initialized };
};

export default usePageTracking;
