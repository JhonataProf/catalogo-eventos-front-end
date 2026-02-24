import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../features/eventos/componentes/Header";
import SideBar from "../../features/eventos/componentes/SideBar";
import type { Tab } from "../../features/eventos/pages/DouradosEventosPage";

const DefaultTemplate = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("eventos");
  const [showFilters, setShowFilters] = useState(false);

  const handleSideMenuOpen = () => {
    setIsSideMenuOpen((prev) => !prev);
  };

  const handleShowFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <div className="min-h-screen text-[#3c203b] bg-slate-320">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-slate-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Ir para o conteúdo
      </a>
      {/* overlay do menu lateral */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={handleSideMenuOpen}
        />
      )}

      <SideBar
        open={isSideMenuOpen}
        handleSideMenuOpen={handleSideMenuOpen}
        handleActiveTab={(value) => {
          setTab(value as Tab);
          setIsSideMenuOpen(false);
        }}
      />

      <Header
        open={isSideMenuOpen}
        handleSideMenuOpen={handleSideMenuOpen}
        handleShowFilters={handleShowFilters}
      />

      <main
        id="conteudo-principal"
        className="max-w-5xl mx-auto px-4 pb-16 pt-8"
      >
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-[#9fb0c8]">
        Dourados+ • Projeto Inovador • Turma 2024.45.253 • Senac-MS.
      </footer>
    </div>
  );
};

export default DefaultTemplate;
