import React, { useEffect, useMemo, useState } from "react";
import {
  useQueries,
  useQuery,
  UseQueryResult,
  QueryObserverIdleResult,
} from "react-query";
import { HttpInstance } from "../api";
import { Weather } from "../components/weather";
import { SettingOutlined } from "@ant-design/icons";
import { AppDrawer } from "../components/drawer";
import useGeolocation from "../hooks/useGeolocation";
import { ApiWeather } from "./ApiWeather";

export interface Locations {
  dataSource: {
    key: number;
    name: string;
    index: number;
  }[];
}
export const WeatherContainer: React.FunctionComponent = () => {
  const [locations, setLocations] = useState<Locations>({
    dataSource: [],
  });
  const [visible, setVisible] = useState(false);
  const { latitude, longitude, isGeoError, geoError } = useGeolocation();

  useEffect(() => {
    const initialState = localStorage.getItem("city");
    if (initialState != null) {
      setLocations({ ...JSON.parse(initialState) });
    }
  }, []);

  const fetcher = async (
    name?: string | null,
    lat?: number | null,
    lon?: number | null
  ) => {
    return await HttpInstance.getWeather({
      q: name,
      lat,
      lon,
    });
  };

  const userQueries = useQueries(
    locations.dataSource.map((locations) => {
      return {
        queryKey: ["weather", locations.name, latitude, longitude],
        queryFn: () => fetcher(locations.name),
        enabled: !!locations.name,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      };
    })
  );

  const { data, error, isError, isLoading } = useQuery(
    ["weather", latitude, longitude],
    () => fetcher(null, latitude, longitude),
    {
      enabled: !!latitude && !!longitude,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const cachedMutatedData = useMemo(() => {
    if (isError) return null;
    return data;
  }, [isError, data]);

  const deleteItem = (key: number) => {
    const item = locations.dataSource.filter((e) => e.key !== key);
    setLocations({ dataSource: [...item] });
    localStorage.removeItem("city");
    localStorage.setItem("city", JSON.stringify({ dataSource: [...item] }));
  };

  console.log(isLoading ? "true" : "false");
  console.log("cachedMutatedData", cachedMutatedData);

  return (
    <div className="relative overflow-hidden" style={{ width: "300px" }}>
      <SettingOutlined
        className="absolute z-10 text-lg text-gray-500 top-3 right-5"
        onClick={() => setVisible(true)}
      />

      <div
        className="overflow-hidden"
        style={{ width: "300px", minHeight: "350px" }}
      >
        {locations.dataSource.length !== 0 ? (
          (
            userQueries as UseQueryResult<ApiWeather, QueryObserverIdleResult>[]
          ).map(({ data, isLoading, isError, error }) => {
            return (
              <span key={data?.id}>
                <Weather
                  isError={isError}
                  isLoading={isLoading}
                  error={(error as any)?.response.data.message}
                  {...data}
                />
              </span>
            );
          })
        ) : (
          <Weather
            isError={isError || isGeoError}
            isLoading={isLoading}
            error={(error as any)?.response.data || geoError?.message}
            {...cachedMutatedData}
          />
        )}
        <AppDrawer
          visible={visible}
          onClose={() => setVisible(false)}
          locations={locations}
          setLocations={(e) => setLocations(e)}
          deleteItem={deleteItem}
          setVisible={(e) => setVisible(e)}
        />
      </div>
    </div>
  );
};
