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
import type {
  ICity,
  ICreateCityInput,
  IUpdateCityInput,
} from "@/entities/city/city.types";
import { adminApiClient } from "@/services/admin-api/client";

interface ICityFormRouteParams {
  id?: string;
}

interface ICityFormState {
  name: string;
  slug: string;
  state: string;
  summary: string;
  description: string;
  imageUrl: string;
  published: boolean;
}

function buildInitialFormState(): ICityFormState {
  return {
    name: "",
    slug: "",
    state: "MS",
    summary: "",
    description: "",
    imageUrl: "",
    published: true,
  };
}

function mapCityToFormState(city: ICity): ICityFormState {
  return {
    name: city.name,
    slug: city.slug,
    state: city.state,
    summary: city.summary,
    description: city.description ?? "",
    imageUrl: city.imageUrl ?? "",
    published: city.published,
  };
}

function slugifyCityName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export function AdminCityFormPage(): ReactElement {
  const navigate = useNavigate();
  const params = useParams<keyof ICityFormRouteParams>();
  const cityId: string | undefined = params.id;

  const isEditMode: boolean = Boolean(cityId);

  const [formState, setFormState] = useState<ICityFormState>(
    buildInitialFormState()
  );
  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    let isActive: boolean = true;

    async function loadCity(): Promise<void> {
      if (!cityId) {
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response: ICity | null = await adminApiClient.getCityById(cityId);

        if (!isActive) {
          return;
        }

        if (!response) {
          setNotFound(true);
          return;
        }

        setFormState(mapCityToFormState(response));
      } catch {
        if (!isActive) {
          return;
        }

        setError("Não foi possível carregar a cidade.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCity();

    return () => {
      isActive = false;
    };
  }, [cityId]);

  const pageTitle: string = useMemo(() => {
    return isEditMode ? "Editar cidade" : "Nova cidade";
  }, [isEditMode]);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { name, value, type } = event.target;

    setFormState((currentState: ICityFormState) => {
      const nextState: ICityFormState = {
        ...currentState,
        [name]:
          type === "checkbox"
            ? (event.target as HTMLInputElement).checked
            : value,
      };

      if (name === "name" && !isEditMode) {
        nextState.slug = slugifyCityName(value);
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

      if (isEditMode && cityId) {
        const input: IUpdateCityInput = {
          id: cityId,
          name: formState.name.trim(),
          slug: formState.slug.trim(),
          state: formState.state.trim(),
          summary: formState.summary.trim(),
          description: formState.description.trim() || undefined,
          imageUrl: formState.imageUrl.trim() || undefined,
          published: formState.published,
        };

        await adminApiClient.updateCity(input);
        setSuccessMessage("Cidade atualizada com sucesso.");
      } else {
        const input: ICreateCityInput = {
          name: formState.name.trim(),
          slug: formState.slug.trim(),
          state: formState.state.trim(),
          summary: formState.summary.trim(),
          description: formState.description.trim() || undefined,
          imageUrl: formState.imageUrl.trim() || undefined,
          published: formState.published,
        };

        await adminApiClient.createCity(input);
        navigate("/admin/cidades", { replace: true });
        return;
      }
    } catch {
      setError("Não foi possível salvar a cidade.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (notFound) {
    return <Navigate to="/admin/cidades" replace />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          kicker="Admin CMS"
          tone="primary"
          description="Carregando cidade."
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
        description="Cadastre ou edite as cidades exibidas no portal."
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
            <label htmlFor="slug" className="text-sm font-medium text-zinc-700">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              value={formState.slug}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="state" className="text-sm font-medium text-zinc-700">
              UF
            </label>
            <input
              id="state"
              name="state"
              value={formState.state}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={formState.published}
              onChange={handleInputChange}
            />
            <label htmlFor="published" className="text-sm text-zinc-700">
              Publicada
            </label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="summary" className="text-sm font-medium text-zinc-700">
              Resumo
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={4}
              value={formState.summary}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="text-sm font-medium text-zinc-700">
              Descrição longa
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
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/cidades")}
          >
            Voltar
          </Button>

          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Salvar cidade
          </Button>
        </div>
      </form>
    </div>
  );
}