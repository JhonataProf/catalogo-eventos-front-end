import { useMemo, useState } from "react";
import type { Cidade, PontoTuristico } from "../domain";
import { Button, Card } from "../shared/ui";
import { useAppData } from "../context/appDataContext";

interface TourismSectionProps {
  cidades: Cidade[];
  cidadeSelecionada: Cidade | null;
  cidadeSelecionadaId: string | null;
  onCidadeSelecionadaChange: (id: string | null) => void;

  buscaPonto: string;
  onBuscaPontoChange: (value: string) => void;
  pontosFiltrados: PontoTuristico[];

  onNovoPonto: () => void;
  onEditarCidade: (cidade: Cidade) => void;
  onEditarPonto: (ponto: PontoTuristico) => void;
  onExcluirPonto: (pontoId: string) => void;
  onIrParaCidades: () => void;
}

const TourismPage: React.FC = () => {
  const {
    state: { cidades },
  } = useAppData();

  const [buscaPonto, setBuscaPonto] = useState("");
  const [pontoEdit, setPontoEdit] = useState<PontoTuristico | null>(null);
  const [pontoCidadeId, setPontoCidadeId] = useState<string | null>(null);
  const [cidadeEdit, setCidadeEdit] = useState<Cidade | null>(null);

  const [cidadeSelecionadaId, setCidadeSelecionadaId] = useState<string | null>(
    () => cidades[0]?.id ?? null,
  );

  const cidadeSelecionada =
    cidades.find((c) => c.id === cidadeSelecionadaId) ?? cidades[0];

  const pontosFiltrados = useMemo(() => {
    if (!cidadeSelecionada) return [];
    const q = buscaPonto.toLowerCase();
    return cidadeSelecionada.pontos.filter((p) =>
      `${p.nome} ${p.tipo}`.toLowerCase().includes(q),
    );
  }, [buscaPonto, cidadeSelecionada]);

  const onNovoPonto = () => {
    if (!cidadeSelecionada) {
      window.alert("Selecione uma cidade primeiro.");
      return;
    }
    setPontoCidadeId(cidadeSelecionada.id);
    setPontoEdit({} as PontoTuristico);
  };

  return (
    <section
      aria-label="Pontos turísticos"
      className="mt-4 grid gap-4 lg:grid-cols-3"
    >
      {/* esquerda: filtros + lista */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            <label className="flex-1 text-sm flex flex-col gap-1">
              <span>Cidade</span>
              <select
                className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-sm outline-none"
                value={cidadeSelecionadaId ?? ""}
                onChange={(e) => setCidadeSelecionadaId(e.target.value)}
              >
                {cidades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} - {c.uf}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1 text-sm flex flex-col gap-1">
              <span>Buscar ponto</span>
              <input
                className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm outline-none"
                placeholder="Ex.: Parque, Museu…"
                value={buscaPonto}
                onChange={(e) => setBuscaPonto(e.target.value)}
              />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={onNovoPonto}>
              + Novo ponto turístico
            </Button>
            {cidadeSelecionada && (
              <Button
                size="sm"
                onClick={() => setCidadeEdit(cidadeSelecionada)}
              >
                Editar cidade atual
              </Button>
            )}
            <Button size="sm" onClick={() => {}}>
              Gerenciar cidades
            </Button>
          </div>
        </Card>

        {/* lista de pontos */}
        <div className="grid gap-4 md:grid-cols-2">
          {pontosFiltrados.length === 0 ? (
            <Card className="p-4 text-sm text-[#9fb0c8] md:col-span-2">
              Nenhum ponto encontrado para esta cidade.
            </Card>
          ) : (
            pontosFiltrados.map((p) => (
              <Card key={p.id} className="overflow-hidden flex flex-col">
                <img
                  src={p.img || ""}
                  alt="Imagem do ponto turístico"
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://picsum.photos/800/450?blur=2";
                  }}
                />
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 font-semibold">
                      {p.tipo || "Ponto"}
                    </span>
                    {cidadeSelecionada && (
                      <span className="text-[#9fb0c8]">
                        {cidadeSelecionada.nome}/{cidadeSelecionada.uf}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold">{p.nome}</h3>
                  <p className="text-xs text-[#9fb0c8]">
                    Horário: {p.horario || "—"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <Button size="sm" onClick={() => {}}>
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {}}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* direita: cards informativos */}
      <div className="flex flex-col gap-4">
        <Card className="p-4">
          <h3 className="text-base font-extrabold mb-1">Sobre</h3>
          <p className="text-xs text-[#9fb0c8]">
            Cadastre e gerencie pontos turísticos de Dourados e de outras
            cidades da região para montar um guia completo.
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-base font-extrabold mb-1">Próximos passos</h3>
          <p className="text-xs text-[#9fb0c8]">
            Em versões futuras você pode incluir avaliações dos usuários, tags
            temáticas (gastronomia, aventura, família) e rotas sugeridas.
          </p>
        </Card>
      </div>
    </section>
  );
};

export default TourismPage;
