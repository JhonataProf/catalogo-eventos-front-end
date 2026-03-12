import App from "@/app/App";
import "@/index.css";
import React from "react";
import ReactDOM from "react-dom/client";

const rootElement: HTMLElement | null = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento root não encontrado.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);