// @ts-nocheck
"use client";
import Footer from "../layout/Footer";
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
    <main className="flex min-h-screen w-full flex-col bg-white">
      {showCatalogBanner && <DemoCatalogBanner />}
      <div className="w-full">{children}</div>
      <Footer />
    </main>
  );
}
