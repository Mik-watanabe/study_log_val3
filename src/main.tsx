import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { Provider } from "./components/ui/provider.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <Toaster />
      <App />
    </Provider>
  </StrictMode>
);
