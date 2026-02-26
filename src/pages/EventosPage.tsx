import { use, useMemo, useState } from "react";
import { useAppData } from "../context/appDataContext";
import type { Evento } from "../domain";
import { Button, Card, Tag, TextField } from "../shared/ui";
import { RoundedSelect } from "../shared/ui/RoundedSelect";
import { useNavigate } from "react-router-dom";

const EventosPage = () => {

  const navigate = useNavigate();
  const {
      state: { cidades },
    } = useAppData();
  
    const [buscarEvento, setBuscarEvento] = useState("");
  
    const [cidadeSelecionadaId, setCidadeSelecionadaId] = useState<string | null>(
      () => cidades[0]?.id ?? null,
    );
  
    const cidadeSelecionada =
      cidades.find((c) => c.id === cidadeSelecionadaId) ?? cidades[0];
  
    const eventosFiltrados = useMemo(() => {
      if (!cidadeSelecionada) return [];
      const q = buscarEvento.toLowerCase();
      return cidadeSelecionada.eventos.filter((e: Evento) =>
        `${e.titulo} ${e.cat}`.toLowerCase().includes(q),
      );
    }, [buscarEvento, cidadeSelecionada]);
    
  return (
    <section
          aria-label="Eventos"
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* esquerda: filtros + lista */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className="w-full p-4">
              <div className="w-full flex flex-col md:flex-row gap-3 items-start md:items-center">
                <RoundedSelect
                  value={cidadeSelecionadaId ?? ""}
                  onChange={(value) => setCidadeSelecionadaId(value)}
                  label={"Cidade"}
                  options={cidades.map((c) => ({
                    value: c.id,
                    label: `${c.nome} - ${c.uf}`,
                  }))}
                />
                <TextField
                  label="Buscar ponto turístico"
                  containerClassName="w-full"
                  className="rounded-xl border border-blue-400 bg-white/10 px-3 py-2 text-sm outline-none"
                  placeholder="Ex.: Parque, Museu…"
                  value={buscarEvento}
                  onChange={(e) => setBuscarEvento(e.target.value)}
                />
              </div>
            </Card>
    
            {/* lista de pontos */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4 items-stretch">
              {eventosFiltrados.length === 0 ? (
                <Card className="p-4 text-sm text-[#9fb0c8] md:col-span-2">
                  Nenhum ponto encontrado para esta cidade.
                </Card>
              ) : (
                eventosFiltrados.map((e) => (
                  <Card key={e.id} className="h-full overflow-hidden flex flex-col">
                    <img
                      src={e.img || ""}
                      alt="Imagem do evento"
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://picsum.photos/800/450?blur=2";
                      }}
                    />
                    <div className="p-4 flex-1 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 font-semibold">
                          {e.cat || "Evento"}
                        </span>
                        {cidadeSelecionada && (
                          <span className="text-[#9fb0c8]">
                            {cidadeSelecionada.nome}/{cidadeSelecionada.uf}
                          </span>
                        )}
                      </div>
                      <h3 className="gap-4 pb-2 text-base font-extrabold">{e.titulo}</h3>
                      <div className="flex flex-wrap gap-4">
                      <Tag variant="default">data: {e.data || "—"}</Tag>
                      <Tag variant="default">Horário: {e.hora || "—"}</Tag>
                      <Tag variant="default">local: {e.local || "—"}</Tag>
                      </div>
                      <Button variant="primary" size="lg" onClick={() => navigate(`/eventos/${e.id}`)}>
                        Ver detalhes
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>
  );
};

export default EventosPage;
