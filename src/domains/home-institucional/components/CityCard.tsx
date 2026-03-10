import { Button, Card } from "@/shared/ui";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import type { ICeleiroCidade } from "../data/celeiroCidades";

export interface ICityCardProps {
  cidade: ICeleiroCidade;
}

export function CityCard({ cidade }: ICityCardProps): ReactElement {
  return (
    <Card padding="none" hoverable className="overflow-hidden">
      <img
        src={cidade.imageUrl}
        alt={cidade.nome}
        className="h-52 w-full object-cover"
      />

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-500">{cidade.estado}</p>
          <h3 className="text-xl font-semibold text-zinc-900">{cidade.nome}</h3>
        </div>

        <p className="text-sm leading-6 text-zinc-600">{cidade.resumo}</p>

        <Link to={`/cidades/${cidade.slug}`}>
          <Button variant="secondary" fullWidth>
            Ver detalhes da cidade
          </Button>
        </Link>
      </div>
    </Card>
  );
}