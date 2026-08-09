// @ts-nocheck
"use client";

import WaterSectionImage from "@/app/assets/images/mrk-water-section-bg.jpeg";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  isPreview?: boolean;
}

const HeroSection = ({ isPreview = false }: HeroSectionProps) => {
  return (
    <section
      className={`relative left-1/2 w-screen -translate-x-1/2 bg-white ${
        isPreview ? "my-2 scale-95" : "my-0"
      }`}
    >
      <div className="relative min-h-[620px] overflow-hidden bg-[#f6fbff] sm:min-h-[680px] lg:min-h-[760px]">
        <Image
          src={WaterSectionImage}
          alt="Farmer standing near flowing water in an agricultural field"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.62)_38%,rgba(255,255,255,0.28)_72%,rgba(255,255,255,0.12)_100%)]" />

        <div className="relative mx-auto flex min-h-[620px] max-w-[1240px] flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[680px] sm:px-8 lg:min-h-[760px]">
          <div className="max-w-[980px]">
            <p className="mb-8 text-xs font-medium uppercase tracking-[0.45em] text-[#179be7] sm:text-sm">
              Submersible starters & panels - since 2005
            </p>
            <h1 className="text-5xl font-black leading-[1.05] tracking-normal text-[#0b2035] sm:text-7xl lg:text-[104px]">
              <span className="text-[#219fe5]">Water</span> is life, and we fill
              <br className="hidden sm:block" />
              your life with <span className="text-[#219fe5]">water</span>.
            </h1>
            <p className="mx-auto mt-8 max-w-[760px] text-lg leading-8 text-[#5f7488] sm:text-2xl sm:leading-10">
              MRK submersible starters and panels protect every pump that brings
              India its water, for homes, farms and industry, across
              single-phase and three-phase.
            </p>

            <div className="mt-10 flex justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#219fe5] px-9 py-4 text-base font-bold text-white shadow-[0_18px_45px_rgba(33,159,229,0.24)] transition-colors hover:bg-[#168bd0]"
              >
                Explore the range
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
