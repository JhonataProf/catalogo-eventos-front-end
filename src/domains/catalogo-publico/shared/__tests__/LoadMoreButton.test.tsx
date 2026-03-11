import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadMoreButton } from "../components/LoadMoreButton";

describe("LoadMoreButton", () => {
  it("deve mostrar 'Carregar mais' quando não estiver carregando", () => {
    render(<LoadMoreButton isLoading={false} onClick={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /carregar mais/i })
    ).toBeInTheDocument();
  });

  it("deve mostrar 'Carregando...' quando estiver carregando", () => {
    render(<LoadMoreButton isLoading={true} onClick={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /carregando/i })
    ).toBeInTheDocument();
  });
});