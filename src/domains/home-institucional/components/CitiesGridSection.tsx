import type { ReactElement } from "react";
import { Section } from "@/shared/ui";
import { CELEIRO_CIDADES } from "../data/celeiroCidades";
import { CityCard } from "./CityCard";

export function CitiesGridSection(): ReactElement {
  return (
    <Section
      title="Cidades do Celeiro do MS"
      description="Conheça os municípios que compõem a área de atuação do Celeiro do MS e explore experiências, eventos e atrativos de cada território."
      spacing="xl"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {CELEIRO_CIDADES.map((cidade) => (
          <CityCard key={cidade.id} cidade={cidade} />
        ))}
      </div>
    </Section>
  );
}