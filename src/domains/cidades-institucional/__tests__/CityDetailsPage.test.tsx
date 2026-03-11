import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { CityDetailsPage } from "../pages/CityDetailsPage";

function renderWithRoute(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/cidades/:slug" element={<CityDetailsPage />} />
        <Route path="/" element={<div>Home fallback</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("CityDetailsPage", () => {
  it("deve renderizar os dados da cidade quando o slug for válido", () => {
    renderWithRoute("/cidades/dourados");

    expect(screen.getByText("Dourados")).toBeInTheDocument();
    expect(screen.getByText("Cidade do Celeiro do MS")).toBeInTheDocument();
  });

  it("deve renderizar os blocos institucionais da cidade", () => {
    renderWithRoute("/cidades/dourados");

    expect(screen.getByText("Identidade local")).toBeInTheDocument();
    expect(screen.getByText("Eventos e agenda")).toBeInTheDocument();
    expect(screen.getByText("Atrativos e descoberta")).toBeInTheDocument();
  });

  it("deve renderizar os links para eventos e pontos turísticos da cidade", () => {
    renderWithRoute("/cidades/dourados");

    expect(
      screen.getByRole("link", { name: "Ver eventos da cidade" })
    ).toHaveAttribute("href", "/eventos?cidade=dourados");

    expect(
      screen.getByRole("link", { name: "Ver pontos turísticos" })
    ).toHaveAttribute("href", "/pontos-turisticos?cidade=dourados");
  });

  it("deve redirecionar para home quando o slug for inválido", () => {
    renderWithRoute("/cidades/cidade-inexistente");

    expect(screen.getByText("Home fallback")).toBeInTheDocument();
  });
});