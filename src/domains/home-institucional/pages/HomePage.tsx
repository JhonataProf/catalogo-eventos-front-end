import type { ReactElement } from "react";
import { CeleiroIntroSection } from "../components/CeleiroIntroSection";
import { CitiesGridSection } from "../components/CitiesGridSection";
import { HomeHeroCarousel } from "../components/HomeHeroCarousel";

export function HomePage(): ReactElement {
  return (
    <div className="bg-portal">
      <HomeHeroCarousel />
      <CeleiroIntroSection />
      <CitiesGridSection />
    </div>
  );
}