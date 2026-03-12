import type { ReactElement } from "react";
import { Card, SectionHeader } from "@/design-system/ui";

export function AdminDashboardPage(): ReactElement {
  return (
    <div className="space-y-8">
      <SectionHeader
        kicker="Painel"
        tone="primary"
        description="Visão inicial da área administrativa do Celeiro do MS."
      >
        Dashboard
      </SectionHeader>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm font-medium text-zinc-500">Cidades</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">12</p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-zinc-500">Eventos</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">24</p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-zinc-500">Pontos turísticos</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">18</p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-zinc-500">Destaques da home</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">6</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-zinc-900">
          Próximos módulos
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          O próximo passo será implementar as telas de gestão institucional,
          cidades, eventos, pontos turísticos, mídias sociais e conteúdo da home.
        </p>
      </Card>
    </div>
  );
}