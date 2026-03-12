import { useEffect, useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import { Button, Card, SectionHeader } from "@/design-system/ui";
import type { ITouristPoint } from "@/entities/tourist-point/touristPoint.types";
import { adminApiClient } from "@/services/admin-api/client";

export function AdminTouristPointsListPage(): ReactElement {
  const [items, setItems] = useState<ITouristPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isActive: boolean = true;

    async function loadTouristPoints(): Promise<void> {
      try {
        setIsLoading(true);
        setError("");

        const response: ITouristPoint[] =
          await adminApiClient.listTouristPoints();

        if (!isActive) {
          return;
        }

        setItems(response);
      } catch {
        if (!isActive) {
          return;
        }

        setError("Não foi possível carregar os pontos turísticos.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadTouristPoints();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleDelete(id: string): Promise<void> {
    try {
      setError("");

      await adminApiClient.deleteTouristPoint(id);

      setItems((currentItems: ITouristPoint[]) =>
        currentItems.filter((item: ITouristPoint) => item.id !== id)
      );
    } catch {
      setError("Não foi possível remover o ponto turístico.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <SectionHeader
          kicker="Admin CMS"
          tone="primary"
          description="Gerencie os pontos turísticos exibidos no portal público."
        >
          Pontos turísticos
        </SectionHeader>

        <Link to="/admin/pontos-turisticos/novo">
          <Button variant="primary">Novo ponto turístico</Button>
        </Link>
      </div>

      {error ? (
        <Card className="border border-red-200 bg-red-50">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </Card>
      ) : null}

      <Card>
        {isLoading ? (
          <p className="text-sm text-zinc-600">Carregando dados...</p>
        ) : null}

        {!isLoading && items.length === 0 ? (
          <p className="text-sm text-zinc-600">
            Nenhum ponto turístico cadastrado.
          </p>
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500">
                  <th className="py-3">Nome</th>
                  <th className="py-3">Cidade</th>
                  <th className="py-3">Categoria</th>
                  <th className="py-3">Destaque</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: ITouristPoint) => (
                  <tr key={item.id} className="border-b border-zinc-100">
                    <td className="py-4">{item.name}</td>
                    <td className="py-4">{item.citySlug}</td>
                    <td className="py-4">{item.category ?? "-"}</td>
                    <td className="py-4">
                      {item.featured ? "Sim" : "Não"}
                    </td>
                    <td className="py-4">
                      {item.published ? "Publicado" : "Rascunho"}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/pontos-turisticos/${item.id}/editar`}>
                          <Button variant="secondary" size="sm">
                            Editar
                          </Button>
                        </Link>

                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => void handleDelete(item.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </div>
  );
}