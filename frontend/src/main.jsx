import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { SocketProvider } from "./context/SocketContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
