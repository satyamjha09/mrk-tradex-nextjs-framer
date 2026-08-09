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
    title: "Starter with Built-in Auto-Off Timer",
    description: (
      <>
        Set how long you want the pump to run, and the starter switches it{" "}
        <strong>OFF automatically</strong> when the time is over.
      </>
    ),
    image: "/images/mrg-dpt-2-auto-timer.jpg",
    alt: "MRG DPT-2 auto-timer panel",
    features: [
      "Helps prevent overhead tank overflow",
      "No separate WLC required",
      "No additional sensor wiring needed",
    ],
    buttonText: "Explore MRG",
    href: "#mrg",
  },
  {
    no: "02",
    category: "WLC Smart Plug",
    title: "Smart Water-Level Control for Your Pump",
    description:
      "Route the pump’s supply through it and run the pump automatically.",
    // /images/wlc-smart-plug.png does not exist — this is the real file on disk
    image: "/images/MRK WEBSITE/WLC Smart Plug/DOC-20260802-WA0063_.jpg",
    alt: "MRK WLC Smart Plug",
    copy:
      "Connect your Tullu or submersible pump through the smart plug. Its tank sensor detects the water level and automatically controls the pump.",
    featureList: [
      "Automatically manages pump ON/OFF",
      "Helps prevent tank overflow",
      "LED display shows the tank water level",
    ],
    features: ["SSO · up to 1.5 HP", "ISO · Tullu", "Wi-Fi model"],
    buttonText: "Explore WLC",
    href: "#wlc",
  },
  {
    no: "03",
    category: "MRX-HD : III-Phase Digital Starter Panel",
    title: "Smarter Protection for III-Phase Pumps",
    description: (
      <>
        A fully digital starter panel for{" "}
        <strong>agriculture, industry and housing</strong>, designed to monitor
        and protect your pump automatically.
      </>
    ),
    image: "/images/three-phase-panel.png",
    alt: "MRX-HD three-phase panel",
    features: [
      "Displays voltage and current load",
      "Protects against phase failure and voltage fluctuations",
      "Error codes make faults easier to identify",
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
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#f2f4f7] px-4 sm:px-6">
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
            <span className="font-mono text-[15px] font-semibold text-aqua sm:text-[16px] xl:text-[18px]">
              {panel.no}
            </span>
            <p className="text-[18px] font-semibold text-aqua sm:text-[20px] xl:text-[24px]">
              {panel.category}
            </p>
          </div>
          {/* no nowrap: these titles are wider than the text column at lg/xl */}
          <h2 className="text-[20px] font-semibold leading-[1.12] tracking-[-0.025em] text-ink sm:text-[24px] sm:leading-[1.08] xl:text-[32px]">
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

  return (
    <section id="solutions" className="bg-[#f5f8fc] text-ink lg:min-h-screen">
      <div className="mx-auto max-w-[1500px] px-4 pb-[clamp(3rem,6vw,5.5rem)] pt-10 sm:px-6 sm:pt-14 lg:pt-4">
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
