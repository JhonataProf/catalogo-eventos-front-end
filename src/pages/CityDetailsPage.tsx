import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, SectionHeader, Button } from "../shared/ui";
import { cidadesCeleiro } from "../features/home/data/cidadesCeleiro";

export default function CityDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const cidade = useMemo(() => cidadesCeleiro.find((c) => c.slug === slug), [slug]);

  if (!cidade) {
    return (
      <Card className="p-6">
        <p className="text-sm text-slate-600">Cidade não encontrada.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader kicker="Cidade" tone="primary" description="Detalhes e informações gerais.">
        {cidade.nome} / {cidade.uf}
      </SectionHeader>

      <Card className="overflow-hidden">
        <img
          src={cidade.image}
          alt={`Foto de ${cidade.nome}`}
          className="h-64 w-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).src = "https://picsum.photos/1200/600?blur=1")}
        />
        <div className="p-6">
          <p className="text-sm text-slate-600">
            Aqui você pode colocar conteúdo institucional da cidade, pontos em destaque, agenda local e informações úteis.
          </p>

          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => history.back()}>
              Voltar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}