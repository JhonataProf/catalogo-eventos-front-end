import App from "@/app/App";
import "@/index.css";
import { reportPublicError } from "@/observability/publicErrorReporting";
import React from "react";
import ReactDOM from "react-dom/client";

if (import.meta.env.PROD) {
  window.addEventListener("unhandledrejection", (event) => {
    reportPublicError(event.reason, { type: "unhandledrejection" });
  });
  window.addEventListener("error", (event) => {
    reportPublicError(event.error ?? event.message, { type: "window-error" });
  });
}

const rootElement: HTMLElement | null = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento root não encontrado.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);