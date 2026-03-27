/**
 * Ponto único para erros não tratados na área pública (Fase 3).
 * Hoje: log estruturado no console. Evoluir para Sentry/Datadog via env sem espalhar SDK nos domínios.
 */
export type PublicErrorContext = Record<string, string | number | boolean | undefined>;

export function reportPublicError(
  error: unknown,
  context?: PublicErrorContext,
): void {
  const payload = {
    scope: "public-web",
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  };
  console.error("[publicError]", payload);
}
