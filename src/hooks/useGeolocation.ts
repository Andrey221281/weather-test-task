import { useCallback, useEffect, useState } from "react";

export interface IGeolocationPositionError {
  readonly code: number;
  readonly message: string;
  readonly PERMISSION_DENIED: number;
  readonly POSITION_UNAVAILABLE: number;
  readonly TIMEOUT: number;
}

export interface GeoLocationSensorState {
  loading: boolean;
  latitude: number | null;
  longitude: number | null;
  geoError?: Error | IGeolocationPositionError | null;
}

const useGeolocation = (
  options?: PositionOptions,
  enabled?: boolean
): GeoLocationSensorState => {
  const [state, setState] = useState<GeoLocationSensorState>({
    loading: true,
    latitude: null,
    longitude: null,
    geoError: null,
  });

  const onEvent = useCallback((event: any) => {
    setState({
      loading: false,
      latitude: event.coords.latitude,
      longitude: event.coords.longitude,
    });
  }, []);
  console.log(enabled);
  const onEventError = useCallback(
    (error: IGeolocationPositionError) =>
      setState((oldState) => ({
        ...oldState,
        loading: false,
        geoError: error,
      })),
    []
  );

  useEffect(() => {
    if (enabled) {
      navigator.geolocation.getCurrentPosition(onEvent, onEventError, options);
    }
  }, [enabled, onEvent, onEventError, options]);

  return state;
};

export default useGeolocation;
