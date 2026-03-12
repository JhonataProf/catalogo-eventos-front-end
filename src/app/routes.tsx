import type { ReactElement } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { PublicLayout } from "@/shell/public/layouts/PublicLayout";
import { HomePage } from "@/domains/home-institucional/pages/HomePage";
import { EventosPage } from "@/domains/catalogo-publico/eventos/pages/EventosPage";
import { EventoDetailsPage } from "@/domains/catalogo-publico/eventos/pages/EventoDetailsPage";
import { PontosTuristicosPage } from "@/domains/catalogo-publico/pontos/pages/PontosTuristicosPage";
import { PontoTuristicoDetailsPage } from "@/domains/catalogo-publico/pontos/pages/PontoTuristicoDetailsPage";
import { CityDetailsPage } from "@/domains/cidades-institucional/pages/CityDetailsPage";
import { AboutPage } from "@/domains/institucional/pages/AboutPage";

export function AppRoutes(): ReactElement | null {
  return useRoutes([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "eventos",
          element: <EventosPage />,
        },
        {
          path: "eventos/:id",
          element: <EventoDetailsPage />,
        },
        {
          path: "pontos-turisticos",
          element: <PontosTuristicosPage />,
        },
        {
          path: "pontos-turisticos/:id",
          element: <PontoTuristicoDetailsPage />,
        },
        {
          path: "cidades/:slug",
          element: <CityDetailsPage />,
        },
        {
          path: "sobre",
          element: <AboutPage />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
}