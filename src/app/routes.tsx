import type { ReactElement } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import { PublicLayout } from "@/shell/public/layouts/PublicLayout";
import { AdminAuthLayout } from "@/shell/admin/layouts/AdminAuthLayout";
import { AdminLayout } from "@/shell/admin/layouts/AdminLayout";

import { HomePage } from "@/domains/home-institucional/pages/HomePage";
import { EventosPage } from "@/domains/catalogo-publico/eventos/pages/EventosPage";
import { EventoDetailsPage } from "@/domains/catalogo-publico/eventos/pages/EventoDetailsPage";
import { PontosTuristicosPage } from "@/domains/catalogo-publico/pontos/pages/PontosTuristicosPage";
import { PontoTuristicoDetailsPage } from "@/domains/catalogo-publico/pontos/pages/PontoTuristicoDetailsPage";
import { CityDetailsPage } from "@/domains/cidades-institucional/pages/CityDetailsPage";
import { AboutPage } from "@/domains/institucional/pages/AboutPage";

import { AdminLoginPage } from "@/domains/admin-cms/auth/pages/AdminLoginPage";
import { AdminDashboardPage } from "@/domains/admin-cms/dashboard/pages/AdminDashboardPage";
import { AdminRouteGuard } from "@/domains/admin-cms/auth/guards/AdminRouteGuard";

import { AdminInstitutionalPage } from "@/domains/admin-cms/institutional/pages/AdminInstitutionalPage";
import { AdminSocialLinksPage } from "@/domains/admin-cms/social-links/pages/AdminSocialLinksPage";

import { AdminCitiesListPage } from "@/domains/admin-cms/cities/pages/AdminCitiesListPage";
import { AdminCityFormPage } from "@/domains/admin-cms/cities/pages/AdminCityFormPage";

import { AdminEventsListPage } from "@/domains/admin-cms/events/pages/AdminEventsListPage";
import { AdminEventFormPage } from "@/domains/admin-cms/events/pages/AdminEventFormPage";
import { AdminTouristPointsListPage } from "@/domains/admin-cms/tourist-points/pages/AdminTouristPointsListPage";
import { AdminTouristPointFormPage } from "@/domains/admin-cms/tourist-points/pages/AdminTouristPointFormPage";

import { AdminHomeBannersPage } from "@/domains/admin-cms/home-content/pages/AdminHomeBannersPage";
import { AdminHomeHighlightsPage } from "@/domains/admin-cms/home-content/pages/AdminHomeHighlightsPage";

// function PlaceholderPage({ title }: { title: string }): ReactElement {
//   return (
//     <div className="rounded-2xl border border-zinc-200 bg-white p-6">
//       <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
//       <p className="mt-2 text-sm text-zinc-600">
//         Esta tela será implementada na próxima etapa.
//       </p>
//     </div>
//   );
// }

export function AppRoutes(): ReactElement | null {
  return useRoutes([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "eventos", element: <EventosPage /> },
        { path: "eventos/:id", element: <EventoDetailsPage /> },
        { path: "pontos-turisticos", element: <PontosTuristicosPage /> },
        {
          path: "pontos-turisticos/:id",
          element: <PontoTuristicoDetailsPage />,
        },
        { path: "cidades/:slug", element: <CityDetailsPage /> },
        { path: "sobre", element: <AboutPage /> },
      ],
    },
    {
      path: "/admin",
      children: [
        {
          element: <AdminAuthLayout />,
          children: [{ path: "login", element: <AdminLoginPage /> }],
        },
        {
          element: <AdminRouteGuard />,
          children: [
            {
              element: <AdminLayout />,
              children: [
                { index: true, element: <AdminDashboardPage /> },
                {
                  path: "institucional",
                  element: <AdminInstitutionalPage />,
                },
                {
                  path: "home",
                  element: <Navigate to="/admin/home/banners" replace />,
                },
                {
                  path: "home/banners",
                  element: <AdminHomeBannersPage />,
                },
                {
                  path: "home/destaques",
                  element: <AdminHomeHighlightsPage />,
                },
                {
                  path: "midias-sociais",
                  element: <AdminSocialLinksPage />,
                },
                {
                  path: "cidades",
                  element: <AdminCitiesListPage />,
                },
                {
                  path: "cidades/nova",
                  element: <AdminCityFormPage />,
                },
                {
                  path: "cidades/:id/editar",
                  element: <AdminCityFormPage />,
                },
                {
                  path: "eventos",
                  element: <AdminEventsListPage />,
                },
                {
                  path: "eventos/novo",
                  element: <AdminEventFormPage />,
                },
                {
                  path: "eventos/:id/editar",
                  element: <AdminEventFormPage />,
                },
                {
                  path: "pontos-turisticos",
                  element: <AdminTouristPointsListPage />,
                },
                {
                  path: "pontos-turisticos/novo",
                  element: <AdminTouristPointFormPage />,
                },
                {
                  path: "pontos-turisticos/:id/editar",
                  element: <AdminTouristPointFormPage />,
                }
              ],
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
}
