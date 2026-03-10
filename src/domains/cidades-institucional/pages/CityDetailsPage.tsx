import type { ReactElement } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button, Card, Container, Section } from "@/shared/ui";
import {
  findCeleiroCidadeBySlug,
  type ICeleiroCidade,
} from "@/domains/home-institucional/data/celeiroCidades";

interface ICityRouteParams {
  slug?: string;
}

export function CityDetailsPage(): ReactElement {
  const params = useParams<keyof ICityRouteParams>();
  const slug: string | undefined = params.slug;
  const cidade: ICeleiroCidade | undefined = slug
    ? findCeleiroCidadeBySlug(slug)
    : undefined;

  if (!cidade) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-portal">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-light)] to-transparent" />

        <Container className="relative py-12 md:py-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-[var(--color-secondary)]">
                  Cidade do Celeiro do MS
                </span>

                <h1 className="text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
                  {cidade.nome}
                </h1>

                <p className="text-lg font-medium text-zinc-600">
                  {cidade.estado}
                </p>
              </div>

              <p className="max-w-2xl text-base leading-7 text-zinc-700">
                {cidade.resumo}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to={`/eventos?cidade=${cidade.slug}`}>
                  <Button variant="secondary" size="lg">
                    Ver eventos da cidade
                  </Button>
                </Link>

                <Link to={`/pontos-turisticos?cidade=${cidade.slug}`}>
                  <Button variant="ghost" size="lg">
                    Ver pontos turísticos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-soft">
              <img
                src={cidade.imageUrl}
                alt={cidade.nome}
                className="h-[360px] w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <Section
        title={`Conheça ${cidade.nome}`}
        description="Uma visão institucional inicial da cidade dentro do portal Celeiro do MS."
        spacing="xl"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">
              Identidade local
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {cidade.nome} integra o território do Celeiro do MS e compõe uma
              rede regional de cultura, turismo e experiências locais.
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">
              Eventos e agenda
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              O portal concentra a divulgação de eventos e oportunidades de
              visitação conectadas à cidade.
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">
              Atrativos e descoberta
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              A navegação futura pode destacar roteiros, atrativos, experiências
              culturais e conteúdos institucionais específicos da cidade.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        title="Próximos conteúdos desta cidade"
        description="Esta estrutura já está pronta para receber dados reais quando sua API estiver consolidada."
        spacing="lg"
      >
        <Card>
          <ul className="space-y-3 text-sm leading-6 text-zinc-700">
            <li>• Banner institucional da cidade</li>
            <li>• Seção “sobre a cidade” com conteúdo editorial</li>
            <li>• Destaques de eventos</li>
            <li>• Destaques de pontos turísticos</li>
            <li>• Galeria de imagens</li>
            <li>• Informações de contato e redes institucionais</li>
          </ul>
        </Card>
      </Section>
    </div>
  );
}