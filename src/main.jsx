import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ContextPage from "./Context/ContextPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextPage>
      <App />
    </ContextPage>
  </StrictMode>
);
