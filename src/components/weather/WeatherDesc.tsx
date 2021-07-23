import React from "react";
import { ApiWeather } from "../../containers/ApiWeather";

export const WeatherDesc: React.FunctionComponent<
  Partial<ApiWeather> & { windDescription?: string }
> = ({ main, weather, windDescription }) => {
  return (
    <>
      <span>
        Feels like {main && Math.round(main.feels_like)}
        &#176;C.
      </span>
      <span className="capitalize ml-1 whitespace-nowrap">
        {weather && weather[0].description}.
      </span>
      <span className="ml-1">{windDescription}</span>
    </>
  );
};
