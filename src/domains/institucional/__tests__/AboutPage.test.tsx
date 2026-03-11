import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AboutPage } from "../pages/AboutPage";

describe("AboutPage", () => {
  it("deve renderizar o título principal da página", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Sobre o Celeiro do MS")
    ).toBeInTheDocument();
  });

  it("deve renderizar as seções institucionais principais", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Missão")).toBeInTheDocument();
    expect(screen.getByText("Visão")).toBeInTheDocument();
    expect(screen.getByText("Valores")).toBeInTheDocument();
  });

  it("deve renderizar os blocos de propósito institucional", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Divulgação regional integrada")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Valorização do território")
    ).toBeInTheDocument();
  });
});