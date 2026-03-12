import type { ReactElement } from "react";
import { HomeHeroCarousel } from "../components/HomeHeroCarousel";
import { CeleiroIntroSection } from "../components/CeleiroIntroSection";
import { CitiesGridSection } from "../components/CitiesGridSection";

export function HomePage(): ReactElement {
  return (
    <div className="bg-portal">
      <HomeHeroCarousel />
      <CeleiroIntroSection />
      <CitiesGridSection />
    </div>
  );
}