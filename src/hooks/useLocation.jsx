import { useState, useEffect } from "react";

export const DEFAULT_POSITION = { lat: 43.6532, lng: -79.3832 };

const useLocation = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setLocation(DEFAULT_POSITION);
        }
      );
    } else {
      setLocation(DEFAULT_POSITION);
    }
  }, []);

  return { lat: location.latitude, lng: location.longitude };
};

export default useLocation;
