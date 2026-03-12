import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
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
import { adminApiClient } from "@/services/admin-api/client";

interface ITouristPointFormRouteParams {
  id?: string;
}

interface ITouristPointFormState {
  cityId: string;
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
    cityId: "",
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
  const touristPointId: string | undefined = params.id;

  const isEditMode: boolean = Boolean(touristPointId);

  const [cities, setCities] = useState<ICity[]>([]);
  const [formState, setFormState] = useState<ITouristPointFormState>(
    buildInitialFormState()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    let isActive: boolean = true;

    async function loadData(): Promise<void> {
      try {
        setIsLoading(true);
        setError("");

        const [citiesResponse, touristPointResponse] = await Promise.all([
          adminApiClient.listCities(),
          touristPointId
            ? adminApiClient.getTouristPointById(touristPointId)
            : Promise.resolve(null),
        ]);

        if (!isActive) {
          return;
        }

        setCities(citiesResponse);

        if (!touristPointId) {
          const firstCity: ICity | undefined = citiesResponse[0];

          if (firstCity) {
            setFormState((currentState: ITouristPointFormState) => ({
              ...currentState,
              cityId: firstCity.id,
              citySlug: firstCity.slug,
            }));
          }

          return;
        }

        if (!touristPointResponse) {
          setNotFound(true);
          return;
        }

        setFormState(mapTouristPointToFormState(touristPointResponse));
      } catch {
        if (!isActive) {
          return;
        }

        setError("Não foi possível carregar os dados do formulário.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isActive = false;
    };
  }, [touristPointId]);

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
          (city: ICity) => city.id === value
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
    event: FormEvent<HTMLFormElement>
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

      {error ? (
        <Card className="border border-red-200 bg-red-50">
          <p className="text-sm font-medium text-red-700">{error}</p>
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