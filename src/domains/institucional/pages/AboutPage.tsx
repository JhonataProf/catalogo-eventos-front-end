import type { ReactElement } from "react";
import { Card, HeroSection, Section, SectionHeader } from "@/design-system/ui";

export function AboutPage(): ReactElement {
  return (
    <div className="bg-portal">
      <Section spacing="xl">
        <HeroSection
          kicker="Institucional"
          tone="success"
          title="Sobre o Celeiro do MS"
          subtitle="Uma iniciativa voltada à valorização do território, da cultura, do turismo e das experiências regionais."
        />
      </Section>

      <Section spacing="xl">
        <SectionHeader
          kicker="Quem somos"
          tone="primary"
          description="Entenda o propósito do portal e seu papel na divulgação regional."
        >
          Uma vitrine digital do território
        </SectionHeader>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Missão</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Divulgar eventos, atrativos turísticos e experiências regionais,
              fortalecendo a economia local e ampliando o acesso à informação.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Visão</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Ser a principal referência digital de turismo e agenda cultural da
              região do Celeiro do MS.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Valores</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Transparência, valorização regional, simplicidade de uso,
              acessibilidade e experiência de navegação clara.
            </p>
          </Card>
        </div>
      </Section>

      <Section spacing="xl">
        <SectionHeader
          kicker="Propósito"
          tone="success"
          description="O portal existe para conectar pessoas, cidades, experiências e oportunidades da região."
        >
          O que o Celeiro do MS promove
        </SectionHeader>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-zinc-900">
              Divulgação regional integrada
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              O portal reúne informações de eventos, pontos turísticos e
              conteúdos institucionais em uma navegação pública unificada.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-zinc-900">
              Valorização do território
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              A proposta é fortalecer a identidade regional, destacar cidades e
              apoiar a visibilidade de experiências locais.
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
}