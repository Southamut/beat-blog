import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/authentication";
import jwtInterceptor from "./utils/jwtInterceptor.jsx";
import GlobalLoading from "./components/GlobalLoading.jsx";

// เรียกใช้ jwtInterceptor ก่อนที่แอปจะเริ่มทำงาน
jwtInterceptor();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <App />
        <GlobalLoading />
      </AuthProvider>
    </Router>
  </StrictMode>
);
