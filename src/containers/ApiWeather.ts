export interface WeatherDescr {
  description: string;
  icon: string;
  id: number;
  main: string;
}

export interface ApiWeather {
  id: number;
  clouds: {
    all: number;
  };
  sys: {
    country: string;
  };
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  cod: string;
  message: string;
  name: string;
  visibility: number;
  wind: {
    deg: number;
    gust: number;
    speed: number;
  };
  weather?: WeatherDescr[];
}
