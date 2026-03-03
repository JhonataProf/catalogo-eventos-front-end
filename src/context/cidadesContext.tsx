import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { Cidade, PontoTuristico } from "../domain";
import { createCidadeApi, deleteCidadeApi, updateCidadeApi } from "../bff/appBff";
import { CidadesContext, type CidadesContextValue } from "./cidadesStore";

const LS_KEY = "douradosplus-cidades-v1";

function loadFromStorage(): { cidades: Cidade[]; pontos: PontoTuristico[] } | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { cidades: Cidade[]; pontos: PontoTuristico[] };
  } catch {
    return null;
  }
}

export const CidadesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const initial = typeof window === "undefined" ? null : loadFromStorage();

  const [cidades, setCidades] = useState<Cidade[]>(() => initial?.cidades ?? []);
  const [pontos, setPontos] = useState<PontoTuristico[]>(() => initial?.pontos ?? []);

  const [loading, setLoading] = useState(cidades.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_KEY, JSON.stringify({ cidades, pontos }));
  }, [cidades, pontos]);

  const refreshCidades = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
    //   const data = await fetchAppState();
    //   setCidades(data.cidades ?? []);
    //   setPontos(data.pontos ?? []);
    } catch (e) {
      console.error(e);
      setError("Não foi possível carregar cidades/pontos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (cidades.length > 0) return;
    refreshCidades();
  }, [cidades.length, refreshCidades]);

  const createOrUpdateCidade: CidadesContextValue["createOrUpdateCidade"] = useCallback(
    async (cidadeInput) => {
      setError(null);

      const isUpdate = Boolean(cidadeInput.id);
      const id = cidadeInput.id ?? crypto.randomUUID();

      const payloadBase = {
        id,
        nome: cidadeInput.nome,
        uf: cidadeInput.uf || "MS",
        desc: cidadeInput.desc ?? "",
      };

      try {
        // mantém pontos/eventos existentes localmente
        const existing = cidades.find((c) => c.id === id);
        const payload: Cidade = {
          ...payloadBase,
          pontos: existing?.pontos ?? [],
          eventos: existing?.eventos ?? [],
        };

        const saved = isUpdate ? await updateCidadeApi(payload) : await createCidadeApi(payloadBase as unknown as Omit<Cidade, "id">);

        setCidades((prev) => {
          const copy = [...prev];
          const idx = copy.findIndex((c) => c.id === id);
          if (idx >= 0) copy[idx] = { ...copy[idx], ...saved };
          else copy.push(saved);
          return copy;
        });
      } catch (e) {
        console.error(e);
        setError("Não foi possível salvar a cidade.");
      }
    },
    [cidades]
  );

  const deleteCidade: CidadesContextValue["deleteCidade"] = useCallback(async (id) => {
    setError(null);
    try {
      await deleteCidadeApi(id);
      setCidades((prev) => prev.filter((c) => c.id !== id));
      // opcional: também remover pontos relacionados do array "pontos"
      setPontos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
      setError("Não foi possível excluir a cidade.");
    }
  }, []);

  const createOrUpdatePonto: CidadesContextValue["createOrUpdatePonto"] = useCallback((cidadeId, ponto) => {
    const id = ponto.id ?? crypto.randomUUID();
    const novo: PontoTuristico = { ...ponto, id, destaque: ponto.destaque ?? false };

    setCidades((prev) =>
      prev.map((c) => {
        if (c.id !== cidadeId) return c;
        const idx = c.pontos.findIndex((p) => p.id === id);
        const pontosCidade = idx >= 0 ? c.pontos.map((p) => (p.id === id ? novo : p)) : [...c.pontos, novo];
        return { ...c, pontos: pontosCidade };
      })
    );

    // manter lista flat também (útil pra banner)
    setPontos((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = novo;
        return copy;
      }
      return [...prev, novo];
    });
  }, []);

  const deletePonto: CidadesContextValue["deletePonto"] = useCallback((cidadeId, pontoId) => {
    setCidades((prev) =>
      prev.map((c) => (c.id === cidadeId ? { ...c, pontos: c.pontos.filter((p) => p.id !== pontoId) } : c))
    );
    setPontos((prev) => prev.filter((p) => p.id !== pontoId));
  }, []);

  const value = useMemo<CidadesContextValue>(
    () => ({
      cidades,
      pontos,
      loading,
      error,
      createOrUpdateCidade,
      deleteCidade,
      createOrUpdatePonto,
      deletePonto,
      refreshCidades,
    }),
    [cidades, pontos, loading, error, createOrUpdateCidade, deleteCidade, createOrUpdatePonto, deletePonto, refreshCidades]
  );

  return <CidadesContext.Provider value={value}>{children}</CidadesContext.Provider>;
};