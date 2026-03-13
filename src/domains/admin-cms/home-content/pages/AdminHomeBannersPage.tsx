import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";
import { Button, Card, SectionHeader } from "@/design-system/ui";
import type {
  ICreateHomeBannerInput,
  IHomeBanner,
  IHomeBannerBase,
} from "@/entities/home-content/homeContent.types";
import { adminApiClient } from "@/services/admin-api/client";

type IHomeBannerFormState = IHomeBannerBase;

function buildInitialFormState(): IHomeBannerFormState {
  return {
    title: "",
    subtitle: "",
    imageUrl: "",
    ctaLabel: "",
    ctaUrl: "",
    active: true,
    order: 1,
  };
}

export function AdminHomeBannersPage(): ReactElement {
  const [items, setItems] = useState<IHomeBanner[]>([]);
  const [formState, setFormState] = useState<IHomeBannerFormState>(
    buildInitialFormState()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    let isActive: boolean = true;

    async function loadData(): Promise<void> {
      try {
        setIsLoading(true);
        setError("");

        const response: IHomeBanner[] = await adminApiClient.listHomeBanners();

        if (!isActive) return;
        setItems(response);
      } catch {
        if (!isActive) return;
        setError("Não foi possível carregar os banners.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadData();

    return () => {
      isActive = false;
    };
  }, []);

  const nextOrder: number = useMemo(() => {
    if (items.length === 0) return 1;
    return Math.max(...items.map((item: IHomeBanner) => item.order)) + 1;
  }, [items]);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { name, value, type } = event.target;

    setFormState((currentState: IHomeBannerFormState) => ({
      ...currentState,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : name === "order"
            ? Number(value)
            : value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const input: ICreateHomeBannerInput = {
        title: formState.title.trim(),
        subtitle: formState.subtitle?.trim() || undefined,
        imageUrl: formState.imageUrl.trim(),
        ctaLabel: formState.ctaLabel?.trim() || undefined,
        ctaUrl: formState.ctaUrl?.trim() || undefined,
        active: formState.active,
        order: formState.order,
      };

      const createdItem: IHomeBanner =
        await adminApiClient.createHomeBanner(input);

      setItems((currentItems: IHomeBanner[]) =>
        [...currentItems, createdItem].sort(
          (left: IHomeBanner, right: IHomeBanner) => left.order - right.order
        )
      );

      setFormState({
        ...buildInitialFormState(),
        order: nextOrder + 1,
      });

      setSuccessMessage("Banner cadastrado com sucesso.");
    } catch {
      setError("Não foi possível salvar o banner.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    try {
      setError("");
      setSuccessMessage("");

      await adminApiClient.deleteHomeBanner(id);

      setItems((currentItems: IHomeBanner[]) =>
        currentItems.filter((item: IHomeBanner) => item.id !== id)
      );
    } catch {
      setError("Não foi possível remover o banner.");
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        kicker="Admin CMS"
        tone="primary"
        description="Gerencie os banners editoriais da home."
      >
        Banners da Home
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

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Novo banner</h2>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-zinc-700">
              Título
            </label>
            <input id="title" name="title" value={formState.title} onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]" />
          </div>

          <div className="space-y-2">
            <label htmlFor="subtitle" className="text-sm font-medium text-zinc-700">
              Subtítulo
            </label>
            <input id="subtitle" name="subtitle" value={formState.subtitle ?? ""} onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="imageUrl" className="text-sm font-medium text-zinc-700">
              URL da imagem
            </label>
            <input id="imageUrl" name="imageUrl" value={formState.imageUrl} onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]" />
          </div>

          <div className="space-y-2">
            <label htmlFor="ctaLabel" className="text-sm font-medium text-zinc-700">
              CTA label
            </label>
            <input id="ctaLabel" name="ctaLabel" value={formState.ctaLabel ?? ""} onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]" />
          </div>

          <div className="space-y-2">
            <label htmlFor="ctaUrl" className="text-sm font-medium text-zinc-700">
              CTA URL
            </label>
            <input id="ctaUrl" name="ctaUrl" value={formState.ctaUrl ?? ""} onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]" />
          </div>

          <div className="space-y-2">
            <label htmlFor="order" className="text-sm font-medium text-zinc-700">
              Ordem
            </label>
            <input id="order" name="order" type="number" min={1} value={formState.order} onChange={handleInputChange}
              className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]" />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input id="active" name="active" type="checkbox" checked={formState.active} onChange={handleInputChange} />
            <label htmlFor="active" className="text-sm text-zinc-700">
              Ativo
            </label>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Salvar banner
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-zinc-900">Banners cadastrados</h2>

        {isLoading ? <p className="mt-4 text-sm text-zinc-600">Carregando dados...</p> : null}

        {!isLoading && items.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600">Nenhum banner cadastrado.</p>
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="mt-4 space-y-4">
            {items.map((item: IHomeBanner) => (
              <div key={item.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-zinc-900">{item.title}</p>
                    {item.subtitle ? (
                      <p className="mt-1 text-sm text-zinc-600">{item.subtitle}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-zinc-500">
                      Ordem: {item.order} • {item.active ? "Ativo" : "Inativo"}
                    </p>
                  </div>

                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => void handleDelete(item.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  );
}