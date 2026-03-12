import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container } from "@/design-system/ui";
import { HOME_HIGHLIGHTS, type IHomeHighlight } from "../data/homeHighlights";

const FALLBACK_IMG = "/images/fallbacks/celeiro-highlight.jpg";
const AUTO_PLAY_INTERVAL_MS = 4500;

function getTagLabel(kind: IHomeHighlight["kind"]): string {
  return kind === "evento"
    ? "Evento em destaque"
    : "Ponto turístico em destaque";
}

function getTagClassName(kind: IHomeHighlight["kind"]): string {
  return kind === "evento"
    ? "bg-[var(--color-accent)] text-zinc-900"
    : "bg-white/90 text-zinc-900";
}

export function HomeHeroCarousel(): ReactElement | null {
  const navigate = useNavigate();
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (HOME_HIGHLIGHTS.length <= 1) {
      return;
    }

    const timerId: number = window.setInterval(() => {
      setIndex((currentIndex: number) => {
        return (currentIndex + 1) % HOME_HIGHLIGHTS.length;
      });
    }, AUTO_PLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    HOME_HIGHLIGHTS.forEach((item: IHomeHighlight) => {
      const image = new Image();
      image.src = item.imageUrl || FALLBACK_IMG;
    });
  }, []);

  if (HOME_HIGHLIGHTS.length === 0) {
    return null;
  }

  const currentItem: IHomeHighlight = HOME_HIGHLIGHTS[index];

  function handleNext(): void {
    setIndex((currentIndex: number) => {
      return (currentIndex + 1) % HOME_HIGHLIGHTS.length;
    });
  }

  return (
    <section className="pt-8 md:pt-12">
      <Container>
        <div className="mb-6 space-y-3">
          <span className="inline-flex rounded-full bg-[var(--color-bg-light)] px-3 py-1 text-sm font-medium text-[var(--color-secondary)]">
            Celeiro do MS
          </span>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
            Descubra eventos, experiências e destinos que valorizam o território
            do Celeiro do MS
          </h1>

          <p className="max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
            Um portal público para conectar pessoas, cidades e oportunidades da
            região com navegação simples e conteúdo relevante.
          </p>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="relative h-64 sm:h-80 lg:h-[420px]">
            {HOME_HIGHLIGHTS.map((item: IHomeHighlight, itemIndex: number) => {
              const isActive: boolean = itemIndex === index;

              return (
                <>
                  <img
                    key={item.id}
                    src={item.imageUrl || FALLBACK_IMG}
                    alt={item.titulo}
                    className={[
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                      isActive
                        ? "opacity-100"
                        : "pointer-events-none opacity-0",
                    ].join(" ")}
                    loading={itemIndex === 0 ? "eager" : "lazy"}
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                </>
              );
            })}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/30 to-transparent" />

            <div
              aria-live="polite"
              className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8"
            >
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                    getTagClassName(currentItem.kind),
                  ].join(" ")}
                  aria-label={getTagLabel(currentItem.kind)}
                >
                  {getTagLabel(currentItem.kind)}
                </span>

                <span
                  className="text-xs text-white/80"
                  aria-label={`Destaque ${index + 1} de ${HOME_HIGHLIGHTS.length}`}
                  data-testid="carousel-counter"
                >
                  {index + 1}/{HOME_HIGHLIGHTS.length}
                </span>
              </div>

              <h2
                className="mt-3 max-w-3xl text-2xl font-semibold text-white sm:text-3xl lg:text-4xl"
                data-testid="carousel-title"
              >
                {currentItem.titulo}
              </h2>

              <p
                className="mt-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base"
                data-testid="carousel-subtitle"
              >
                {currentItem.cidadeNome} • {currentItem.descricao}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => navigate(currentItem.href)}
                >
                  Ver detalhes
                </Button>

                {HOME_HIGHLIGHTS.length > 1 ? (
                  <Button variant="ghost" onClick={handleNext}>
                    Próximo
                  </Button>
                ) : null}
              </div>

              {HOME_HIGHLIGHTS.length > 1 ? (
                <div
                  className="mt-5 flex gap-2"
                  aria-label="Indicadores do carrossel"
                >
                  {HOME_HIGHLIGHTS.map(
                    (item: IHomeHighlight, itemIndex: number) => {
                      const isActive: boolean = itemIndex === index;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-label={`Ir para destaque ${itemIndex + 1}`}
                          aria-current={isActive ? "true" : undefined}
                          data-testid={`carousel-dot-${itemIndex + 1}`}
                          onClick={() => setIndex(itemIndex)}
                          className={[
                            "h-2.5 rounded-full transition",
                            isActive
                              ? "w-8 bg-[var(--color-accent)]"
                              : "w-2.5 bg-white/40 hover:bg-white/70",
                          ].join(" ")}
                        />
                      );
                    },
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
}
