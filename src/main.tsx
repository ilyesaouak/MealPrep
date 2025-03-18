import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MealProvider } from "./context/MealContext";
import { AuthProvider } from "./context/AuthContext";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <MealProvider>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </MealProvider>
    </AuthProvider>
  </React.StrictMode>,
);
