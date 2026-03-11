import type { ReactElement } from "react";
import { Card, Container, SectionHeader } from "@/design-system/ui";

export function CeleiroIntroSection(): ReactElement {
  return (
    <section className="py-14">
      <Container>
        <SectionHeader
          kicker="Quem somos"
          tone="success"
          description="Conheça o propósito do Celeiro do MS e como apoiamos a divulgação regional."
        >
          Sobre o Celeiro do MS
        </SectionHeader>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Card className="border-[color:rgba(13,139,84,0.12)] p-6">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[var(--color-bg-light)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-secondary)]">
                Missão
              </span>

              <p className="text-sm leading-6 text-zinc-600">
                Divulgar eventos e atrativos turísticos, fortalecendo a economia
                local e ampliando o acesso à informação regional.
              </p>
            </div>
          </Card>

          <Card className="border-[color:rgba(0,152,201,0.12)] p-6">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[color:rgba(0,152,201,0.10)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                Visão
              </span>

              <p className="text-sm leading-6 text-zinc-600">
                Ser a principal referência digital de turismo e agenda cultural da
                região do Celeiro do MS.
              </p>
            </div>
          </Card>

          <Card className="border-[color:rgba(223,218,12,0.22)] p-6">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[color:rgba(223,218,12,0.18)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:#7b7400]">
                Valores
              </span>

              <p className="text-sm leading-6 text-zinc-600">
                Transparência, valorização regional, simplicidade de uso e
                experiência de navegação acessível para diferentes públicos.
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}