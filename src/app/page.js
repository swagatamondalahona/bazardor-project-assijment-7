import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductSection from "./components/ProductSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProductSection />
    </main>
  );
}