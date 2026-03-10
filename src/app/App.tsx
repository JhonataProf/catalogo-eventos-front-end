// src/app/App.tsx
import {
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";
import { CidadesProvider } from "../context/cidadesContext";
import { EventosProvider } from "../context/eventosContext";
import { ConfirmProvider } from "../shared/ui/confirm/ConfirmProvider";
import { AppRoutes } from "./routes";
import { PontosProvider } from "../context/pontosContext";

function toRRRoutes(routes: typeof AppRoutes): RouteObject[] {
  return routes.map((r) => ({
    path: r.path,
    element: r.element,
    children: r.children ? toRRRoutes(r.children) : undefined,
  }));
}

const router = createBrowserRouter(toRRRoutes(AppRoutes));

export default function App() {
  return (
    <ConfirmProvider>
      <CidadesProvider>
        <EventosProvider>
          <PontosProvider>
            <RouterProvider router={router} />
          </PontosProvider>
        </EventosProvider>
      </CidadesProvider>
    </ConfirmProvider>
  );
}
