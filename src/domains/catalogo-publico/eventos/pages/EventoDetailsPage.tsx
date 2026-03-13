import { useEffect, useState, type ReactElement } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { IEvento } from "@/entities/evento/evento.types";
import { Button, Card, Container, Section, SectionHeader } from "@/design-system/ui";
import { publicApiClient } from "@/services/public-api/client";

interface IEventoRouteParams {
  id?: string;
}

export function EventoDetailsPage(): ReactElement {
  const params = useParams<keyof IEventoRouteParams>();
  const id: string | undefined = params.id;

  const [evento, setEvento] = useState<Partial<IEvento> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    let isActive: boolean = true;

    async function loadEvento(): Promise<void> {
      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response: Partial<IEvento> | null = await publicApiClient.getPublishedEventById(id);

        if (!isActive) {
          return;
        }

        if (!response) {
          setNotFound(true);
          return;
        }

        setEvento(response);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadEvento();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (notFound) {
    return <Navigate to="/eventos" replace />;
  }

  if (isLoading) {
    return (
      <Section spacing="xl">
        <p className="text-sm text-zinc-600">Carregando evento...</p>
      </Section>
    );
  }

  if (!evento) {
    return <Navigate to="/eventos" replace />;
  }

  return (
    <div className="bg-portal">
      <section className="relative overflow-hidden">
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="space-y-2">
                {evento.categoria ? (
                  <span className="inline-flex rounded-full bg-[var(--color-bg-light)] px-3 py-1 text-sm font-medium text-[var(--color-secondary)]">
                    {evento.categoria}
                  </span>
                ) : null}

                <h1 className="text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
                  {evento.nome}
                </h1>

                <div className="space-y-1 text-sm text-zinc-600">
                  {evento.dataFormatada ? <p>{evento.dataFormatada}</p> : null}
                  {evento.local ? <p>{evento.local}</p> : null}
                </div>
              </div>

              <p className="max-w-2xl text-base leading-7 text-zinc-700">
                {evento.descricao}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to={`/cidades/${evento.cidadeSlug}`}>
                  <Button variant="secondary" size="lg">
                    Ver cidade
                  </Button>
                </Link>

                <Link to={`/eventos?cidade=${evento.cidadeSlug}`}>
                  <Button variant="ghost" size="lg">
                    Voltar para eventos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-soft">
              {evento.imagemPrincipal ? (
                <img
                  src={evento.imagemPrincipal}
                  alt={evento.nome}
                  className="h-[360px] w-full object-cover"
                />
              ) : (
                <div className="h-[360px] w-full bg-zinc-100" />
              )}
            </div>
          </div>
        </Container>
      </section>

      <Section spacing="xl">
        <SectionHeader
          description="Estrutura inicial preparada para receber dados mais completos da API real."
        >
          Informações do evento
        </SectionHeader>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">Categoria</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {evento.categoria ?? "Não informado"}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">Cidade</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {evento.cidadeSlug}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">Local</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {evento.local ?? "Não informado"}
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
}