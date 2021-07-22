import React, { useEffect, useState } from "react";
import { useQueries, useQuery, UseQueryResult } from "react-query";
import { HttpInstance } from "../api";
import { Weather } from "../components/weather";
import { Card } from "antd";
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
  const { latitude, longitude, geoError, loading } = useGeolocation(
    {
      enableHighAccuracy: true,
    },
    !locations.dataSource.length
  );

  useEffect(() => {
    const initialState = localStorage.getItem("city");
    if (initialState != null) {
      setLocations({ ...JSON.parse(initialState) });
    }
  }, []);

  const userQueries = useQueries(
    locations.dataSource.map((locations) => {
      return {
        queryKey: ["weather", locations.name, latitude, longitude],
        queryFn: async (): Promise<ApiWeather> => {
          return await HttpInstance.getWeather({
            q: locations.name,
          });
        },
        enabled: !!locations.name,
        refetchOnWindowFocus: false,
      };
    })
  );

  const { data, isLoading } = useQuery(
    ["weather", latitude, longitude],
    async () =>
      await HttpInstance.getWeather({
        lat: latitude,
        lon: longitude,
      }),
    {
      enabled: !!latitude && !!longitude,
      refetchOnWindowFocus: false,
    }
  );

  const deleteItem = (key: number) => {
    const item = locations.dataSource.filter((e) => e.key !== key);
    setLocations({ dataSource: [...item] });
    localStorage.removeItem("city");
    localStorage.setItem("city", JSON.stringify({ dataSource: [...item] }));
    setVisible(false);
  };

  if (geoError) {
    return (
      <Card bordered style={{ overflow: "hidden", width: "300px" }}>
        <h1>Error</h1>
        {geoError.message}
      </Card>
    );
  }

  return (
    <div className="relative" style={{ width: "300px" }}>
      <SettingOutlined
        className="absolute z-10 text-lg text-gray-500 top-3 right-5"
        onClick={() => setVisible(true)}
      />

      <Card
        bordered={true}
        style={{ overflow: "hidden", width: "300px" }}
        loading={isLoading}
      >
        {locations.dataSource.length ? (
          (userQueries as UseQueryResult<ApiWeather>[]).map(({ data }) => {
            if (data?.cod === "404") {
              return (
                <span key={data?.id}>
                  <h1 className="text-lg ml-7 capitalize text-red-500">
                    {data?.message}
                  </h1>
                  <Weather key={data?.id} loading={true} {...data} />
                </span>
              );
            }
            return <Weather key={data?.id} {...data} />;
          })
        ) : (
          <Weather loading={loading} {...data} />
        )}

        <AppDrawer
          visible={visible}
          onClose={() => setVisible(false)}
          locations={locations}
          setLocations={(e) => setLocations(e)}
          deleteItem={deleteItem}
          setVisible={(e) => setVisible(e)}
        />
      </Card>
    </div>
  );
};
