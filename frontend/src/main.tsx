import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import LowercaseRedirect from "./components/LowercaseRedirect";
import "./styles/fonts.scss";
import "./globals.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LowercaseRedirect>
        <App />
      </LowercaseRedirect>
    </BrowserRouter>
  </StrictMode>
);
