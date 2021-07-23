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

  const onEvent = useCallback((event: any) => {
    setState({
      isGeoLoading: false,
      latitude: event.coords.latitude,
      longitude: event.coords.longitude,
      isGeoError: false,
    });
  }, []);

  const onEventError = useCallback(
    (error: IGeolocationPositionError) =>
      setState((oldState) => ({
        ...oldState,
        isGeoLoading: false,
        geoError: error,
        isGeoError: true,
      })),
    []
  );
  console.log(mounted);
  useEffect(() => {
    mounted.current &&
      navigator.geolocation.getCurrentPosition(onEvent, onEventError, {
        enableHighAccuracy: true,
      });

    return () => {
      mounted.current = false;
    };
  }, [onEvent, onEventError]);

  return state;
};

export default useGeolocation;
