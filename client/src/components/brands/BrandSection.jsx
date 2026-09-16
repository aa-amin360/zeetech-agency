import React, { useState, useEffect } from "react";
import Container from "../common/Container.jsx";
import SectionLabel from "../common/SectionLabel.jsx";
import BrandMarquee from "./BrandMarquee.jsx";
import { brandService } from "../../services/brandService.js";
import { fallbackBrandRows } from "../../data/fallbackBrands.js";

/**
 * Full-width brand endorsement section with two-direction marquee
 */
export default function BrandSection() {
  const [brands, setBrands] = useState(fallbackBrandRows);

  useEffect(() => {
    brandService.getBrands().then((data) => {
      if (data?.row1 && data?.row2) {
        setBrands(data);
      }
    });
  }, []);

  return (
    <section className="w-full py-16 bg-neutral-100/70 border-y border-brand-dark/5 overflow-hidden">
      <Container className="text-center mb-8">
        <SectionLabel accent="diamond">
          TRUSTED BY 40+ OF THE WORLD'S TOP BRANDS
        </SectionLabel>
      </Container>

      {/* Infinite Dual Marquee */}
      <BrandMarquee row1={brands.row1} row2={brands.row2} />
    </section>
  );
}
