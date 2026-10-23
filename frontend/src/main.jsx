import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { SocketProvider } from "./context/SocketContext";
import { EcoLeafProvider } from "./context/EcoLeafContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <DataProvider>
          <EcoLeafProvider>
            <App />
          </EcoLeafProvider>
        </DataProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
