import {
  Button,
  Card,
  Container,
  Section,
  SectionHeader,
} from "@/design-system/ui";
import type { ITouristPoint } from "@/entities/tourist-point/touristPoint.types";
import { publicApiClient } from "@/services/public-api/client";
import { truncateMetaDescription } from "@/shell/public/seo/truncateMetaDescription";
import { usePublicPageMetadata } from "@/shell/public/seo/usePublicPageMetadata";
import { useEffect, useState, type ReactElement } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

interface ITouristPointRouteParams {
  id?: number;
}

export function PontoTuristicoDetailsPage(): ReactElement {
  const params = useParams<keyof ITouristPointRouteParams>();
  const id: number | undefined = Number(params.id);

  const [touristPoint, setTouristPoint] = useState<ITouristPoint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  const canonicalPontoPath =
    Number.isFinite(id) && id !== undefined && id > 0
      ? `/pontos-turisticos/${id}`
      : "/pontos-turisticos";

  usePublicPageMetadata({
    title: touristPoint
      ? `${touristPoint.name} | Pontos turísticos | Celeiro do MS`
      : isLoading
        ? "Carregando… | Celeiro do MS"
        : "Ponto turístico | Celeiro do MS",
    description: touristPoint
      ? truncateMetaDescription(touristPoint.description)
      : undefined,
    canonicalPath: canonicalPontoPath,
  });

  useEffect(() => {
    let isActive: boolean = true;

    async function loadTouristPoint(): Promise<void> {
      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const response: ITouristPoint | null =
          await publicApiClient.getPublishedTouristPointById(id);

        if (!isActive) {
          return;
        }

        if (!response) {
          setNotFound(true);
          return;
        }

        setTouristPoint(response);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadTouristPoint();

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
        <p className="text-sm text-zinc-600">Carregando ponto turístico...</p>
      </Section>
    );
  }

  if (!touristPoint) {
    return <Navigate to="/pontos-turisticos" replace />;
  }

  return (
    <div className="bg-portal">
      <section className="relative overflow-hidden">
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="space-y-2">
                {touristPoint.category ? (
                  <span className="inline-flex rounded-full bg-[var(--color-bg-light)] px-3 py-1 text-sm font-medium text-[var(--color-secondary)]">
                    {touristPoint.category}
                  </span>
                ) : null}

                <h1 className="text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
                  {touristPoint.name}
                </h1>

                <div className="space-y-1 text-sm text-zinc-600">
                  {touristPoint.address ? <p>{touristPoint.address}</p> : null}
                  {touristPoint.openingHours ? (
                    <p>{touristPoint.openingHours}</p>
                  ) : null}
                </div>
              </div>

              <p className="max-w-2xl text-base leading-7 text-zinc-700">
                {touristPoint.description}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to={`/cidades/${touristPoint.citySlug}`}>
                  <Button variant="secondary" size="lg">
                    Ver cidade
                  </Button>
                </Link>

                <Link to={`/pontos-turisticos?cidade=${touristPoint.citySlug}`}>
                  <Button variant="ghost" size="lg">
                    Voltar para pontos turísticos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-soft">
              {touristPoint.imageUrl ? (
                <img
                  src={touristPoint.imageUrl}
                  alt={touristPoint.name}
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
        <SectionHeader description="Estrutura inicial preparada para receber conteúdo mais rico da API real.">
          Informações do atrativo
        </SectionHeader>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">Categoria</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {touristPoint.category ?? "Não informado"}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">Cidade</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {touristPoint.citySlug}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-zinc-900">
              Funcionamento
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {touristPoint.openingHours ?? "Não informado"}
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
}
