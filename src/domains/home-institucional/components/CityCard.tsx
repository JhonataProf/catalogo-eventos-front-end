import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "@/design-system/ui";
import type { ICeleiroCidade } from "../data/celeiroCidades";

const FALLBACK_CITY_IMG = "/images/fallbacks/cidade-card.jpg";

export interface ICityCardProps {
  cidade: ICeleiroCidade;
}

export function CityCard({ cidade }: ICityCardProps): ReactElement {
  return (
    <Card className="group overflow-hidden p-0" hoverable>
      <div className="relative overflow-hidden">
        <img
          src={cidade.imageUrl}
          alt={`Foto de ${cidade.nome}`}
          className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_CITY_IMG;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-80" />
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-secondary)]">
            {cidade.estado}
          </p>
          <h3 className="text-lg font-semibold text-zinc-900">{cidade.nome}</h3>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-zinc-600">
          {cidade.resumo}
        </p>

        <Link to={`/cidades/${cidade.slug}`} className="inline-flex w-full">
          <Button variant="secondary" fullWidth>
            Ver detalhes da cidade
          </Button>
        </Link>
      </div>
    </Card>
  );
}