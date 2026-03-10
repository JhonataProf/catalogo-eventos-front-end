// import { useCallback } from "react";
// import { listEventos } from "../bff/appBff";
// import type { Evento } from "../domain";
// import { usePaginatedResource } from "../shared/hooks/usePaginatedResource";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  RoundedSelect,
  SectionHeader,
  TextField,
} from "../shared/ui";
import { useEventosPublic } from "../context/eventosStore";
import { useEffect } from "react";

// type EmptyQuery = Record<string, never>;

export default function EventosPage() {
  const navigate = useNavigate();

  const {
    state: { search, category, error, loading },
    categoryOptions,
    filtrados,
    setSearch,
    setCategory,
    reset,
    fetchFirstPage,
    canLoadMore,
    loadMore
  } = useEventosPublic();

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        kicker="Eventos"
        tone="primary"
        description="Paginação incremental com filtros locais."
      >
        Agenda de eventos
      </SectionHeader>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <TextField
            label="Buscar"
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-col gap-1 text-sm">
            <label className="font-medium">Categoria</label>
            <RoundedSelect
              value={category || ""}
              onChange={setCategory}
              options={categoryOptions}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
          >
            Limpar filtros
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset();
              void loadMore();
            }}
          >
            Recarregar
          </Button>

          <div className="ml-auto text-xs text-slate-500">
            {filtrados.length} exibido(s)
          </div>
        </div>
      </Card>

      {error ? <Card className="p-6 text-sm text-red-600">{error}</Card> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((ev) => (
          <Card key={ev.id} className="p-4">
            <h3 className="font-semibold">{ev.titulo}</h3>
            <p className="text-sm text-slate-600">{ev.local}</p>
            <div className="mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/eventos/${ev.id}`)}
              >
                Ver detalhes
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        {canLoadMore ? (
          <Button variant="primary" onClick={loadMore} disabled={loading}>
            {loading ? "Carregando..." : "Carregar mais"}
          </Button>
        ) : (
          <p className="text-xs text-slate-500">Você chegou ao final.</p>
        )}
      </div>
    </div>
  );
}
