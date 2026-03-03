import React, { lazy, Suspense } from "react";
import DefaultTemplate from "../shared/templates/DefaultTemplate";
import { PageLoader } from "./PageLoader";
import TourismPage from "../pages/TourismPage";
import EventosPage from "../pages/EventosPage";
import AboutPage from "../pages/AboutPage";


const withSuspense = (node: React.ReactNode) => <Suspense fallback={<PageLoader />}>{node}</Suspense>;

const HomePage = lazy(() => import("../features/home/pages/HomePage"));
const CityDetailsPage = lazy(() => import("../pages/CityDetailsPage"));

// mantenha suas outras pages (EventosPage/TourismPage/AboutPage/Details...)
// como lazy também

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
      { path: "/", element: withSuspense(<HomePage />) },
      { path: "/cidades/:slug", element: withSuspense(<CityDetailsPage />) },
      { path: "/pontos-turisticos", element: withSuspense(<TourismPage />) },
      { path: "/eventos", element: withSuspense(<EventosPage />) },
      { path: "/sobre", element: withSuspense(<AboutPage />) },

      // suas rotas existentes:
      // { path: "/eventos/:id", element: withSuspense(<DetailsEventsPage />) },
      // { path: "/pontos-turisticos/:id", element: withSuspense(<DetailsPontoPage />) },

      { path: "*", element: <div className="p-4 text-center text-sm text-slate-500">Página não encontrada</div> },
    ],
  },
];