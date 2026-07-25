import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { Newsletter } from "@/components/sections/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Testimonials />
      <Newsletter />
    </>
  );
}
