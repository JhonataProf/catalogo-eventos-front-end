import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomeHeroCarousel } from "../HomeHeroCarousel";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("HomeHeroCarousel", () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve renderizar o primeiro destaque inicialmente", () => {
    render(
      <MemoryRouter>
        <HomeHeroCarousel />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Festival Gastronômico de Dourados"),
    ).toBeInTheDocument();

    expect(screen.getByText("1/3")).toBeInTheDocument();
  });

  it("deve navegar para o próximo item ao clicar em Próximo", () => {
    render(
      <MemoryRouter>
        <HomeHeroCarousel />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

    expect(screen.getByAltText("Parque Antenor Martins")).toBeInTheDocument();

    expect(screen.getByTestId("carousel-counter")).toHaveTextContent("2/3");
  });

  it("deve navegar para o item correspondente ao clicar no indicador", () => {
    render(
      <MemoryRouter>
        <HomeHeroCarousel />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ir para destaque 3" }));

    expect(
      screen.getByAltText("Mostra de Música Regional"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("carousel-counter")).toHaveTextContent("3/3");
  });

  it("deve acionar navegação ao clicar em Ver detalhes", () => {
    render(
      <MemoryRouter>
        <HomeHeroCarousel />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ver detalhes" }));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/eventos/evt-1");
  });

  it("deve avançar automaticamente com o tempo", async () => {
    vi.useFakeTimers();

    render(
      <MemoryRouter>
        <HomeHeroCarousel />
      </MemoryRouter>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4501);
    });

    expect(screen.getByAltText("Parque Antenor Martins")).toBeInTheDocument();

    expect(screen.getByTestId("carousel-counter")).toHaveTextContent("2/3");

    vi.useRealTimers();
  });
});
