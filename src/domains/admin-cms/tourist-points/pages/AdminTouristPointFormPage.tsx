import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
  type ReactElement,
} from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button, Card, SectionHeader } from "@/design-system/ui";
import type { ICity } from "@/entities/city/city.types";
import type {
  ICreateTouristPointInput,
  ITouristPoint,
  IUpdateTouristPointInput,
} from "@/entities/tourist-point/touristPoint.types";
import { useAdminTouristPointFormSource } from "@/domains/admin-cms/tourist-points/hooks/useAdminTouristPointFormSource";
import { adminApiClient } from "@/services/admin-api/client";

interface ITouristPointFormRouteParams {
  id?: number;
}

interface ITouristPointFormState {
  cityId: number;
  citySlug: string;
  name: string;
  description: string;
  category: string;
  address: string;
  openingHours: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
}

function buildInitialFormState(): ITouristPointFormState {
  return {
    cityId: 0,
    citySlug: "",
    name: "",
    description: "",
    category: "",
    address: "",
    openingHours: "",
    imageUrl: "",
    featured: false,
    published: true,
  };
}

function mapTouristPointToFormState(
  touristPoint: ITouristPoint
): ITouristPointFormState {
  return {
    cityId: touristPoint.cityId,
    citySlug: touristPoint.citySlug,
    name: touristPoint.name,
    description: touristPoint.description,
    category: touristPoint.category ?? "",
    address: touristPoint.address ?? "",
    openingHours: touristPoint.openingHours ?? "",
    imageUrl: touristPoint.imageUrl ?? "",
    featured: touristPoint.featured,
    published: touristPoint.published,
  };
}

export function AdminTouristPointFormPage(): ReactElement {
  const navigate = useNavigate();
  const params = useParams<keyof ITouristPointFormRouteParams>();
  const rawTouristPointId = Number(params.id);
  const touristPointId: number | undefined =
    Number.isFinite(rawTouristPointId) && rawTouristPointId > 0
      ? rawTouristPointId
      : undefined;

  const isEditMode: boolean = Boolean(touristPointId);

  const {
    cities,
    touristPoint: loadedTouristPoint,
    isLoading,
    error: loadError,
    notFound,
  } = useAdminTouristPointFormSource(touristPointId);

  const [formState, setFormState] = useState<ITouristPointFormState>(
    buildInitialFormState()
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (touristPointId || isLoading || loadedTouristPoint) {
      return;
    }

    const firstCity: ICity | undefined = cities[0];

    if (firstCity) {
      setFormState((currentState: ITouristPointFormState) => ({
        ...currentState,
        cityId: firstCity.id,
        citySlug: firstCity.slug,
      }));
    }
  }, [touristPointId, isLoading, loadedTouristPoint, cities]);

  useEffect(() => {
    if (!loadedTouristPoint || !touristPointId) {
      return;
    }

    setFormState(mapTouristPointToFormState(loadedTouristPoint));
  }, [loadedTouristPoint, touristPointId]);

  const pageTitle: string = useMemo(() => {
    return isEditMode ? "Editar ponto turístico" : "Novo ponto turístico";
  }, [isEditMode]);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void {
    const { name, value, type } = event.target;

    setFormState((currentState: ITouristPointFormState) => {
      const nextState: ITouristPointFormState = {
        ...currentState,
        [name]:
          type === "checkbox"
            ? (event.target as HTMLInputElement).checked
            : value,
      };

      if (name === "cityId") {
        const selectedCity: ICity | undefined = cities.find(
          (city: ICity) => city.id === Number(value)
        );

        nextState.citySlug = selectedCity?.slug ?? "";
      }

      return nextState;
    });

    if (successMessage) {
      setSuccessMessage("");
    }
  }

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      if (isEditMode && touristPointId) {
        const input: IUpdateTouristPointInput = {
          id: touristPointId,
          cityId: formState.cityId,
          citySlug: formState.citySlug,
          name: formState.name.trim(),
          description: formState.description.trim(),
          category: formState.category.trim() || undefined,
          address: formState.address.trim() || undefined,
          openingHours: formState.openingHours.trim() || undefined,
          imageUrl: formState.imageUrl.trim() || undefined,
          featured: formState.featured,
          published: formState.published,
        };

        await adminApiClient.updateTouristPoint(input);
        setSuccessMessage("Ponto turístico atualizado com sucesso.");
      } else {
        const input: ICreateTouristPointInput = {
          cityId: formState.cityId,
          citySlug: formState.citySlug,
          name: formState.name.trim(),
          description: formState.description.trim(),
          category: formState.category.trim() || undefined,
          address: formState.address.trim() || undefined,
          openingHours: formState.openingHours.trim() || undefined,
          imageUrl: formState.imageUrl.trim() || undefined,
          featured: formState.featured,
          published: formState.published,
        };

        await adminApiClient.createTouristPoint(input);
        navigate("/admin/pontos-turisticos", { replace: true });
        return;
      }
    } catch {
      setError("Não foi possível salvar o ponto turístico.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (notFound) {
    return <Navigate to="/admin/pontos-turisticos" replace />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          kicker="Admin CMS"
          tone="primary"
          description="Carregando ponto turístico."
        >
          {pageTitle}
        </SectionHeader>

        <Card>
          <p className="text-sm text-zinc-600">Carregando dados...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        kicker="Admin CMS"
        tone="primary"
        description="Cadastre ou edite os pontos turísticos exibidos no portal."
      >
        {pageTitle}
      </SectionHeader>

      {error || loadError ? (
        <Card className="border border-red-200 bg-red-50">
          <p className="text-sm font-medium text-red-700">
            {error || loadError}
          </p>
        </Card>
      ) : null}

      {successMessage ? (
        <Card className="border border-emerald-200 bg-emerald-50">
          <p className="text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
        </Card>
      ) : null}

      <form className="space-y-6" onSubmit={(event) => void handleSubmit(event)}>
        <Card className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="cityId" className="text-sm font-medium text-zinc-700">
              Cidade
            </label>
            <select
              id="cityId"
              name="cityId"
              value={formState.cityId}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            >
              {cities.map((city: ICity) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-700">
              Nome
            </label>
            <input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-zinc-700">
              Categoria
            </label>
            <input
              id="category"
              name="category"
              value={formState.category}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-zinc-700">
              Endereço
            </label>
            <input
              id="address"
              name="address"
              value={formState.address}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="openingHours" className="text-sm font-medium text-zinc-700">
              Horário de funcionamento
            </label>
            <input
              id="openingHours"
              name="openingHours"
              value={formState.openingHours}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="text-sm font-medium text-zinc-700">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={formState.description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="imageUrl" className="text-sm font-medium text-zinc-700">
              URL da imagem
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              value={formState.imageUrl}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formState.featured}
              onChange={handleInputChange}
            />
            <label htmlFor="featured" className="text-sm text-zinc-700">
              Destaque
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={formState.published}
              onChange={handleInputChange}
            />
            <label htmlFor="published" className="text-sm text-zinc-700">
              Publicado
            </label>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/pontos-turisticos")}
          >
            Voltar
          </Button>

          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Salvar ponto turístico
          </Button>
        </div>
      </form>
    </div>
  );
}