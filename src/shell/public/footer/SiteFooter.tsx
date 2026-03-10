import type { ReactElement } from "react";
import { Container } from "@/design-system/ui/Container";

export function SiteFooter(): ReactElement {
  return (
    <footer className="mt-12 border-t border-black/5 bg-white">
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900">Celeiro do MS</h2>
            <p className="text-sm leading-6 text-zinc-600">
              Portal público para divulgação de cidades, eventos, atrativos e
              experiências da região.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
              Informações
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>Sobre o portal</li>
              <li>Cidades da região</li>
              <li>Eventos e atrativos</li>
              <li>Contato institucional</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
              Redes sociais e créditos
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>YouTube</li>
              <li>Desenvolvido para o portal Celeiro do MS</li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}