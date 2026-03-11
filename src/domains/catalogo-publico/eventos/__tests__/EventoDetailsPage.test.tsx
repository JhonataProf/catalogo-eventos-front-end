import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventoDetailsPage } from "../pages/EventoDetailsPage";

vi.mock("@/services/tourism-api/client", () => ({
  tourismApiClient: {
    getEventoById: vi.fn(),
  },
}));

import { tourismApiClient } from "@/services/tourism-api/client";

function renderWithRoute(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/eventos/:id" element={<EventoDetailsPage />} />
        <Route path="/eventos" element={<div>Eventos fallback</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("EventoDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar loading inicial", () => {
    vi.mocked(tourismApiClient.getEventoById).mockImplementation(
      () => new Promise(() => undefined)
    );

    renderWithRoute("/eventos/evt-1");

    expect(screen.getByText("Carregando evento...")).toBeInTheDocument();
  });

  it("deve renderizar os dados do evento quando encontrado", async () => {
    vi.mocked(tourismApiClient.getEventoById).mockResolvedValue({
      id: "evt-1",
      cidadeId: "dourados",
      cidadeSlug: "dourados",
      nome: "Festival Gastronômico de Dourados",
      descricao: "Sabores regionais, música e experiências culturais.",
      categoria: "Gastronomia",
      dataInicio: "2026-03-20",
      dataFim: "2026-03-22",
      dataFormatada: "20 a 22 de março de 2026",
      local: "Parque dos Ipês",
      imagemPrincipal: "/images/highlights/festival-gastronomico.jpg",
      destaque: true,
    });

    renderWithRoute("/eventos/evt-1");

    expect(
      await screen.findByText("Festival Gastronômico de Dourados")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sabores regionais, música e experiências culturais.")
    ).toBeInTheDocument();

    expect(screen.getByText("20 a 22 de março de 2026")).toBeInTheDocument();
  });

  it("deve renderizar os links principais do evento", async () => {
    vi.mocked(tourismApiClient.getEventoById).mockResolvedValue({
      id: "evt-1",
      cidadeId: "dourados",
      cidadeSlug: "dourados",
      nome: "Festival Gastronômico de Dourados",
      descricao: "Sabores regionais, música e experiências culturais.",
      categoria: "Gastronomia",
      dataInicio: "2026-03-20",
      dataFim: "2026-03-22",
      dataFormatada: "20 a 22 de março de 2026",
      local: "Parque dos Ipês",
      imagemPrincipal: "/images/highlights/festival-gastronomico.jpg",
      destaque: true,
    });

    renderWithRoute("/eventos/evt-1");

    await screen.findByText("Festival Gastronômico de Dourados");

    expect(
      screen.getByRole("link", { name: "Ver cidade" })
    ).toHaveAttribute("href", "/cidades/dourados");

    expect(
      screen.getByRole("link", { name: "Voltar para eventos" })
    ).toHaveAttribute("href", "/eventos?cidade=dourados");
  });

  it("deve renderizar os cards informativos do evento", async () => {
    vi.mocked(tourismApiClient.getEventoById).mockResolvedValue({
      id: "evt-1",
      cidadeId: "dourados",
      cidadeSlug: "dourados",
      nome: "Festival Gastronômico de Dourados",
      descricao: "Sabores regionais, música e experiências culturais.",
      categoria: "Gastronomia",
      dataInicio: "2026-03-20",
      dataFim: "2026-03-22",
      dataFormatada: "20 a 22 de março de 2026",
      local: "Parque dos Ipês",
      imagemPrincipal: "/images/highlights/festival-gastronomico.jpg",
      destaque: true,
    });

    renderWithRoute("/eventos/evt-1");

    await screen.findByText("Festival Gastronômico de Dourados");

    expect(screen.getByText("Informações do evento")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Cidade")).toBeInTheDocument();
    expect(screen.getByText("Local")).toBeInTheDocument();
  });

  it("deve redirecionar para /eventos quando o evento não existir", async () => {
    vi.mocked(tourismApiClient.getEventoById).mockResolvedValue(null);

    renderWithRoute("/eventos/evento-inexistente");

    await waitFor(() => {
      expect(screen.getByText("Eventos fallback")).toBeInTheDocument();
    });
  });
});