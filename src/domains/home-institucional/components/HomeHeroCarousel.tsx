import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Section } from "@/shared/ui";
import { HOME_HIGHLIGHTS } from "../data/homeHighlights";

export function HomeHeroCarousel(): ReactElement {
  return (
    <Section spacing="xl" className="pt-8 md:pt-12">
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

        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
          {HOME_HIGHLIGHTS.map((item) => (
            <article
              key={item.id}
              className="group min-w-[85%] snap-start overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-soft md:min-w-[48%] xl:min-w-[32%]"
            >
              <img
                src={item.imageUrl}
                alt={item.titulo}
                className="h-72 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />

              <div className="space-y-4 p-6">
                <div className="space-y-1">
                  <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                    {item.label}
                  </span>

                  <p className="text-sm font-medium text-[var(--color-secondary)]">
                    {item.cidadeNome}
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-zinc-900">
                    {item.titulo}
                  </h2>

                  <p className="text-sm leading-6 text-zinc-600">
                    {item.descricao}
                  </p>
                </div>

                <Link to={item.href}>
                  <Button variant="secondary">Explorar destaque</Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}