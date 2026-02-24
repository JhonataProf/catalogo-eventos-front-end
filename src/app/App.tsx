

import React from "react";
import { AppRoutes, type RouteConfig } from "./routes";
import { AppDataProvider } from "../context/appDataContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

export const App: React.FC = () => {
  return (
    <AppDataProvider>
      <Router>
        <Routes>{renderRoutes(AppRoutes)}</Routes>
      </Router>
    </AppDataProvider>
  );
};

