# Gate antes de produção ou Fase 2 (SEO)

Checklist derivada da revisão de production-readiness. Itens **já tratados** no repositório aparecem como concluídos na medida do possível no front/infra; o restante depende de API, DNS e processo.

## Já endereçado no front / Terraform Fase 1

- [x] Headers de segurança básicos no CloudFront (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `X-XSS-Protection`, `Permissions-Policy`).
- [x] `robots.txt` com `Disallow: /admin`.
- [x] Meta `noindex, nofollow` na área admin (layouts CRM).
- [x] `index.html`: `lang="pt-BR"`, meta description, favicon SVG válido.
- [x] Workflow GitHub Actions para build + S3 + invalidação (manual).
- [x] Exemplo de backend Terraform remoto (`backend.tf.example`).

## Ainda obrigatório antes de “produção” real

- [ ] **API apenas HTTPS** no `VITE_PUBLIC_BFF_BASE_URL` (e opcionalmente `VITE_ADMIN_BFF_BASE_URL`) — evitar mixed content.
- [ ] **CORS** na API para a origem exata do front (CloudFront ou domínio).
- [x] **Auth CRM via API** — com URL de BFF no build, login usa `POST .../auth/login` + JWT; **mock só em `import.meta.env.DEV` sem URL**. Build de produção sem URL **não** autentica com credenciais falsas.
- [ ] **Deploy GitHub Actions** — preferir **OIDC** (`AWS_ROLE_ARN`) em vez de chaves de longa duração (workflow suporta ambos).
- [ ] **Backend Terraform** S3 + lock ativado quando mais de uma pessoa gerir infra.
- [ ] **Domínio próprio + ACM** quando sair do hostname `*.cloudfront.net`.
- [x] **Cliente HTTP público** alinhado ao contrato da API (envelope, paths) — manter testes ao evoluir o BFF.

## Fase 3 — entrega pública (v1) — concluído no repositório

- [x] `robots.txt` / `sitemap.xml` gerados no build quando `VITE_PUBLIC_SITE_URL` está definida (`scripts/finalize-public-seo.mjs`).
- [x] Metadata e canonical por rota pública (hook `usePublicPageMetadata` + env canônica).
- [x] GTM opcional via `VITE_PUBLIC_GTM_ID` (único ponto de injeção no HTML).
- [x] Erros globais em produção encaminhados a `reportPublicError` (extensível).

Ver checklist operacional: `docs/operations/fase3-public-delivery-hardening.md`.

## Fase posterior (SEO forte) — quando priorizado

- HTML rico por URL (SSR/pré-render/edge) conforme ADRs de arquitetura; sitemap dinâmico para fichas.

## Revisão periódica

- Política **CSP** no CloudFront (começar restritiva em staging).
- **WAF** e logs de acesso CloudFront para tráfego público relevante.
