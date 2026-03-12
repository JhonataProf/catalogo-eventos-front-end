import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/design-system/ui";

export function SiteFooter(): ReactElement {
  return (
    <footer className="mt-12 border-t border-zinc-200 bg-white">
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-zinc-900">Celeiro do MS</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Plataforma para divulgação de eventos, cidades e pontos turísticos
              da região.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900">Navegação</p>
            <ul className="mt-2 space-y-2 text-sm text-zinc-600">
              <li>
                <Link className="hover:text-zinc-900" to="/eventos">
                  Eventos
                </Link>
              </li>
              <li>
                <Link className="hover:text-zinc-900" to="/pontos-turisticos">
                  Pontos turísticos
                </Link>
              </li>
              <li>
                <Link className="hover:text-zinc-900" to="/cidades/dourados">
                  Cidades
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900">
              Mídias sociais
            </p>
            <ul className="mt-2 space-y-2 text-sm text-zinc-600">
              <li>
                <a href="#" aria-label="Instagram" className="hover:text-zinc-900">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" aria-label="Facebook" className="hover:text-zinc-900">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" aria-label="YouTube" className="hover:text-zinc-900">
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900">Créditos</p>
            <p className="mt-2 text-sm text-zinc-600">
              © {new Date().getFullYear()} Celeiro do MS. Todos os direitos reservados.
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Desenvolvido para divulgação regional.
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between text-xs text-zinc-500">
          <span>Feito com foco em UX e performance.</span>

          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-secondary)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </span>
        </div>
      </Container>
    </footer>
  );
}