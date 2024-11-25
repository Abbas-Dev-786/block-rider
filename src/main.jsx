import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppKitProvider from "./context/AppKitProvider.jsx";
import WalletContextProvider from "./context/WalletProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletContextProvider>
        <AppKitProvider>
          <App />
        </AppKitProvider>
      </WalletContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
