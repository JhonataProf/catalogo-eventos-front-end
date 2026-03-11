import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppRoutes } from "../routes";

vi.mock("@/shell/public/layouts/PublicLayout", () => ({
  PublicLayout: () => (
    <div data-testid="public-layout">
      Public Layout
      <Outlet />
    </div>
  ),
}));

vi.mock("@/domains/home-institucional/pages/HomePage", () => ({
  HomePage: () => <div>Home mock</div>,
}));

vi.mock("@/domains/catalogo-publico/eventos/pages/EventosPage", () => ({
  EventosPage: () => <div>Eventos mock</div>,
}));

vi.mock("@/domains/catalogo-publico/eventos/pages/EventoDetailsPage", () => ({
  EventoDetailsPage: () => <div>Evento Details mock</div>,
}));

vi.mock(
  "@/domains/catalogo-publico/pontos/pages/PontosTuristicosPage",
  () => ({
    PontosTuristicosPage: () => <div>Pontos mock</div>,
  })
);

vi.mock(
  "@/domains/catalogo-publico/pontos/pages/PontoTuristicoDetailsPage",
  () => ({
    PontoTuristicoDetailsPage: () => <div>Ponto Details mock</div>,
  })
);

vi.mock("@/domains/cidades-institucional/pages/CityDetailsPage", () => ({
  CityDetailsPage: () => <div>Cidade Details mock</div>,
}));

vi.mock("@/domains/institucional/pages/AboutPage", () => ({
  AboutPage: () => <div>Sobre mock</div>,
}));

describe("AppRoutes", () => {
  it("deve renderizar a rota home", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Home mock")).toBeInTheDocument();
  });

  it("deve renderizar a rota de eventos", () => {
    render(
      <MemoryRouter initialEntries={["/eventos"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Eventos mock")).toBeInTheDocument();
  });

  it("deve renderizar a rota de detalhe de evento", () => {
    render(
      <MemoryRouter initialEntries={["/eventos/evt-1"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Evento Details mock")).toBeInTheDocument();
  });

  it("deve renderizar a rota de pontos turísticos", () => {
    render(
      <MemoryRouter initialEntries={["/pontos-turisticos"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Pontos mock")).toBeInTheDocument();
  });

  it("deve renderizar a rota de detalhe de ponto turístico", () => {
    render(
      <MemoryRouter initialEntries={["/pontos-turisticos/pto-1"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Ponto Details mock")).toBeInTheDocument();
  });

  it("deve renderizar a rota sobre", () => {
    render(
      <MemoryRouter initialEntries={["/sobre"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Sobre mock")).toBeInTheDocument();
  });

  it("deve renderizar a rota de detalhe de cidade", () => {
    render(
      <MemoryRouter initialEntries={["/cidades/dourados"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Cidade Details mock")).toBeInTheDocument();
  });

  it("deve redirecionar rota desconhecida para home", () => {
    render(
      <MemoryRouter initialEntries={["/rota-inexistente"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Home mock")).toBeInTheDocument();
  });
});