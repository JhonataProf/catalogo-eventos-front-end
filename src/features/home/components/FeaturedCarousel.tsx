import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Cidade, Evento, PontoTuristico } from "../../../domain";
import { Button, Card, Tag } from "../../../shared/ui";

type FeaturedItem =
  | { type: "evento"; id: string; title: string; subtitle?: string; image?: string; href: string }
  | { type: "ponto"; id: string; title: string; subtitle?: string; image?: string; href: string };

const FALLBACK_IMG = "https://picsum.photos/1200/420?blur=2";

export function FeaturedCarousel({
  eventos,
  pontos,
  cidades,
}: {
  eventos: Evento[];
  pontos: PontoTuristico[];
  cidades: Cidade[];
}) {
  const navigate = useNavigate();

  const pointIdToCityName = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of cidades ?? []) {
      for (const p of c.pontos ?? []) {
        map.set(p.id, c.nome);
      }
    }
    return map;
  }, [cidades]);

  const items = useMemo<FeaturedItem[]>(() => {
    const featuredEventos = (eventos ?? [])
      .filter((e) => Boolean(e.destaque))
      .map((e) => ({
        type: "evento" as const,
        id: e.id,
        title: e.titulo,
        subtitle: e.local || "",
        image: e.img,
        href: `/eventos/${e.id}`,
      }));

    const featuredPontos = (pontos ?? [])
      .filter((p) => Boolean(p.destaque))
      .map((p) => {
        const city = pointIdToCityName.get(p.id);
        const subtitle = [city, p.tipo].filter(Boolean).join(" • ");
        return {
          type: "ponto" as const,
          id: p.id,
          title: p.nome,
          subtitle,
          image: p.img,
          href: `/pontos-turisticos/${p.id}`,
        };
      });

    return [...featuredEventos, ...featuredPontos];
  }, [eventos, pontos, pointIdToCityName]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 4500);
    return () => window.clearInterval(t);
  }, [items.length]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (index >= items.length) setIndex(0);
  }, [items.length, index]);

  if (items.length === 0) return null;

  const current = items[index];

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={current.image || FALLBACK_IMG}
          alt={current.title}
          className="h-56 w-full object-cover sm:h-72"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Tag variant={current.type === "evento" ? "primary" : "success"}>
              {current.type === "evento" ? "Evento em destaque" : "Ponto turístico em destaque"}
            </Tag>
            <span className="text-xs text-white/80">
              {index + 1}/{items.length}
            </span>
          </div>

          <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{current.title}</h2>

          {current.subtitle ? (
            <p className="mt-1 text-sm text-white/80">{current.subtitle}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => navigate(current.href)}>
              Ver detalhes
            </Button>
            <Button variant="secondary" onClick={() => setIndex((i) => (i + 1) % items.length)}>
              Próximo
            </Button>
          </div>

          <div className="mt-4 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para item ${i + 1}`}
                onClick={() => setIndex(i)}
                className={[
                  "h-2 w-2 rounded-full transition",
                  i === index ? "bg-brand-warning" : "bg-white/40 hover:bg-white/70",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}