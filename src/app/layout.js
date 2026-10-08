import "./globals.css";
import Navbar from "./components/Navbar";
import PriceTicker from "./components/PriceTicker";
import { Suspense } from "react";

export const metadata = {
  title: "BazarDor",
  description: "আজকের বাজার দর",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        <PriceTicker />

        {children}
      </body>
    </html>
  );
}