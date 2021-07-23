import { useCallback, useEffect, useState } from "react";

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
  }, [enabled, onEvent, onEventError, options, state.latitude]);

  return state;
};

export default useGeolocation;
