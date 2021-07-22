import { useCallback, useEffect, useRef, useState } from "react";

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

const useGeolocation = (options?: PositionOptions): GeoLocationSensorState => {
  const [state, setState] = useState<GeoLocationSensorState>({
    loading: true,
    latitude: null,
    longitude: null,
    geoError: null,
  });
  const mounted = useRef(true);
  let watchId = useRef<number | null>(null);

  const onEvent = useCallback(
    (event: any) => {
      if (mounted) {
        setState({
          loading: false,
          latitude: event.coords.latitude,
          longitude: event.coords.longitude,
        });
      }
    },
    [mounted]
  );

  const onEventError = useCallback(
    (error: IGeolocationPositionError) =>
      mounted &&
      setState((oldState) => ({
        ...oldState,
        loading: false,
        geoError: error,
      })),
    [mounted]
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onEvent, onEventError, options);
    watchId.current = navigator.geolocation.watchPosition(
      onEvent,
      onEventError,
      options
    );

    return () => {
      mounted.current = false;
      navigator.geolocation.clearWatch(watchId as any);
    };
  }, [onEvent, onEventError, options]);

  return state;
};

export default useGeolocation;
