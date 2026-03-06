import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEventosPublic } from "../context/eventosStore";
import { getCidadeSlugByNome } from "../features/home/utils/cidadeSlug";
import { Button, Card } from "../shared/ui";

export default function DetailsEventsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    state: {
      eventoSelecionado: evento,
      loading,
      error,
      cidade: cidadeDoEvento,
    },
    findById,
  } = useEventosPublic();

  const fetchEvento = useCallback(
    () =>
      (async () => {
        void findById(Number(id));
      })(),
    [id, findById],
  );

  useEffect(() => {
    fetchEvento();
  }, [id, fetchEvento]);

  return (
    <section
      aria-label="Detalhes do evento"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {loading ? (
        <Card className="p-6 text-sm text-slate-600">Carregando...</Card>
      ) : error ? (
        <Card className="p-6 text-sm text-red-600">{error}</Card>
      ) : evento ? (
        <>
          <h1 className="text-2xl font-extrabold mb-4">{evento.titulo}</h1>

          <img
            src={evento.img || "https://picsum.photos/800/450?blur=2"}
            alt={`Imagem do evento: ${evento.titulo}`}
            className="w-full h-64 object-cover rounded-2xl mb-4"
          />

          <div className="flex flex-wrap gap-3 mb-4">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold">
              {evento.cat}
            </span>
            <span className="text-sm text-slate-600">{evento.local}</span>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            {`Data: ${evento.data} • Horário: ${evento.hora} • Local: ${evento.local}`}
          </p>

          <p className="text-base text-slate-800">{evento.desc}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button variant="primary" onClick={() => navigate("/eventos")}>
              Ver lista de eventos
            </Button>
            {cidadeDoEvento ? (
              <Button
                variant="secondary"
                onClick={() => {
                  const slug = getCidadeSlugByNome(cidadeDoEvento.nome);
                  if (slug) navigate(`/cidades/${slug}`);
                }}
              >
                Ver cidade
              </Button>
            ) : null}
          </div>
        </>
      ) : (
        <Card className="p-6 text-sm text-slate-600">
          Evento não encontrado.
        </Card>
      )}
    </section>
  );
}
