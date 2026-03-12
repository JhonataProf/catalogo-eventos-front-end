import { useState, type FormEvent, type ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card } from "@/design-system/ui";
import { useAuth } from "../useAuth";

interface ILocationState {
  from?: string;
}

export function AdminLoginPage(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const locationState: ILocationState | null = location.state as ILocationState | null;

  const [email, setEmail] = useState<string>("admin@celeiroms.com");
  const [password, setPassword] = useState<string>("123456");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      await login(email, password);

      navigate(locationState?.from ?? "/admin", { replace: true });
    } catch (submitError) {
      const message: string =
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível entrar.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Admin CMS
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">
          Entrar no painel
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Acesse a área privada para gerenciar os conteúdos do portal.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        <div className="space-y-2">
          <label
            htmlFor="admin-email"
            className="text-sm font-medium text-zinc-700"
          >
            Email
          </label>

          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-800 outline-none transition focus:border-[var(--color-primary)]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="admin-password"
            className="text-sm font-medium text-zinc-700"
          >
            Senha
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-800 outline-none transition focus:border-[var(--color-primary)]"
          />
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
        >
          Entrar
        </Button>
      </form>
    </Card>
  );
}