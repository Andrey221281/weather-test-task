import { useCallback, useEffect, useRef, useState } from "react";

export interface IGeolocationPositionError {
  readonly code: number;
  readonly message: string;
}

export interface GeoLocationSensorState {
  isGeoLoading: boolean;
  isGeoError?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  geoError?: Error | IGeolocationPositionError | null;
}

const useGeolocation = (): GeoLocationSensorState => {
  const [state, setState] = useState<GeoLocationSensorState>({
    isGeoLoading: true,
    isGeoError: false,
    latitude: null,
    longitude: null,
    geoError: null,
  });
  const mounted = useRef(true);
  const watchId = useRef(0);

  const onEvent = useCallback((event: any) => {
    mounted.current &&
      setState({
        isGeoLoading: false,
        latitude: event.coords.latitude,
        longitude: event.coords.longitude,
        isGeoError: false,
      });
  }, []);

  const onEventError = useCallback(
    (error: IGeolocationPositionError) =>
      mounted.current &&
      setState((oldState) => ({
        ...oldState,
        isGeoLoading: false,
        geoError: error,
        isGeoError: true,
      })),
    []
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onEvent, onEventError, {
      enableHighAccuracy: true,
    });
    watchId.current = navigator.geolocation.watchPosition(
      onEvent,
      onEventError,
      {
        enableHighAccuracy: true,
      }
    );
    console.log(watchId);
    return () => {
      mounted.current = false;
      navigator.geolocation.clearWatch(watchId.current);
    };
  }, [onEvent, onEventError]);

  return state;
};

export default useGeolocation;
