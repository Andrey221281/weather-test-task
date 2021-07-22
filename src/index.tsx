import { render } from "react-dom";
import { App } from "./containers/App";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";

const queryClient = new QueryClient();
render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementsByTagName("weather-widget")[0]
);
