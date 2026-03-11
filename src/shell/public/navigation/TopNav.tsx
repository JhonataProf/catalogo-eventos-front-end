import type { ChangeEvent, ReactElement } from "react";
import { NavLink } from "react-router-dom";
import Logo from "@/assets/celeiro_ms_logo.jpg";
import { useCidadeAtual } from "@/domains/cidade-atual/useCidadeAtual";
import { useCidadesPublicas } from "@/domains/cidade-atual/useCidadesPublicas";
import type { ICidade } from "@/entities/cidade/cidade.types";

export function TopNav(): ReactElement {
  const { cidade, setCidadeBySlug } = useCidadeAtual();
  const { cidades } = useCidadesPublicas();

  function handleCidadeChange(event: ChangeEvent<HTMLSelectElement>): void {
    setCidadeBySlug(event.target.value);
  }

  const linkBase: string =
    "rounded-xl px-3 py-2 text-sm font-medium transition";
  const linkActive: string = "bg-black/5 text-zinc-900";
  const linkIdle: string = "text-zinc-600 hover:bg-black/5 hover:text-zinc-900";

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:rgba(0,152,201,0.12)]">
              <img
                src={Logo}
                alt="Logo do Celeiro do MS"
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
          </NavLink>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-zinc-900">
              Celeiro do MS
            </p>
            <p className="text-xs text-zinc-500">Turismo &amp; Eventos</p>
          </div>
        </div>

        <nav
          className="order-3 flex w-full items-center gap-1 overflow-x-auto md:order-2 md:w-auto"
          aria-label="Navegação principal"
        >
          <NavLink
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/pontos-turisticos"
            className={({ isActive }: { isActive: boolean }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Pontos turísticos
          </NavLink>

          <NavLink
            to="/eventos"
            className={({ isActive }: { isActive: boolean }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Eventos
          </NavLink>

          <NavLink
            to="/cidades/dourados"
            className={({ isActive }: { isActive: boolean }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Cidades
          </NavLink>
        </nav>

        <div className="order-2 flex items-center gap-2 md:order-3">
          <label
            htmlFor="cidade-atual"
            className="hidden text-sm font-medium text-zinc-700 sm:block"
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
      </div>
    </header>
  );
}