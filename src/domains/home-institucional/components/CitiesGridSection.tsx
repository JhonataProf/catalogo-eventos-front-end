import type { ReactElement } from "react";
import { Section, SectionHeader } from "@/design-system/ui";
import { CELEIRO_CIDADES } from "../data/celeiroCidades";
import { CityCard } from "./CityCard";

export function CitiesGridSection(): ReactElement {
  return (
    <Section spacing="xl">
      <SectionHeader
        kicker="Área de atuação"
        tone="primary"
        description="Cidades que compõem a região atendida pelo Celeiro do MS."
      >
        Cidades do Celeiro do MS
      </SectionHeader>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {CELEIRO_CIDADES.map((cidade) => (
          <CityCard key={cidade.slug} cidade={cidade} />
        ))}
      </div>
    </Section>
  );
}