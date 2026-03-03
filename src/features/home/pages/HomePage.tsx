import { useMemo } from "react";
import { SectionHeader, Card } from "../../../shared/ui";
import { useEventosStore } from "../../../context/eventosStore";
import { useCidadesStore } from "../../../context/cidadesStore";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { CitiesGrid } from "../components/CitiesGrid";
import { cidadesCeleiro } from "../data/cidadesCeleiro";

export default function HomePage() {
  const { eventos, loading: loadingEventos } = useEventosStore();
  const { cidades, pontos, loading: loadingCidades } = useCidadesStore();

  const hasHighlights = useMemo(() => {
    const e = (eventos ?? []).some((x) => x.destaque);
    const p = (pontos ?? []).some((x) => x.destaque);
    return e || p;
  }, [eventos, pontos]);

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="text-center">
        <Card className="p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-primary">
            Celeiro do MS
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
            Descubra eventos e pontos turísticos da nossa região
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Uma vitrine digital para promover cultura, lazer e turismo nas cidades que compõem a área
            de atuação do Celeiro do MS.
          </p>
        </Card>
      </section>

      {/* Carousel destaques */}
      <section>
        <SectionHeader
          kicker="Destaques"
          tone="warning"
          description="Eventos e pontos turísticos marcados como destaque."
        >
          Em evidência agora
        </SectionHeader>

        <div className="mt-4">
          {(loadingEventos || loadingCidades) && (
            <Card className="p-6 text-sm text-slate-600">Carregando destaques...</Card>
          )}

          {!loadingEventos && !loadingCidades && hasHighlights ? (
            <FeaturedCarousel eventos={eventos} pontos={pontos} cidades={cidades} />
          ) : null}

          {!loadingEventos && !loadingCidades && !hasHighlights ? (
            <Card className="p-6 text-sm text-slate-600">
              Ainda não há itens em destaque. Marque <strong>destaque</strong> como <strong>true</strong> em um evento ou ponto turístico.
            </Card>
          ) : null}
        </div>
      </section>

      {/* Dobra: sobre o Celeiro do MS */}
      <section>
        <SectionHeader
          kicker="Quem somos"
          tone="success"
          description="Conheça o propósito do Celeiro do MS e como apoiamos a divulgação regional."
        >
          Sobre o Celeiro do MS
        </SectionHeader>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-900">Missão</p>
            <p className="mt-2 text-sm text-slate-600">
              Divulgar eventos e atrativos turísticos, fortalecendo a economia local e o acesso à informação.
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-900">Visão</p>
            <p className="mt-2 text-sm text-slate-600">
              Ser a principal referência digital de turismo e agenda cultural da região.
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-900">Valores</p>
            <p className="mt-2 text-sm text-slate-600">
              Transparência, valorização regional e experiência simples para usuários e gestores.
            </p>
          </Card>
        </div>
      </section>

      {/* Dobra: cidades */}
      <section>
        <SectionHeader
          kicker="Área de atuação"
          tone="primary"
          description="Cidades que compõem a região atendida pelo Celeiro do MS."
        >
          Cidades do Celeiro do MS
        </SectionHeader>

        <div className="mt-4">
          <CitiesGrid cidades={cidadesCeleiro} />
        </div>
      </section>
    </div>
  );
}