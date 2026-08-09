"use client";
import React from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { ApolloError } from "@apollo/client";
import ProductCard from "./ProductCard";
import { Product } from "@/app/types/productTypes";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductSectionProps {
  title: string;
  products: Product[];
  loading: boolean;
  error: ApolloError | undefined;
  showTitle?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  error,
  showTitle = false,
}) => {
  const [firstWord, ...restWords] = title.split(" ");
  const shouldHighlight = title.toLowerCase().includes("top");

  if (error) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                Error loading {title.toLowerCase()}
              </h3>
              <p className="text-red-600 text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {title.toLowerCase()} available
              </h3>
              <p className="text-gray-600 text-sm">
                Check back soon for updated MRK catalog entries.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-8 lg:px-16">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-3xl font-black tracking-normal text-black sm:text-4xl">
                {shouldHighlight ? (
                  <>
                    <span className="bg-orange-100 px-1">{firstWord}</span>{" "}
                    {restWords.join(" ")}
                  </>
                ) : (
                  title
                )}
              </h2>
              {products.length > 5 && (
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 self-start rounded-full border border-black px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white sm:self-auto"
                >
                  View Catalog
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        )}

        <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-8 [scrollbar-width:none] sm:-mx-8 sm:gap-6 sm:px-8 lg:-mx-16 lg:px-16 [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] snap-start sm:min-w-[340px] lg:min-w-[354px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProductSection);
