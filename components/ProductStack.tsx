"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { shopUrl } from "@/app/data/catalog/series";

// The site header is fixed at the top, so the sticky product stage sits below it.
const SITE_NAV_HEIGHT = 68;

type PanelData = {
  no: string;
  category: string;
  title: string;
  description: ReactNode;
  copy?: ReactNode;
  image: string;
  alt: string;
  features: string[];
  featureList?: string[];
  buttonText: string;
  href: string;
};

const PANELS: PanelData[] = [
  {
    no: "01",
    category: "MRG Series",
    title: "Starter with Integrated Timer",
    description: (
      <>
        A starter with an integrated timer. Once the required time is set using the buttons on the display meter, the starter automatically switches off when the set time is completed.{" "}
        
      </>
    ),
    image: "/images/MRG16A_(4).png",
    alt: "MRG DPT-2 auto-timer panel",
    features: [
      "Helps reduce water wastage from the overhead tank",
      " No additional wiring required",
      "No cost of a separate WLC plug",
    ],
    buttonText: "Explore MRG",
    href: shopUrl("single-phase-starter", "MRG"),
  },
  {
    no: "02",
    category: "WLC Smart Plug",
    title: "Plug-and-Play Model for Tank Overflow Control",
    description:(
      <>
       A unique plug-and-play model designed to control overhead tank overflow. The power supply of the <strong> Tullu or submersible </strong> pump is connected through the Smart Plug.
      </>
    ),
    // /images/wlc-smart-plug.png does not exist — this is the real file on disk
    image: "/images/wlc.png",
    alt: "MRK WLC Smart Plug",
    copy:
      "Connect your Tullu or submersible pump through the smart plug. Its tank sensor detects the water level and automatically controls the pump.",
    featureList: [
      "Sensor wire detects the water level inside the overhead tank",
      "Automatically manages the power supply to the starter",
      "LED display accurately shows the water level inside the tank",
    ],
    features: ["SSO · up to 1.5 HP", "ISO · Tullu", "Wi-Fi model"],
    buttonText: "Explore WLC",
    // The panel covers SSO, ISO and Wi-Fi, so it lands on the group, not a model.
    href: shopUrl("wlc-smart-plug"),
  },
  {
    no: "03",
    category: "Three Phase – MRX-HD",
    title: "Fully Digital III-Phase Starter Panel",
    description: (
      <>
        India’s first fully digital three-phase starter panel, designed for{" "}
        <strong>agriculture, industrial, and housing applications.</strong>
      </>
    ),
    image: "/images/MRX-HD_F04_(3).png",
    alt: "MRX-HD three-phase panel",
    features: [
      "Smart digital meter displays current load and voltage",
      "Senses incoming phases and acts as an SPP in case of phase failure",
      "Protects connected devices from voltage fluctuations",
    ],
    buttonText: "Explore MRX-HD",
    // MRX-HD is one of the Star Delta series' match tokens.
    href: shopUrl("three-phase-panel", "STAR-DELTA"),
  },
];

function Dots() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(#cfd5de_0.8px,transparent_0.8px)] [background-size:6px_6px]" />
  );
}

function PanelVisual({ panel }: { panel: PanelData }) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#f2f4f7] px-4 sm:px-6">
      <Dots />

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-aqua via-aqua/70 to-transparent" />

      <img
        src={panel.image}
        alt={panel.alt}
        className="
          relative
          max-h-[92%]
          w-auto
          max-w-full
          object-contain
          drop-shadow-[0_16px_28px_rgba(20,35,57,0.18)]
        "
      />
    </div>
  );
}

// one visual on the left, the panel's points as text on the right. the vh-linked
// the product shot on the left, its copy and feature list on the right. the
// vh-linked gaps keep the text column inside the sticky stage on short viewports.
function PanelBody({ panel }: { panel: PanelData }) {
  const copy = panel.copy ?? panel.description;
  const features = panel.featureList ?? panel.features;

  return (
    <div className="grid h-full items-center gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[230px] overflow-hidden rounded-[6px] border border-[#dce3ed] shadow-[0_8px_20px_rgba(20,35,57,0.055)] sm:h-[320px] md:h-[400px] lg:h-[min(460px,calc(100svh_-_210px))] xl:h-[min(560px,calc(100svh_-_160px))]"
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
        <header className="mb-1 sm:mb-2">
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 sm:mb-4">
            <span className="font-mono text-[17px] font-semibold text-aqua sm:text-[19px] xl:text-[22px]">
              {panel.no}
            </span>
            <p className="text-[21px] font-semibold text-aqua sm:text-[24px] xl:text-[30px]">
              {panel.category}
            </p>
          </div>
          {/* no nowrap: these titles are wider than the text column at lg/xl.
              deliberately lighter and smaller than the blue category above it —
              the category leads, the title reads as its subline. */}
          <h2 className="text-[18px] font-normal leading-[1.2] tracking-[-0.015em] text-ink sm:text-[21px] sm:leading-[1.18] xl:text-[26px]">
            {panel.title}
          </h2>
        </header>

        <p className="max-w-[48ch] text-[13px] leading-[1.58] text-muted sm:text-[14px] sm:leading-[1.6] xl:text-[15px] [&_strong]:font-semibold [&_strong]:text-ink">
          {copy}
        </p>

        <ul className="flex flex-col gap-[clamp(8px,1.4vh,14px)]">
          {features.map((feature) => (
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
              <span className="text-[14px] font-medium tracking-[-0.01em] text-ink sm:text-[15px] xl:text-[16px]">
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
      <div className="flex h-full items-center px-4 py-5 sm:px-7 sm:py-8 xl:px-10 xl:py-9 [@media(min-width:1024px)_and_(max-height:720px)]:py-5">
        <PanelBody panel={panel} />
      </div>
    </div>
  );
}

// Below lg the panels are laid out as ordinary cards. The sticky stack sizes
// every panel to one viewport, which cannot hold this much copy on a phone —
// the content ends up clipped by the stage's overflow-hidden.
function StaticPanels() {
  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      {PANELS.map((panel) => (
        <Panel key={panel.no} panel={panel} />
      ))}
    </div>
  );
}

// `true` only once mounted and wide enough, so the server and the first client
// render agree on the static layout.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isDesktop;
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
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useIsDesktop();

  // same fill as #range above it, so the two read as one continuous field
  // instead of meeting at a visible line.
  return (
    <section id="solutions" className="bg-[#e8f1fa] text-ink lg:min-h-screen">
      <div className="mx-auto max-w-[1340px] px-4 pb-[clamp(3rem,6vw,5.5rem)] pt-14 sm:px-6 sm:pt-16 lg:pt-16 xl:pt-20">
        {/* sits in normal flow above the sticky stage, so it scrolls away as the
            panels pin rather than eating the stage's viewport height. */}
             <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="max-w-[1050px] mb-8 sm:mb-10 lg:mb-12 xl:mb-14 2xl:mb-18"
              >
              <h2
                className="
                  font-mono text-[clamp(1.75rem,4vw,3rem)] font-bold
                  leading-[1.05] uppercase
                  tracking-[0.05em] text-[#1598df]
                "
                data-hi={"हमारे लोकप्रिय उत्पाद।"}
              >
                OUR POPULAR PRODUCTS
              </h2>

              <h2
                className="
                  sm:text-[clamp(1.75rem,3.4vw,3.6rem)]
                  [@media(max-height:760px)]:text-[clamp(1.6rem,3vw,2.9rem)]
                  [@media(max-height:650px)]:text-[clamp(1.45rem,2.6vw,2.4rem)]
                  tracking-[0.015em]
                "
              >
                For every pump there is one MRK starter
              </h2>
            </motion.div>

        {isDesktop ? (
          <StackingStage
            topOffset={SITE_NAV_HEIGHT}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        ) : (
          <StaticPanels />
        )}
      </div>
    </section>
  );
}
