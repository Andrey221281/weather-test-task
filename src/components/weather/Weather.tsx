import React from "react";
import { ApiWeather } from "../../containers/ApiWeather";
import { Card } from "antd";
import { windDesc } from "./windDesc";
import { WeatherDesc } from "./WeatherDesc";
import { windDirection } from "./windDirection";
import { Wind } from "./Wind";
import { dewPoint } from "./dewPoint";

interface Props {
  isLoading?: boolean;
  isError?: boolean;
  error?: string | null;
}

export const Weather: React.FunctionComponent<Partial<ApiWeather> & Props> = ({
  name,
  weather,
  main,
  isLoading,
  sys,
  wind,
  isError,
  error,
}) => {
  const windDescription = windDesc.find(
    (e) =>
      wind &&
      wind.speed > e.speed_interval[0] &&
      wind.speed < e.speed_interval[1]
  );

  const windDirectionString = windDirection.find(
    (e) => wind && wind.deg > e.deg_interval[0] && wind.deg < e.deg_interval[1]
  );

  if (isError) {
    return (
      <Card bordered={false} loading={isLoading} className="my-6 pb-2">
        <p className="capitalize text-xl">{error}</p>
      </Card>
    );
  }

  return (
    <Card bordered={false} loading={isLoading} className="my-6 pb-2">
      <div>
        <span className="text-base font-semibold">
          {name}, {sys?.country}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <img
          src={`https://openweathermap.org/img/wn/${
            weather && weather[0].icon
          }@2x.png`}
          alt={weather && weather[0].description}
        />
        <div className="text-4xl whitespace-nowrap">
          {main && Math.round(main.temp)} &#176;C
        </div>
      </div>

      <div className="leading-tight">
        <WeatherDesc
          windDescription={windDescription?.name}
          weather={weather}
          main={main}
        />
      </div>

      <div className="flex justify-between mt-2">
        <Wind
          windDirectionString={windDirectionString?.name}
          pressure={main && main.pressure}
          speed={wind && wind.speed}
          arrow={wind && wind.deg}
        />
      </div>

      <div className="flex items-center leading-tight mt-2 justify-between">
        <div className="whitespace-nowrap">
          <span>Humidity: </span>
          <span>{main && main.humidity}%</span>
        </div>
        <div className="ml-2 whitespace-nowrap">
          <span>Dew point: </span>
          <span className="whitespace-nowrap">
            {main && dewPoint(main.temp, main.humidity)}&#176;C
          </span>
        </div>
      </div>
    </Card>
  );
};
