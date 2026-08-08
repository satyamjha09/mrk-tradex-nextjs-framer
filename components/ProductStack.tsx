"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

// the site header is fixed at the top, so this section's own tab bar has to sit
// below it rather than at viewport 0 or the two would overlap.
const SITE_NAV_HEIGHT = 68;

type PanelData = {
  no: string;
  category: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  features: string[];
  buttonText: string;
  href: string;
};

const PANELS: PanelData[] = [
  {
    no: "01",
    category: "MRG Auto-Timer Series",
    title: "The tank that never overflows.",
    description:
      "Set the time on the display; the pump stops automatically.",
    image: "/images/mrg-dpt-2-auto-timer.jpg",
    alt: "MRG DPT-2 auto-timer panel",
    features: [
      "Automatic pump control",
      "Timer-based operation",
      "Simple digital display",
    ],
    buttonText: "Explore MRG",
    href: "#mrg",
  },
  {
    no: "02",
    category: "WLC Smart Plug",
    title: "Water-level control, reduced to a single plug.",
    description:
      "Route the pump’s supply through it and run the pump automatically.",
    // /images/wlc-smart-plug.png does not exist — this is the real file on disk
    image: "/images/MRK WEBSITE/WLC Smart Plug/DOC-20260802-WA0063_.jpg",
    alt: "MRK WLC Smart Plug",
    features: ["SSO · up to 1.5 HP", "ISO · Tullu", "Wi-Fi model"],
    buttonText: "Explore WLC",
    href: "#wlc",
  },
  {
    no: "03",
    category: "MRX-HD Three-Phase Panel",
    title: "The panel that tells you why it stopped.",
    description: "Fully digital, with live voltage-and-current monitoring.",
    image: "/images/three-phase-panel.png",
    alt: "MRX-HD three-phase panel",
    features: [
      "Error-code display",
      "Single-phasing protection",
      "Live voltage monitoring",
      "Live current monitoring",
    ],
    buttonText: "Explore MRX-HD",
    href: "#mrx-hd",
  },
];

function Dots() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(#cfd5de_0.8px,transparent_0.8px)] [background-size:6px_6px]" />
  );
}

function PanelVisual({ panel }: { panel: PanelData }) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#f2f4f7] px-6">
      <Dots />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-aqua via-aqua/70 to-transparent" />
      <img
        src={panel.image}
        alt={panel.alt}
        className="relative max-h-[78%] w-auto max-w-full object-contain drop-shadow-[0_16px_28px_rgba(20,35,57,0.18)]"
      />
    </div>
  );
}

// one visual on the left, the panel's points as text on the right. the vh-linked
// the product shot on the left, its copy and feature list on the right. the
// vh-linked gaps keep the text column inside the sticky stage on short viewports.
function PanelBody({ panel }: { panel: PanelData }) {
  return (
    <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[240px] overflow-hidden rounded-[6px] border border-[#dce3ed] shadow-[0_8px_20px_rgba(20,35,57,0.055)] sm:h-[300px] xl:h-[min(430px,calc(100svh_-_330px))]"
      >
        <PanelVisual panel={panel} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-[clamp(10px,1.7vh,18px)]"
      >
        <p className="text-[15px] leading-[1.6] text-muted xl:text-[16px]">
          {panel.description}
        </p>

        <ul className="flex flex-col gap-[clamp(8px,1.4vh,14px)]">
          {panel.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 border-b border-[#eef2f7] pb-[clamp(8px,1.4vh,14px)] last:border-0 last:pb-0"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="mt-[3px] h-4 w-4 shrink-0 text-aqua"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[15px] font-medium tracking-[-0.01em] text-ink xl:text-[16px]">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className="pt-1">
          <a
            href={panel.href}
            className="inline-flex items-center gap-2 rounded-[4px] bg-aqua px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-marine"
          >
            {panel.buttonText}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function Panel({ panel }: { panel: PanelData }) {
  return (
    <div className="h-full overflow-hidden rounded-[5px] border border-[#edf1f5] bg-white shadow-[0_15px_38px_rgba(20,31,50,0.09)]">
      <div className="px-5 pb-5 pt-6 sm:px-7 sm:pt-8 xl:px-10 xl:pt-9 [@media(max-height:720px)]:pb-3 [@media(max-height:720px)]:pt-5">
        <header className="mb-5 flex items-center gap-4 xl:mb-7 [@media(max-height:720px)]:mb-3">
          <span className="font-mono text-[13px] font-semibold text-aqua">
            {panel.no}
          </span>
          <h2 className="text-[22px] font-semibold tracking-[-0.045em] text-ink xl:text-[29px]">
            {panel.title}
          </h2>
        </header>

        <PanelBody panel={panel} />
      </div>
    </div>
  );
}

function EnteringPanel({
  panel,
  index,
  total,
  progress,
}: {
  panel: PanelData;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index === 0 ? 0 : (index - 1) / total;
  const end = index === 0 ? 1 : index / total;
  const y = useTransform(
    progress,
    index === 0 ? [0, 1] : [start, end],
    index === 0 ? ["0%", "0%"] : ["103%", "0%"],
    { clamp: true },
  );

  return (
    <motion.div
      style={{ y, zIndex: index + 1 }}
      className="absolute inset-0 will-change-transform"
    >
      <Panel panel={panel} />
    </motion.div>
  );
}

function StackingStage({
  topOffset,
  activeIndex,
  setActiveIndex,
}: {
  topOffset: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [stageHeight, setStageHeight] = useState(0);
  const totalSteps = PANELS.length;
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useLayoutEffect(() => {
    const measure = () =>
      setStageHeight(Math.max(window.innerHeight - topOffset - 12, 1));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [topOffset]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      PANELS.length - 1,
      Math.max(0, Math.ceil(value * totalSteps - 0.02)),
    );
    if (next !== activeIndex) setActiveIndex(next);
  });

  if (!stageHeight) return null;

  return (
    <div
      id="stack-track"
      ref={trackRef}
      className="relative"
      style={{ height: stageHeight * (totalSteps + 1) }}
    >
      <div
        className="sticky overflow-hidden"
        style={{ top: topOffset, height: stageHeight }}
      >
        {PANELS.map((panel, index) => (
          <EnteringPanel
            key={panel.no}
            panel={panel}
            index={index}
            total={totalSteps}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductStackSection() {
  const navRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState(72);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const node = navRef.current;
    if (!node) return undefined;
    const measure = () => setNavHeight(node.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const stageOffset = SITE_NAV_HEIGHT + navHeight;

  const scrollToPanel = (index: number) => {
    const track = document.getElementById("stack-track");
    if (!track) return;
    const stageHeight = Math.max(window.innerHeight - stageOffset - 12, 1);
    const targetY =
      track.getBoundingClientRect().top + window.scrollY + index * stageHeight;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <section id="solutions" className="min-h-screen bg-[#f5f8fc] text-ink">
      <header
        ref={navRef}
        className="sticky z-40 border-b border-[#edf1f6] bg-[#f5f8fc]/95 backdrop-blur-md"
        style={{ top: SITE_NAV_HEIGHT }}
      >
        <div className="mx-auto flex max-w-[1500px] items-center gap-6 px-4 py-3 sm:px-7">
          <nav className="flex flex-1 gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PANELS.map((panel, index) => (
              <button
                key={panel.no}
                type="button"
                onClick={() => scrollToPanel(index)}
                className={`relative shrink-0 py-3 text-[14px] font-semibold transition-colors lg:text-[16px] ${
                  activeIndex === index ? "text-ink" : "text-[#7890aa]"
                }`}
              >
                {panel.category}
                {activeIndex === index && (
                  <motion.span
                    layoutId="stack-active-tab"
                    className="absolute inset-x-0 -bottom-[13px] h-[3px] bg-aqua"
                  />
                )}
              </button>
            ))}
          </nav>

        
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-3 pb-[clamp(3rem,6vw,5.5rem)] pt-4 sm:px-6">
        <StackingStage
          topOffset={stageOffset}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </div>
    </section>
  );
}
