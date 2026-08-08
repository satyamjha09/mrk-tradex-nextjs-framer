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

type GlyphName = "shield" | "bolt" | "gauge" | "wrench" | "pin" | "life";

type Card = {
  title: string;
  description: string;
} & (
  | { visual: "photo"; image: string; alt: string }
  | { visual: "list"; items: string[]; highlight: number }
  | { visual: "glyph"; glyph: GlyphName }
);

type PanelData = {
  id: string;
  label: string;
  badge?: string;
  categories?: string[];
  cards: Card[];
};

const PANELS: PanelData[] = [
  {
    id: "stack-range",
    label: "Our Range",
    badge: "POPULAR",
    cards: [
      {
        title: "Single-Phase Starters",
        description:
          "For homes and small farms, up to 7.5 HP. Manual and fully-digital.",
        visual: "photo",
        image: "/images/single-phase-starter.png",
        alt: "MRK single-phase starter",
      },
      {
        title: "Three-Phase Panels",
        description:
          "DOL and Star-Delta panels for agriculture, industry and housing.",
        visual: "photo",
        image: "/images/three-phase-panel.png",
        alt: "MRK three-phase control panel",
      },
      {
        title: "WLC Smart Plugs",
        description:
          "Effortless water-level control, including an advanced Wi-Fi model.",
        visual: "photo",
        image: "/images/mrg-dpt-2-auto-timer.png",
        alt: "MRK water-level control",
      },
      {
        title: "Cables & Accessories",
        description:
          "Submersible cables and fittings, built and tested to the same standard.",
        visual: "photo",
        image: "/images/panel-components.png",
        alt: "MRK cables and accessories",
      },
    ],
  },
  {
    id: "stack-protection",
    label: "Protection Built In",
    categories: [
      "Dry Run",
      "Overload",
      "Voltage",
      "Phase Failure",
      "Auto-Restart",
    ],
    cards: [
      {
        title: "Dry-Run Cut-Off",
        description:
          "Cuts power the moment the borewell runs dry, before the pump burns out.",
        visual: "list",
        items: [
          "WATER LEVEL SENSED",
          "FLOW LOST",
          "DRY RUN DETECTED",
          "SUPPLY CUT",
          "PUMP SAFE",
        ],
        highlight: 2,
      },
      {
        title: "Overload Trip",
        description:
          "Trips on sustained overcurrent and holds until it is safe to restart.",
        visual: "list",
        items: [
          "CURRENT NORMAL",
          "LOAD RISING",
          "OVERLOAD TRIP",
          "MOTOR ISOLATED",
          "READY TO RESET",
        ],
        highlight: 2,
      },
      {
        title: "Voltage Guard",
        description:
          "Isolates the pump on high and low voltage, then restores automatically.",
        visual: "glyph",
        glyph: "bolt",
      },
      {
        title: "Phase Failure Sensing",
        description:
          "Detects a lost or reversed phase on three-phase supply instantly.",
        visual: "glyph",
        glyph: "gauge",
      },
    ],
  },
  {
    id: "stack-field",
    label: "Built for the Field",
    categories: ["Testing", "Enclosures", "Wiring", "Service", "Warranty"],
    cards: [
      {
        title: "Tested Before Dispatch",
        description:
          "Every unit is bench-tested under load before it leaves the floor.",
        visual: "list",
        items: [
          "ASSEMBLED",
          "LOAD APPLIED",
          "TRIP VERIFIED",
          "SEALED",
          "DISPATCHED",
        ],
        highlight: 2,
      },
      {
        title: "Sealed Enclosures",
        description:
          "Dust and splash resistant housings rated for pump-house conditions.",
        visual: "glyph",
        glyph: "shield",
      },
      {
        title: "Field-Friendly Wiring",
        description:
          "Labelled terminals and generous cable room, so installs go quickly.",
        visual: "photo",
        image: "/images/panel-components.png",
        alt: "MRK panel wiring and components",
      },
      {
        title: "Backed by Service",
        description:
          "A dealer network across 500+ cities, with spares that stay available.",
        visual: "glyph",
        glyph: "wrench",
      },
    ],
  },
  {
    id: "stack-start",
    label: "Get Started",
    categories: ["Pick a Model", "Find a Dealer", "Install", "Support"],
    cards: [
      {
        title: "Pick Your Model",
        description:
          "Match the starter or panel to your pump rating and your supply.",
        visual: "photo",
        image: "/images/intro-products.jpg",
        alt: "The MRK product range",
      },
      {
        title: "Find Your Dealer",
        description:
          "1000+ dealers across 20+ states, so there is likely one in your town.",
        visual: "glyph",
        glyph: "pin",
      },
      {
        title: "Install in Minutes",
        description:
          "Straightforward terminals and a wiring diagram in every box.",
        visual: "list",
        items: [
          "MOUNT THE UNIT",
          "LAND THE CABLES",
          "SET THE RATING",
          "POWER ON",
          "RUNNING",
        ],
        highlight: 4,
      },
      {
        title: "We Stay Available",
        description:
          "Support, spares and replacements, all handled through your dealer.",
        visual: "glyph",
        glyph: "life",
      },
    ],
  },
];

const GLYPH_PATHS: Record<GlyphName, string> = {
  shield: "M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6l7-3z",
  bolt: "M13 2L4.5 13H11l-1 9 8.5-11H12l1-9z",
  gauge: "M12 13a2 2 0 100-4 2 2 0 000 4zm0-9a9 9 0 019 9M3 13a9 9 0 019-9m4.5 4.5L13 12",
  wrench:
    "M20 6.5a4.5 4.5 0 01-6 4.2L6.7 18a2.1 2.1 0 11-3-3l7.3-7.3A4.5 4.5 0 0117.5 3l-3 3 1.5 1.5 3-3c.3.6.5 1.3.5 2z",
  pin: "M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11zm0-8.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
  life: "M12 21a9 9 0 100-18 9 9 0 000 18zm0-5.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM5.6 5.6l3.9 3.9m5 5l3.9 3.9m0-12.8l-3.9 3.9m-5 5l-3.9 3.9",
};

function Glyph({ name }: { name: GlyphName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-12 w-12 text-aqua"
    >
      <path
        d={GLYPH_PATHS[name]}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Dots() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(#cfd5de_0.8px,transparent_0.8px)] [background-size:6px_6px]" />
  );
}

function CardVisual({ card }: { card: Card }) {
  if (card.visual === "photo") {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#f2f4f7] px-6">
        <Dots />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-aqua via-aqua/70 to-transparent" />
        <img
          src={card.image}
          alt={card.alt}
          className="relative max-h-[78%] w-auto max-w-full object-contain drop-shadow-[0_16px_28px_rgba(20,35,57,0.18)]"
        />
      </div>
    );
  }

  if (card.visual === "list") {
    return (
      <div className="relative flex h-full flex-col justify-center gap-2.5 overflow-hidden bg-[#f3f4f6] px-5">
        <Dots />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-aqua via-aqua/65 to-transparent" />
        {card.items.map((item, index) => (
          <div
            key={item}
            className={`relative rounded-full px-3 py-2.5 text-center font-mono text-[9px] uppercase tracking-[0.1em] ${
              index === card.highlight
                ? "bg-white font-semibold text-ink shadow-sm"
                : "bg-white/60 text-[#6b7683]"
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#edf3fd]">
      <Dots />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-aqua/75 to-transparent" />
      <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-lg">
        <Glyph name={card.glyph} />
      </div>
    </div>
  );
}

// one visual on the left, the panel's points as text on the right. the vh-linked
// gaps keep the text column inside the sticky stage on short viewports.
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
        <CardVisual card={panel.cards[0]} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-[clamp(10px,1.7vh,18px)]"
      >
        {panel.cards.map((card) => (
          <div
            key={card.title}
            className="border-b border-[#eef2f7] pb-[clamp(8px,1.4vh,14px)] last:border-0 last:pb-0"
          >
            <h3 className="text-[16px] font-semibold tracking-[-0.03em] text-ink xl:text-[18px]">
              {card.title}
            </h3>
            <p className="mt-1 text-[13px] leading-[1.5] text-muted xl:text-[14px]">
              {card.description}
            </p>
          </div>
        ))}

        <div className="flex items-center gap-4 pt-1">
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-[4px] bg-aqua px-4 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-marine"
          >
            Enquire
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
          <a href="#range" className="text-[13px] font-semibold text-aqua">
            Learn More
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
          <h2 className="text-[24px] font-semibold tracking-[-0.055em] text-ink xl:text-[31px]">
            {panel.label}
          </h2>
          {panel.badge && (
            <span className="rounded-full bg-ink px-5 py-2 text-[11px] font-semibold text-white">
              {panel.badge}
            </span>
          )}
        </header>

        {panel.categories && (
          <div className="mb-5 flex gap-6 overflow-x-auto border-b border-[#e5eaf1] pb-4 text-[14px] font-semibold text-[#7790ac] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:mb-7 [@media(max-height:720px)]:mb-3 [@media(max-height:720px)]:pb-2">
            {panel.categories.map((category, index) => (
              <span
                key={category}
                className={`relative shrink-0 ${index === 0 ? "text-ink" : ""}`}
              >
                {category}
                {index === 0 && (
                  <span className="absolute -bottom-[17px] left-0 h-[3px] w-full bg-aqua" />
                )}
              </span>
            ))}
          </div>
        )}

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
            key={panel.id}
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
                key={panel.id}
                type="button"
                onClick={() => scrollToPanel(index)}
                className={`relative shrink-0 py-3 text-[14px] font-semibold transition-colors lg:text-[16px] ${
                  activeIndex === index ? "text-ink" : "text-[#7890aa]"
                }`}
              >
                {panel.label}
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
