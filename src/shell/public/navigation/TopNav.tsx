import { useCidadeAtual } from "@/domains/cidade-atual/useCidadeAtual";
import { useCidadesPublicas } from "@/domains/cidade-atual/useCidadesPublicas";
import type { ICidade } from "@/entities/cidade/cidade.types";
import type { ChangeEvent, ReactElement } from "react";
import { Link, NavLink } from "react-router-dom";

function getNavLinkClassName(isActive: boolean): string {
  return isActive
    ? "text-[var(--color-secondary)]"
    : "hover:text-[var(--color-secondary)]";
}

export function TopNav(): ReactElement {
  const { cidade, setCidadeBySlug } = useCidadeAtual();
  const { cidades } = useCidadesPublicas();

  function handleCidadeChange(event: ChangeEvent<HTMLSelectElement>): void {
    const selectedSlug: string = event.target.value;
    setCidadeBySlug(selectedSlug);
  }

  return (
    <header className="border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="flex flex-col">
            <span className="text-lg font-bold text-[var(--color-secondary)]">
              Celeiro do MS
            </span>
            <span className="text-xs text-zinc-500">
              Portal regional de turismo e experiências
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-700 md:flex">
            <NavLink
              to="/"
              className={({ isActive }: { isActive: boolean }) =>
                getNavLinkClassName(isActive)
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/eventos"
              className={({ isActive }: { isActive: boolean }) =>
                getNavLinkClassName(isActive)
              }
            >
              Eventos
            </NavLink>

            <NavLink
              to="/pontos-turisticos"
              className={({ isActive }: { isActive: boolean }) =>
                getNavLinkClassName(isActive)
              }
            >
              Pontos turísticos
            </NavLink>

            <NavLink
              to="/cidades/dourados"
              className={({ isActive }: { isActive: boolean }) =>
                getNavLinkClassName(isActive)
              }
            >
              Cidades
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <label
            htmlFor="cidade-atual"
            className="text-sm font-medium text-zinc-700"
          >
            Cidade atual
          </label>

          <select
            id="cidade-atual"
            value={cidade.slug}
            onChange={handleCidadeChange}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition focus:border-[var(--color-primary)]"
          >
            {cidades.map((item: ICidade) => (
              <option key={item.id} value={item.slug}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-700 md:hidden">
          <NavLink
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              getNavLinkClassName(isActive)
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/eventos"
            className={({ isActive }: { isActive: boolean }) =>
              getNavLinkClassName(isActive)
            }
          >
            Eventos
          </NavLink>

          <NavLink
            to="/pontos-turisticos"
            className={({ isActive }: { isActive: boolean }) =>
              getNavLinkClassName(isActive)
            }
          >
            Pontos turísticos
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
