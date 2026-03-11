import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PontoTuristicoDetailsPage } from "../pages/PontoTuristicoDetailsPage";

vi.mock("@/services/tourism-api/client", () => ({
  tourismApiClient: {
    getPontoById: vi.fn(),
  },
}));

import { tourismApiClient } from "@/services/tourism-api/client";

function renderWithRoute(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/pontos-turisticos/:id"
          element={<PontoTuristicoDetailsPage />}
        />
        <Route
          path="/pontos-turisticos"
          element={<div>Pontos fallback</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("PontoTuristicoDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar loading inicial", () => {
    vi.mocked(tourismApiClient.getPontoById).mockImplementation(
      () => new Promise(() => undefined)
    );

    renderWithRoute("/pontos-turisticos/pto-1");

    expect(
      screen.getByText("Carregando ponto turístico...")
    ).toBeInTheDocument();
  });

  it("deve renderizar os dados do ponto turístico quando encontrado", async () => {
    vi.mocked(tourismApiClient.getPontoById).mockResolvedValue({
      id: "pto-1",
      cidadeId: "dourados",
      cidadeSlug: "dourados",
      nome: "Parque Antenor Martins",
      descricao: "Área verde com lago, pista de caminhada e espaço de lazer.",
      categoria: "Natureza",
      endereco: "Rua Antônio Emílio de Figueiredo",
      horarioFuncionamento: "Todos os dias",
      imagemPrincipal: "/images/highlights/parque-antenor-martins.jpg",
      destaque: true,
    });

    renderWithRoute("/pontos-turisticos/pto-1");

    expect(
      await screen.findByText("Parque Antenor Martins")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Área verde com lago, pista de caminhada e espaço de lazer.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Rua Antônio Emílio de Figueiredo")
    ).toBeInTheDocument();
  });

  it("deve renderizar os links principais do ponto turístico", async () => {
    vi.mocked(tourismApiClient.getPontoById).mockResolvedValue({
      id: "pto-1",
      cidadeId: "dourados",
      cidadeSlug: "dourados",
      nome: "Parque Antenor Martins",
      descricao: "Área verde com lago, pista de caminhada e espaço de lazer.",
      categoria: "Natureza",
      endereco: "Rua Antônio Emílio de Figueiredo",
      horarioFuncionamento: "Todos os dias",
      imagemPrincipal: "/images/highlights/parque-antenor-martins.jpg",
      destaque: true,
    });

    renderWithRoute("/pontos-turisticos/pto-1");

    await screen.findByText("Parque Antenor Martins");

    expect(
      screen.getByRole("link", { name: "Ver cidade" })
    ).toHaveAttribute("href", "/cidades/dourados");

    expect(
      screen.getByRole("link", { name: "Voltar para pontos turísticos" })
    ).toHaveAttribute("href", "/pontos-turisticos?cidade=dourados");
  });

  it("deve renderizar os cards informativos do ponto turístico", async () => {
    vi.mocked(tourismApiClient.getPontoById).mockResolvedValue({
      id: "pto-1",
      cidadeId: "dourados",
      cidadeSlug: "dourados",
      nome: "Parque Antenor Martins",
      descricao: "Área verde com lago, pista de caminhada e espaço de lazer.",
      categoria: "Natureza",
      endereco: "Rua Antônio Emílio de Figueiredo",
      horarioFuncionamento: "Todos os dias",
      imagemPrincipal: "/images/highlights/parque-antenor-martins.jpg",
      destaque: true,
    });

    renderWithRoute("/pontos-turisticos/pto-1");

    await screen.findByText("Parque Antenor Martins");

    expect(screen.getByText("Informações do atrativo")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Cidade")).toBeInTheDocument();
    expect(screen.getByText("Funcionamento")).toBeInTheDocument();
  });

  it("deve redirecionar para /pontos-turisticos quando o ponto não existir", async () => {
    vi.mocked(tourismApiClient.getPontoById).mockResolvedValue(null);

    renderWithRoute("/pontos-turisticos/ponto-inexistente");

    await waitFor(() => {
      expect(screen.getByText("Pontos fallback")).toBeInTheDocument();
    });
  });
});