import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Fix: Point to the 'styles' folder shown in your file explorer
import "./styles/global.css"; 

import { AuthProvider } from "./context/AuthContext";
import { PatientProvider } from "./context/PatientContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <PatientProvider>
        <App />
      </PatientProvider>
    </AuthProvider>
  </React.StrictMode>
);