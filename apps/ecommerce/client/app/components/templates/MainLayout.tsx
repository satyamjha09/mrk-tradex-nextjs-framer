"use client";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import DemoModeBanner from "../feedback/DemoModeBanner";
import { isDemoMode } from "@/app/lib/demo";
import DemoCatalogBanner from "../feedback/DemoCatalogBanner";

export default function MainLayout({
  children,
  isDemoCatalog = false,
}: {
  children: React.ReactNode;
  isDemoCatalog?: boolean;
}) {
  const showCatalogBanner = isDemoCatalog && !isDemoMode();

  return (
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <Navbar />
      <DemoModeBanner />
      {showCatalogBanner && <DemoCatalogBanner />}
      <div className="w-full">{children}</div>
      <Footer />
    </main>
  );
}
