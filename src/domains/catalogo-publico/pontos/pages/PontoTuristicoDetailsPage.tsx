import { useEffect, useState, type ReactElement } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { IPontoTuristico } from "@/entities/ponto-turistico/pontoTuristico.types";
import { Button, Card, Container, Section } from "@/shared/ui";
import { tourismApiClient } from "@/services/tourism-api/client";

interface IPontoRouteParams {
  id?: string;
}

export function PontoTuristicoDetailsPage(): ReactElement {
  const params = useParams<keyof IPontoRouteParams>();
  const id: string | undefined = params.id;

  const [ponto, setPonto] = useState<IPontoTuristico | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    let isActive: boolean = true;

    async function loadPonto(): Promise<void> {
      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response: IPontoTuristico | null =
          await tourismApiClient.getPontoById(id);

        if (!isActive) {
          return;
        }

        if (!response) {
          setNotFound(true);
          return;
        }

        setPonto(response);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadPonto();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (notFound) {
    return <Navigate to="/pontos-turisticos" replace />;
  }

  if (isLoading) {
    return (
      <Section spacing="xl">
        <Container>
          <p className="text-sm text-zinc-600">Carregando ponto turístico...</p>
        </Container>
      </Section>
    );
  }

  if (!ponto) {
    return <Navigate to="/pontos-turisticos" replace />;
  }

  return (
    <div className="bg-portal">
      <section className="relative overflow-hidden">
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="space-y-2">
                {ponto.categoria ? (
                  <span className="inline-flex rounded-full bg-[var(--color-bg-light)] px-3 py-1 text-sm font-medium text-[var(--color-secondary)]">
                    {ponto.categoria}
                  </span>
                ) : null}

                <h1 className="text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
                  {ponto.nome}
                </h1>

                <div className="space-y-1 text-sm text-zinc-600">
                  {ponto.endereco ? <p>{ponto.endereco}</p> : null}
                  {ponto.horarioFuncionamento ? (
                    <p>{ponto.horarioFuncionamento}</p>
                  ) : null}
                </div>
              </div>

              <p className="max-w-2xl text-base leading-7 text-zinc-700">
                {ponto.descricao}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to={`/cidades/${ponto.cidadeSlug}`}>
                  <Button variant="secondary" size="lg">
                    Ver cidade
                  </Button>
                </Link>

                <Link to={`/pontos-turisticos?cidade=${ponto.cidadeSlug}`}>
                  <Button variant="ghost" size="lg">
                    Voltar para pontos turísticos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-soft">
              {ponto.imagemPrincipal ? (
                <img
                  src={ponto.imagemPrincipal}
                  alt={ponto.nome}
                  className="h-[360px] w-full object-cover"
                />
              ) : (
                <div className="h-[360px] w-full bg-zinc-100" />
              )}
            </div>
          </div>
        </Container>
      </section>

      <Section
        title="Informações do atrativo"
        description="Estrutura inicial preparada para receber conteúdo mais rico da API real."
        spacing="xl"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">Categoria</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {ponto.categoria ?? "Não informado"}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">Cidade</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {ponto.cidadeSlug}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">Funcionamento</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {ponto.horarioFuncionamento ?? "Não informado"}
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
}