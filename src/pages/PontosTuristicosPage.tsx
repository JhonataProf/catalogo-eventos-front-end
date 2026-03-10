import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCidadesPublic } from "../context/cidadesStore";
import {
  usePontosPublic,
  type PontosQuery,
  type PontoView,
} from "../context/pontosStore";
import type { Cidade } from "../domain";
import {
  Button,
  Card,
  RoundedSelect,
  SectionHeader,
  Tag,
  TextField,
} from "../shared/ui";

const FALLBACK_IMG = "https://picsum.photos/900/520?blur=1";

function PontoCard({
  item,
  onOpen,
}: {
  item: PontoView;
  onOpen: (id: number) => void;
}) {
  const { ponto, cidadeLabel } = item;

  return (
    <Card as="article" className="overflow-hidden">
      <img
        src={ponto.img || FALLBACK_IMG}
        alt={
          ponto.nome
            ? `Imagem do ponto: ${ponto.nome}`
            : "Imagem do ponto turístico"
        }
        className="h-44 w-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
        }}
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
              {ponto.nome}
            </h3>

            <p className="mt-1 text-sm text-slate-600 line-clamp-1">
              {[cidadeLabel, ponto.horario].filter(Boolean).join(" • ")}
            </p>

            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              {ponto.desc}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <Tag variant={ponto.destaque ? "warning" : "success"}>
              {ponto.tipo}
            </Tag>
            {ponto.destaque ? <Tag variant="warning">Destaque</Tag> : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" size="sm" onClick={() => onOpen(ponto.id)}>
            Ver detalhes
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function PontosTuristicosPage() {
  const navigate = useNavigate();

  const {
    state: { items: cidades },
  } = useCidadesPublic();
  const {
    state: { items: pontos, loading, error, page },
    query: { cidadeId, search, tipo },
    setQuery,
    canLoadMore,
    reset,
    fetchPage,
    fetchFirstPage,
  } = usePontosPublic();

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  const cidadesMap = useMemo(() => {
    return new Map<number, Cidade>(cidades.map((c) => [c.id, c]));
  }, [cidades]);

  const cidadeOptions = useMemo(() => {
    return [
      { value: "", label: "Todas as cidades" },
      ...cidades.map((c) => ({
        value: String(c.id),
        label: `${c.nome} / ${c.uf}`,
      })),
    ];
  }, [cidades]);

  const handleQuery = async (query: PontosQuery): Promise<void> => {
    void setQuery(query);
    fetchPage(page, { cidadeId, search, tipo });
  };

  // ====== ViewModels (para UI) ======
  const pontosView = useMemo<PontoView[]>(() => {
    return (pontos ?? []).map((p) => {
      const c = cidadesMap.get(p.cidadeId);
      const cidadeLabel = c ? `${c.nome} / ${c.uf}` : "";
      return { ponto: p, cidadeLabel };
    });
  }, [pontos, cidadesMap]);

  const tipoOptions = useMemo(() => {
    const types = Array.from(
      new Set(pontosView.map((x) => x.ponto.tipo).filter(Boolean)),
    ).sort();
    return [
      { value: "", label: "Todos os tipos" },
      ...types.map((t) => ({ value: t, label: t })),
    ];
  }, [pontosView]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        kicker="Turismo"
        tone="success"
        description="Paginação incremental (load more) + filtro por cidade no backend."
      >
        Pontos turísticos
      </SectionHeader>

      {/* filtros */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <TextField
            label="Buscar"
            placeholder="Ex: parque, museu, praça..."
            value={search}
            onChange={(e) => handleQuery({ search: e.target.value })}
          />

          <div className="flex flex-col gap-1 text-sm">
            <label className="font-medium">Cidade</label>
            <RoundedSelect
              value={cidadeId ? String(cidadeId) : ""}
              onChange={(v) =>
                handleQuery({ cidadeId: v ? Number(v) : undefined })
              }
              options={cidadeOptions}
              placeholder={loading ? "Carregando..." : "Todas"}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <label className="font-medium">Tipo</label>
            <RoundedSelect
              value={tipo}
              onChange={(e) =>
                handleQuery({
                  tipo: e as unknown as "museu" | "parque" | "praça",
                })
              }
              options={tipoOptions}
              placeholder="Todos"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              handleQuery({ search: "", tipo: "", cidadeId: undefined });
            }}
          >
            Limpar filtros
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset();
              fetchPage(page, { cidadeId, search, tipo });
            }}
          >
            Recarregar
          </Button>

          <div className="ml-auto text-xs text-slate-500">
            {pontos.length} exibido(s)
          </div>
        </div>
      </Card>

      {/* erros/empty */}
      {error ? <Card className="p-6 text-sm text-red-600">{error}</Card> : null}

      {pontos.length === 0 && !loading ? (
        <Card className="p-6 text-sm text-slate-600">
          Nenhum ponto turístico encontrado.
        </Card>
      ) : null}

      {/* grid */}
      {pontosView.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pontosView.map((pontoView) => (
            <PontoCard
              key={pontoView.ponto.id}
              item={pontoView}
              onOpen={(id) => navigate(`/pontos-turisticos/${id}`)}
            />
          ))}
        </div>
      ) : null}

      {/* load more */}
      <div className="flex justify-center">
        {canLoadMore ? (
          <Button
            variant="primary"
            onClick={() => {
              const nextPage = page + 1;
              fetchPage(nextPage, { cidadeId, search, tipo });
            }}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Carregar mais"}
          </Button>
        ) : (
          <p className="text-xs text-slate-500">Você chegou ao final.</p>
        )}
      </div>
    </div>
  );
}
