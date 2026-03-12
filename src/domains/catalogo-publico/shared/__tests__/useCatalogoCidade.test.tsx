import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useCatalogoCidade } from "../hooks/useCatalogoCidade";

function createWrapper(initialEntry: string = "/eventos") {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>;
  };
}

describe("useCatalogoCidade", () => {
  it("deve usar dourados como fallback quando não houver cidade na url", () => {
    const { result } = renderHook(() => useCatalogoCidade(), {
      wrapper: createWrapper("/eventos"),
    });

    expect(result.current.cidadeSlug).toBe("dourados");
    expect(result.current.cidadeNome).toBe("Dourados");
  });

  it("deve usar a cidade da url quando ela for válida", () => {
    const { result } = renderHook(() => useCatalogoCidade(), {
      wrapper: createWrapper("/eventos?cidade=itapora"),
    });

    expect(result.current.cidadeSlug).toBe("itapora");
    expect(result.current.cidadeNome).toBe("Itaporã");
  });

  it("deve normalizar cidade inválida para dourados", () => {
    const { result } = renderHook(() => useCatalogoCidade(), {
      wrapper: createWrapper("/eventos?cidade=inexistente"),
    });

    expect(result.current.cidadeSlug).toBe("dourados");
    expect(result.current.cidadeNome).toBe("Dourados");
  });

  it("deve permitir alterar a cidade via setCidadeSlug", () => {
    const { result } = renderHook(() => useCatalogoCidade(), {
      wrapper: createWrapper("/eventos"),
    });

    act(() => {
      result.current.setCidadeSlug("maracaju");
    });

    expect(result.current.cidadeSlug).toBe("maracaju");
    expect(result.current.cidadeNome).toBe("Maracaju");
  });
});