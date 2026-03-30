/**
 * A API admin exige `image: { base64, mimeType }` (ver catalogo-eventos-api webImageFileSchema).
 * O formulário legado usa `imageUrl` string: aceitamos data URLs; URLs http(s) exigem fluxo de upload futuro.
 */
export function webImagePayloadFromImageUrlField(
  imageUrl: string | undefined,
  fieldLabel: string,
): { base64: string; mimeType: string; filename?: string } {
  const trimmed = imageUrl?.trim() ?? "";
  if (!trimmed) {
    throw new Error(
      `${fieldLabel}: imagem obrigatória. Envie um arquivo (data URL) compatível com a API.`,
    );
  }

  const match = trimmed.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!match?.[1] || !match[2]) {
    throw new Error(
      `${fieldLabel}: use upload que gere data URL ou informe data:image/...;base64,... — URLs http(s) puras ainda não são convertidas automaticamente.`,
    );
  }

  return {
    mimeType: match[1].toLowerCase(),
    base64: match[2],
    filename: "upload",
  };
}
