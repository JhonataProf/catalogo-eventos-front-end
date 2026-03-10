import type { ReactElement } from "react";
import { Card, Section } from "@/shared/ui";

export function CeleiroIntroSection(): ReactElement {
  return (
    <Section
      title="Sobre o Celeiro do MS"
      description="Uma iniciativa voltada à valorização do território, da cultura, do turismo e das experiências regionais."
      spacing="xl"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card padding="lg">
          <div className="space-y-4">
            <p className="text-base leading-7 text-zinc-700">
              O Celeiro do MS reúne municípios e potencializa a divulgação de
              eventos, pontos turísticos, experiências culturais, identidade
              regional e oportunidades de visitação.
            </p>

            <p className="text-base leading-7 text-zinc-700">
              A proposta do portal é facilitar o acesso a informações públicas,
              fortalecer a presença digital dos territórios e criar uma navegação
              integrada entre cidades, atrações e agenda regional.
            </p>

            <p className="text-base leading-7 text-zinc-700">
              Mais do que um catálogo, esta plataforma funciona como uma vitrine
              institucional para apresentar a força cultural, turística e
              econômica da região.
            </p>
          </div>
        </Card>

        <Card padding="lg" className="bg-[var(--color-bg-muted)]">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900">
              O que você encontra aqui
            </h3>

            <ul className="space-y-3 text-sm leading-6 text-zinc-700">
              <li>• Eventos e agenda regional</li>
              <li>• Pontos turísticos e locais de visitação</li>
              <li>• Informações por cidade</li>
              <li>• Navegação integrada do território</li>
              <li>• Experiência pública simples e acessível</li>
            </ul>
          </div>
        </Card>
      </div>
    </Section>
  );
}