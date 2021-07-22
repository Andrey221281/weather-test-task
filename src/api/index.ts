import axios, { AxiosInstance } from "axios";
import { ApiWeather } from "../containers/ApiWeather";

interface WeatherProps {
  q?: string | null;
  units?: "standard" | "metric" | "imperial";
  lat?: number | null;
  lon?: number | null;
}

export class HttpInstance {
  private static apiKey: string = "75e606f8395e05a60d44a1cc8e14a0a9";

  private static get api(): AxiosInstance {
    return axios.create({
      baseURL: "https://api.openweathermap.org",
      params: {
        appid: HttpInstance.apiKey,
      },
      validateStatus: () => {
        return true;
      },
    });
  }

  static async getWeather({
    q,
    units = "metric",
    lat,
    lon,
  }: WeatherProps): Promise<ApiWeather> {
    const { data } = await HttpInstance.api.get("/data/2.5/weather", {
      params: { q, units, lat, lon },
    });
    return data;
  }
}
