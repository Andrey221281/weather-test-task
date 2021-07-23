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

const useGeolocation = (
  options?: PositionOptions,
  enabled?: boolean
): GeoLocationSensorState => {
  const [state, setState] = useState<GeoLocationSensorState>({
    isGeoLoading: true,
    isGeoError: false,
    latitude: null,
    longitude: null,
    geoError: null,
  });

  const watchId = useRef<number>(0);

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

  useEffect(() => {
    if (!enabled && state.latitude) return;
    window.navigator.geolocation.getCurrentPosition(
      onEvent,
      onEventError,
      options
    );
    watchId.current = navigator.geolocation.watchPosition(
      onEvent,
      onEventError,
      options
    );
    return () => {
      navigator.geolocation.clearWatch(watchId.current);
    };
  }, [enabled, onEvent, onEventError, options, state.latitude]);

  return state;
};

export default useGeolocation;
