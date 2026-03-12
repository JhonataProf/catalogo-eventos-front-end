import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "../SiteFooter";

describe("SiteFooter", () => {
  it("deve renderizar o nome e descrição do portal", () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>
    );

    expect(screen.getByText("Celeiro do MS")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Plataforma para divulgação de eventos, cidades e pontos turísticos da região."
      )
    ).toBeInTheDocument();
  });

  it("deve renderizar os links de navegação", () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Eventos" })).toHaveAttribute(
      "href",
      "/eventos"
    );

    expect(
      screen.getByRole("link", { name: "Pontos turísticos" })
    ).toHaveAttribute("href", "/pontos-turisticos");

    expect(screen.getByRole("link", { name: "Cidades" })).toHaveAttribute(
      "href",
      "/cidades/dourados"
    );
  });

  it("deve renderizar os links de mídias sociais", () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "YouTube" })).toBeInTheDocument();
  });

  it("deve renderizar a seção de créditos", () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>
    );

    expect(screen.getByText("Créditos")).toBeInTheDocument();

    expect(
      screen.getByText(/Desenvolvido para divulgação regional/i)
    ).toBeInTheDocument();
  });
});