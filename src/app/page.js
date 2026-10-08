import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PriceRisers from "./components/PriceRisers";

export default function Home() {
  return (
    <main>
      <Navbar />

      <Hero />

      <section className="mx-auto max-w-7xl px-4">
        <PriceRisers />
      </section>
    </main>
  );
}