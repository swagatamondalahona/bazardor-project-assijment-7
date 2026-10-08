import Hero from "./components/Hero";
import PriceRisers from "./components/PriceRisers";
import PriceFallers from "./components/PriceFallers";
import AllProducts from "./components/AllProducts";

export default function Home() {
  return (
    <main>
      <Hero />
      <PriceRisers />
      <PriceFallers />
      <AllProducts />
    </main>
  );
}