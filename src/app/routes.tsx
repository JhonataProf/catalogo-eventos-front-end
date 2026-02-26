import React from "react";
import { DouradosEventosPage } from "../features/eventos/pages/DouradosEventosPage";
import AboutPage from "../pages/AboutPage";
import DetailsEventsPage from "../pages/DetailsEventsPage";
import DetailsPontoPage from "../pages/DetailsPontoPage";
import EventosPage from "../pages/EventosPage";
import TourismPage from "../pages/TourismPage";
import DefaultTemplate from "../shared/templates/DefaultTemplate";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

export const AppRoutes: RouteConfig[] = [
  {
    path: "",
    element: <DefaultTemplate />,
    children: [
      { path: "/", element: <DouradosEventosPage /> },
      { path: "/eventos", element: <EventosPage /> },
      { path: "/sobre", element: <AboutPage /> },
      { path: "/turismo", element: <TourismPage /> },
      {  path: "/eventos/:id", element: <DetailsEventsPage /> },
      { path: "/ponto-turistico/:id", element: <DetailsPontoPage /> },
      {  path: "*", element: <div className="p-4 text-center text-sm text-[#9fb0c8]">Página não encontrada</div> },
    ],
  },
];
