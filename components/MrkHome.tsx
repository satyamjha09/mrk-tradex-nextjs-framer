"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function formatIndian(value: number) {
  const rounded = Math.round(value).toString();
  const lastThree = rounded.slice(-3);
  let rest = rounded.slice(0, -3);

  if (!rest) return lastThree;
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${lastThree}`;
}

const starIdeas = [
  {
    no: "01 · MRG Auto-Timer Series",
    title: "The tank that never overflows.",
    copy: "Set the time on the display; the pump stops automatically.",
    img: "/images/mrg-dpt-2-auto-timer.jpg",
    alt: "MRG DPT-2 auto-timer panel",
    chips: [],
    link: "See MRG →",
  },
  {
    no: "02 · WLC Smart Plug",
    title: "Water-level control, reduced to a single plug.",
    copy: "Route the pump's supply through it and run the pump automatically.",
    img: "/images/wlc-smart-plug.png",
    alt: "MRK WLC Smart Plug",
    chips: ["SSO · to 1.5 HP", "ISO · Tullu", "Wi-Fi model"],
    link: "See WLC →",
  },
  {
    no: "03 · MRX-HD Three-Phase Panel",
    title: "The panel that tells you why it stopped.",
    copy: "Fully digital, with live voltage-and-current monitoring.",
    img: "/images/three-phase-panel.png",
    alt: "MRX three-phase panel",
    chips: ["Error-code display", "Single-phasing protection"],
    link: "See MRX-HD →",
  },
];

// direction: 1 = next (new slide comes in from the right), -1 = previous.
const slideVariants = {
  enter: (direction: number) => ({ x: `${direction * 100}%`, opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: `${direction * -100}%`, opacity: 0 }),
};

const SLIDE_INTERVAL = 5000;

// Matches the Tailwind gap used by the product rail.
const RAIL_GAP = 56;

// Matches the Tailwind gap used by the testimonial rail.
const TRAIL_GAP = 8;

const testimonials = [
  {
    quote: "Placeholder for a real dealer testimonial, margins, range, and how MRK moves off the shelf.",
    name: "Dealer name",
    role: "City, State",
    initial: "D",
  },
  {
    quote: "Placeholder for a real farmer testimonial, reliability and protection during the season.",
    name: "Farmer name",
    role: "City, State",
    initial: "F",
  },
  {
    quote: "Placeholder for a real homeowner testimonial, no more overflow, no more worry.",
    name: "Homeowner name",
    role: "City, State",
    initial: "H",
  },
  {
    quote: "Placeholder for a real electrician testimonial, wiring, fault-finding and service calls.",
    name: "Electrician name",
    role: "City, State",
    initial: "E",
  },
  {
    video: true,
    img: "/images/intro-panels-wave.jpg",
    alt: "MRK panels installed on site",
    name: "Video testimonial",
    role: "City, State",
  },
];


const rangeProducts = [
  {
    title: "Single-Phase Starters",
    description:
      "For homes and small farms, up to 7.5 HP. Manual and fully-digital.",
    image: "/images/single-phase-starter.png",
    alt: "MRK single-phase starters",
    href: "#single-phase",
    dark: false,
  },
  {
    title: "Three-Phase Panels",
    description:
      "DOL and Star-Delta panels for agriculture, industry and housing.",
    image: "/images/three-phase-panel.png",
    alt: "MRK three-phase control panel",
    href: "#three-phase",
    dark: true,
  },
  {
    title: "WLC Smart Plugs",
    description:
      "Effortless water-level control, including an advanced Wi-Fi model.",

    // This existing image will remain visible.
    // Change it to "/images/wlc-smart-plug.png"
    // only after adding that file inside public/images.
    image: "/images/mrg-dpt-2-auto-timer.png",

    alt: "MRK WLC smart plug",
    href: "#wlc-smart-plugs",
    dark: false,
  },
  {
    title: "Cables & Accessories",
    description:
      "Submersible cables and fittings, built and tested to the same standard.",
    image: "/images/panel-components.png",
    alt: "MRK cables and accessories",
    href: "#cables-accessories",
    dark: true,
  },
] as const;

// a horizontal card rail driven by prev/next buttons. native smooth scrolling gets
// cancelled by the page's scroll-driven animations, so the scroll is tweened by hand.
function useRail(gap: number, reducedMotion: boolean | null) {
  const ref = useRef<HTMLDivElement>(null);
  const [atEnds, setAtEnds] = useState<[boolean, boolean]>([true, false]);
  const anim = useRef<ReturnType<typeof animate> | null>(null);

  const sync = useCallback(() => {
    const rail = ref.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtEnds([rail.scrollLeft <= 1, rail.scrollLeft >= max - 1]);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const nudge = useCallback(
    (direction: number) => {
      const rail = ref.current;
      if (!rail) return;
      const card = rail.firstElementChild as HTMLElement | null;
      const step = card?.offsetWidth ?? 320;
      const max = rail.scrollWidth - rail.clientWidth;
      const target = clamp(rail.scrollLeft + direction * (step + gap), 0, max);

      anim.current?.stop();
      if (reducedMotion) {
        rail.scrollLeft = target;
        return;
      }
      anim.current = animate(rail.scrollLeft, target, {
        duration: 0.5,
        ease: [0.2, 0.7, 0.2, 1],
        onUpdate(value) {
          rail.scrollLeft = value;
        },
      });
    },
    [gap, reducedMotion],
  );

  return { ref, atEnds, sync, nudge };
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const tw: Record<string, string> = {
  root: "min-h-screen bg-paper text-ink [&_a]:text-inherit [&_a]:no-underline [&_img]:block [&_img]:max-w-full [&_:focus-visible]:rounded-sm [&_:focus-visible]:outline [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-[3px] [&_:focus-visible]:outline-aqua",
  container: "mx-auto w-full max-w-[1200px] px-6",
  section: "py-[clamp(4.5rem,9vw,8rem)]",
  reveal: "translate-y-[26px] opacity-0 [&.in]:translate-y-0 [&.in]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100",
  eyebrow: "mb-4 inline-block font-mono text-[0.72rem] uppercase tracking-[0.24em] text-aqua",
  title: "font-sans text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.01em] text-ink",
  "section-head": "mb-[clamp(2.4rem,5vw,3.6rem)] max-w-[60ch]",

  preview: "fixed bottom-4 left-4 z-50 rounded-[0.875rem] border border-line bg-white/95 p-4 font-mono shadow-[0_16px_40px_rgba(11,31,51,.16)] backdrop-blur transition-transform hover:scale-100 max-[720px]:origin-bottom-left max-[720px]:scale-90",
  "pv-close": "absolute -right-2 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-sm text-muted",
  "pv-lbl": "mb-2 text-[0.56rem] uppercase tracking-[0.14em] text-muted",
  "pv-row": "mb-2 flex items-center gap-2 last:mb-0",
  seg: "inline-flex overflow-hidden rounded-xl border border-line [&>button]:bg-white [&>button]:px-3 [&>button]:py-1 [&>button]:font-mono [&>button]:text-[0.64rem] [&>button]:text-ink [&>button+button]:border-l [&>button+button]:border-line [&>button.active]:bg-ink [&>button.active]:text-white",

  nav: "fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-6 py-4 transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)] [&.scrolled]:bg-paper/85 [&.scrolled]:py-3 [&.scrolled]:shadow-[0_1px_0_rgb(var(--line))] [&.scrolled]:backdrop-blur-md",
  brand: "flex items-center gap-2 font-semibold",
  logo: "h-[30px] w-auto max-w-none",
  "nav-links": "flex items-center gap-8 max-[720px]:fixed max-[720px]:right-0 max-[720px]:top-0 max-[720px]:z-50 max-[720px]:h-screen max-[720px]:w-[min(78vw,320px)] max-[720px]:translate-x-full max-[720px]:flex-col max-[720px]:items-start max-[720px]:justify-center max-[720px]:gap-6 max-[720px]:bg-white max-[720px]:p-8 max-[720px]:shadow-[-20px_0_60px_rgba(11,31,51,.16)] max-[720px]:transition-transform max-[720px]:duration-300 max-[720px]:ease-[cubic-bezier(.2,.7,.2,1)] max-[720px]:[&.open]:translate-x-0 [&>a]:relative [&>a]:pb-1 [&>a]:text-sm [&>a]:font-semibold [&>a]:after:absolute [&>a]:after:-bottom-[3px] [&>a]:after:left-0 [&>a]:after:h-0.5 [&>a]:after:w-0 [&>a]:after:bg-aqua [&>a]:after:transition-[width] [&>a]:after:duration-300 [&>a:hover]:after:w-full max-[720px]:[&>a]:text-lg",
  "nav-right": "flex items-center gap-4",
  lang: "cursor-pointer rounded-full border border-line bg-white px-3 py-2 font-mono text-xs uppercase tracking-[0.04em] text-ink",
  "nav-cta": "inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white max-[720px]:hidden",
  "nav-toggle": "hidden h-9 w-10 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-line bg-white max-[720px]:z-50 max-[720px]:flex [&>span]:block [&>span]:h-0.5 [&>span]:w-4 [&>span]:bg-ink [&>span]:transition [&>span]:duration-300 [&.open>span:nth-child(1)]:translate-y-[6px] [&.open>span:nth-child(1)]:rotate-45 [&.open>span:nth-child(2)]:opacity-0 [&.open>span:nth-child(3)]:-translate-y-[6px] [&.open>span:nth-child(3)]:-rotate-45",

  intro: "relative h-[300vh] bg-white max-[720px]:h-[230vh] motion-reduce:h-screen",
  "intro-stage": "sticky top-0 h-screen overflow-hidden",
  "reveal-photo": "absolute inset-0 h-full w-full object-cover",
  "reveal-cover": "absolute inset-0 h-full w-full opacity-0",
  "scroll-hint": "absolute bottom-9 left-1/2 -translate-x-1/2 text-center font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted",
  chev: "mx-auto mb-2 block h-5 w-5 animate-cue fill-none stroke-current opacity-70 [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2] motion-reduce:animate-none",

  hero: "relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#fff_42%,#EFF8FE_100%)] pt-28 text-center max-[720px]:min-h-[88vh] max-[720px]:pt-24",
  "hero-bg": "pointer-events-none absolute inset-0 overflow-hidden",
  "hero-photo": "absolute inset-0 bg-[url('/images/farmers.jpeg')] bg-cover bg-center",
  "hero-scrim": "absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.62)_0%,rgba(255,255,255,.72)_30%,rgba(255,255,255,.58)_62%,rgba(255,255,255,.18)_100%)]",
  "hero-glow": "absolute left-1/2 top-[12%] aspect-square w-[min(760px,82%)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(30,155,224,.14),transparent_66%)]",
  bub2: "absolute bottom-[20%] animate-rise2 rounded-full border border-[rgba(120,200,235,.45)] bg-[radial-gradient(circle_at_32%_30%,rgba(255,255,255,.95),rgba(120,200,235,.4))] motion-reduce:animate-none",
  "hero-inner": "relative z-10 mx-auto max-w-[920px] pb-24 max-[720px]:pb-28",
  "hero-eyebrow": "mb-6 inline-block font-mono text-xs uppercase tracking-[0.24em] text-aqua",
  "hero-title": "mx-auto mb-6 max-w-[min(920px,100%)] text-[clamp(2.5rem,6.6vw,5.2rem)] font-extrabold leading-[1.04] tracking-[-0.025em] text-ink",
  aq: "text-aqua",
  "hero-sub": "mx-auto mb-10 max-w-[54ch] text-[clamp(1.05rem,1.55vw,1.28rem)] text-muted",
  "hero-actions": "flex flex-wrap justify-center gap-4",
  btn: "relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full border border-transparent px-[1.6rem] py-[0.95rem] text-sm font-semibold transition duration-300 ease-[cubic-bezier(.2,.7,.2,1)] before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:content-[''] before:transition-transform before:duration-[450ms] before:ease-[cubic-bezier(.2,.7,.2,1)] hover:before:translate-y-0 [&>svg]:h-4 [&>svg]:w-4",
  "btn-primary": "bg-aqua text-white before:bg-gradient-to-b before:from-marine before:to-deep",
  "btn-light": "bg-white text-ink before:bg-gradient-to-b before:from-splash before:to-aqua hover:text-white",
  "hero-waves": "absolute inset-x-0 bottom-0 z-0 h-[32%] min-h-[170px] max-[720px]:h-[26%] max-[720px]:min-h-[130px] [&>svg]:h-full [&>svg]:w-full",
  w1: "fill-[#EAF6FD]",
  w2: "fill-[#C9E7F8]",
  w3: "fill-[#A0D6F1]",

  stats: "relative bg-ink text-white",
  "stat-grid": "grid grid-cols-5 gap-8 max-[1000px]:grid-cols-2",
  stat: "border-t border-white/15 py-6",
  num: "text-[clamp(1.6rem,3.1vw,2.4rem)] font-bold leading-none tracking-[-0.01em]",
  plus: "text-splash",
  lbl: "mt-2 font-mono text-xs uppercase tracking-[0.08em] text-white/70",

  range: "max-[1000px]:[&_.section-head]:px-6 max-[720px]:[&_.section-head]:px-4",
  "range-inner": "mx-auto flex w-full max-w-[1520px] flex-col",
  catwrap: "relative",
  cats: "flex snap-x snap-proximity gap-14 overflow-x-auto px-10 pb-9 [scroll-padding-inline:40px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[720px]:gap-4 max-[720px]:px-4",
  cat: "group/cat relative flex w-[clamp(258px,24vw,340px)] flex-none cursor-pointer flex-col overflow-hidden rounded-[1.25rem] border border-line bg-card transition duration-300 ease-[cubic-bezier(.2,.7,.2,1)] after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-aqua after:to-splash after:content-[''] after:transition-transform after:duration-[400ms] hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_24px_40px_rgba(11,31,51,.1)] hover:after:scale-x-100 max-[720px]:w-[78vw]",
  catart: "flex aspect-square w-full items-center justify-center overflow-hidden bg-white [&>img]:max-h-[94%] [&>img]:max-w-[90%] [&>img]:object-contain [&>svg]:h-28 [&>svg]:w-auto",
  catbody: "relative z-10 flex flex-1 flex-col bg-card p-[1.375rem] shadow-[0_-14px_26px_-12px_rgba(11,31,51,.28)] [&>h3]:mb-1 [&>h3]:text-lg [&>h3]:font-extrabold [&>h3]:text-ink [&>p]:mb-4 [&>p]:text-sm [&>p]:text-muted",
  go: "mt-auto inline-flex items-center gap-2 font-mono text-sm font-medium text-aqua",
  rarrow: "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink shadow-[0_8px_20px_rgba(11,31,51,.08)] transition duration-300 ease-in-out hover:scale-105 hover:border-aqua hover:shadow-[0_8px_20px_rgba(11,31,51,.14)] disabled:pointer-events-none disabled:opacity-0 [&.prev]:left-[18px] [&.next]:right-[18px] max-[1000px]:[&.prev]:left-[10px] max-[1000px]:[&.next]:right-[10px] max-[720px]:hidden [&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-none [&>svg]:stroke-current [&>svg]:stroke-2",

  swrap: "mx-auto w-full px-[clamp(16px,2vw,32px)] max-[1000px]:px-6",
  sslider: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-[clamp(.5rem,1.4vw,1rem)] gap-y-[1.2rem]",
  sviewport: "relative min-h-[clamp(400px,72vh,820px)] overflow-hidden rounded-[1.375rem]",
  sslide: "absolute inset-0 grid grid-cols-[.85fr_1.15fr] items-center gap-6 rounded-[1.375rem] border border-line bg-white p-6 shadow-[0_14px_34px_rgba(11,31,51,.07)] max-[1000px]:grid-cols-1 max-[1000px]:items-start max-[1000px]:gap-[1.1rem]",
  "sslide-media": "flex items-center justify-center overflow-hidden rounded-2xl bg-mist max-[1000px]:min-h-[200px] [&>img]:h-full [&>img]:w-full [&>img]:object-contain max-[1000px]:[&>img]:max-h-[200px] [&>svg]:h-[230px] [&>svg]:w-auto max-[1000px]:[&>svg]:h-40",
  photo: "p-[1.4rem]",
  "sslide-body": "pr-2.5 [&>h3]:mb-3 [&>h3]:mt-2 [&>h3]:text-3xl [&>h3]:font-semibold [&>h3]:leading-tight [&>h3]:text-ink [&>p]:mb-5 [&>p]:max-w-[50ch] [&>p]:text-base [&>p]:leading-[1.65] [&>p]:text-muted",
  no: "font-mono text-xs uppercase tracking-[0.13em] text-aqua",
  chips: "mb-5 flex flex-wrap gap-2",
  chip: "rounded-full border border-line bg-mist px-3 py-1 font-mono text-[0.72rem] tracking-[0.03em] text-ink",
  slink: "inline-flex items-center gap-2 border-b-2 border-aqua pb-0.5 text-base font-semibold text-ink",
  sarrow: "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink transition duration-300 ease-in-out hover:scale-105 hover:border-aqua hover:shadow-[0_8px_20px_rgba(11,31,51,.1)] [&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-none [&>svg]:stroke-current [&>svg]:stroke-2",
  sdots: "col-span-full flex items-center justify-center gap-2",
  sdot: "h-2 w-2 rounded-full bg-line transition-all duration-300 [&.on]:w-5 [&.on]:bg-aqua",

  flipgrid: "grid grid-cols-3 gap-[1.4rem] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1",
  "flip-wrap": "group/flip min-h-[210px] [perspective:1200px]",
  flip: "relative h-full min-h-[210px] w-full transition-transform duration-700 ease-[cubic-bezier(.2,.75,.25,1)] [transform-style:preserve-3d] group-hover/flip:[transform:rotateY(180deg)] [&.flipped]:[transform:rotateY(180deg)]",
  "flip-face": "absolute inset-0 flex flex-col overflow-hidden rounded-[1.25rem] p-[1.7rem] [backface-visibility:hidden]",
  "flip-front": "justify-center border border-line bg-white shadow-[0_12px_30px_rgba(11,31,51,.07)] [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:text-ink",
  fic: "mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[0.875rem] bg-mist [&>svg]:h-[26px] [&>svg]:w-[26px] [&>svg]:fill-none [&>svg]:stroke-aqua [&>svg]:stroke-2 [&>svg]:[stroke-linecap:round] [&>svg]:[stroke-linejoin:round]",
  fbadge: "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-mist text-sm font-bold text-aqua",
  "flip-back": "justify-center border border-transparent bg-gradient-to-br from-deep via-aqua to-ink text-white [transform:rotateY(180deg)] [&>p]:m-0 [&>p]:text-base [&>p]:font-medium [&>p]:leading-6",

  tsec: "[&_.section-head]:mb-0 [&_.section-head]:max-w-none [&_h2.title]:uppercase [&_h2.title]:leading-[.95] [&_h2.title]:tracking-[-.02em]",
  thead: "mb-10 flex items-end justify-between gap-8 max-[1000px]:mb-[2.4rem] max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-6",
  tnav: "flex gap-3 pb-1 max-[720px]:pb-0 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:cursor-pointer [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border-0 [&>button]:bg-ink [&>button]:text-white [&>button]:transition [&>button]:duration-300 [&>button]:ease-in-out [&>button:hover:not(:disabled)]:scale-105 [&>button:hover:not(:disabled)]:bg-aqua [&>button:disabled]:pointer-events-none [&>button:disabled]:opacity-20 [&>button>svg]:h-5 [&>button>svg]:w-5 [&>button>svg]:fill-none [&>button>svg]:stroke-current [&>button>svg]:stroke-2",
  tgrid: "flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  tcard: "relative flex min-h-[272px] w-[clamp(238px,23vw,282px)] flex-none flex-col rounded-xl bg-mist p-6 max-[720px]:w-[78vw] [&>p]:mb-0 [&>p]:text-sm [&>p]:leading-[1.62] [&>p]:text-muted",
  "tcard-top": "relative z-10 mb-6 flex items-center justify-between gap-2",
  stars5: "text-xs leading-none tracking-[0.2em] text-ink",
  tidx: "font-mono text-xs text-muted",
  who: "relative z-10 mt-auto flex items-center gap-3 pt-6 [&_b]:block [&_b]:text-sm [&_b]:text-ink [&_span]:block [&_span]:font-mono [&_span]:text-xs [&_span]:text-muted",
  av: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-aqua to-marine text-sm font-semibold text-white",
  "tcard-media": "overflow-hidden bg-ink after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(11,31,51,.30),rgba(11,31,51,.78))] after:content-[''] [&>img]:absolute [&>img]:inset-0 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&_.stars5]:text-white [&_.tidx]:text-white [&_.who_b]:text-white [&_.who_span]:text-white/80",
  tplay: "absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white transition duration-300 hover:scale-105 hover:bg-splash [&>svg]:ml-0.5 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-current [&>svg]:text-ink",
  "ph-note": "mt-6 font-mono text-[0.7rem] uppercase tracking-[0.06em] text-aqua",

  deal: "relative overflow-hidden bg-[linear-gradient(135deg,rgb(var(--deep)),rgb(var(--ink))_60%,rgb(var(--marine)))] text-white [&>.wave-top]:h-[60px] [&>.wave-top_path]:fill-paper",
  "wave-top": "absolute -top-px left-0 right-0 w-full",
  "deal-bubbles": "pointer-events-none absolute inset-0",
  bub: "absolute animate-rise rounded-full border border-white/[0.12] motion-reduce:animate-none",
  inner: "relative z-10 grid grid-cols-[1.2fr_.8fr] gap-10 max-[1000px]:grid-cols-1 [&_h2]:font-sans [&_h2]:text-[clamp(1.9rem,4vw,3rem)] [&_h2]:font-bold [&_h2]:leading-[1.05] [&_h2]:tracking-[-0.01em] [&_p]:my-4 [&_p]:max-w-[46ch] [&_p]:text-white/75",
  dstats: "flex flex-wrap gap-8 [&_b]:block [&_b]:text-3xl [&_b]:font-bold [&_span]:font-mono [&_span]:text-xs [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-white/60",

  "dl-grid": "grid grid-cols-2 gap-[1.1rem] max-[720px]:grid-cols-1",
  "dl-card": "flex cursor-pointer items-center gap-4 rounded-[1.125rem] border border-line bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-aqua [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-ink [&_p]:font-mono [&_p]:text-[0.74rem] [&_p]:tracking-[0.04em] [&_p]:text-muted",
  dic: "flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[0.8rem] bg-mist [&>svg]:h-[26px] [&>svg]:w-[26px] [&>svg]:fill-none [&>svg]:stroke-aqua [&>svg]:stroke-[1.6] [&>svg]:[stroke-linecap:round] [&>svg]:[stroke-linejoin:round]",
  arr: "ml-auto text-aqua",

  foot: "relative bg-ink pb-8 text-white [&>.wave-top]:h-14 [&>.wave-top_path]:fill-paper [&_address]:not-italic [&_address]:text-sm [&_address]:leading-7 [&_address]:text-white/70 [&_h5]:mb-3 [&_h5]:font-mono [&_h5]:text-[0.72rem] [&_h5]:uppercase [&_h5]:tracking-[0.14em] [&_h5]:text-white/60 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-2.5 [&_ul]:p-0 [&_ul_a]:text-sm [&_ul_a]:text-white/75 [&_ul_a:hover]:text-white",
  "foot-main": "grid grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-8 py-[clamp(3.5rem,7vw,5rem)] pb-10 max-[1000px]:grid-cols-2 max-[720px]:grid-cols-1",
  fbrand: "mb-3 flex items-center gap-2 font-sans text-[1.4rem] font-semibold",
  flogo: "h-[34px] w-auto",
  ftag: "mb-5 text-base italic text-white",
  tagpill: "mt-3 inline-block rounded-full border border-splash/40 px-3 py-1 text-[0.68rem] tracking-[0.06em] text-splash",
  "foot-bottom": "flex flex-wrap justify-between gap-4 border-t border-white/15 pt-4 text-sm text-white/70 [&_a]:mx-1",
};

const setAccentTheme = (amber: boolean) => {
  const root = document.documentElement.style;
  root.setProperty("--aqua", amber ? "232 163 61" : "30 155 224");
  root.setProperty("--marine", amber ? "199 126 30" : "14 107 176");
  root.setProperty("--splash", amber ? "244 196 102" : "95 198 236");
};

const delayByClass: Record<string, number> = {
  d1: 0.08,
  d2: 0.16,
  d3: 0.24,
  d4: 0.32,
  d5: 0.4,
};

export default function MrkHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const introProgress = useMotionValue(0);
  const coverOpacity = useTransform(introProgress, [0, 0.25], [0, 1]);
  // Accelerating zoom: the wordmark loiters at readable size, then rockets
  // past the viewport so the letterforms blow out and uncover the photo.
  const wordScale = useTransform(
    introProgress,
    [0, 0.45, 0.75, 1],
    [0.55, 1.5, 4, 13],
  );
  const stageOpacity = useTransform(
    introProgress,
    [0, 0.92, 1],
    [1, 1, 0],
  );
  const hintOpacity = useTransform(introProgress, [0, 0.22], [1, 0]);

  const [[slide, slideDir], setSlide] = useState<[number, number]>([0, 1]);
  const [sliderPaused, setSliderPaused] = useState(false);

  const goToSlide = useCallback((next: number, direction: number) => {
    const total = starIdeas.length;
    setSlide([(next + total) % total, direction]);
  }, []);

  useEffect(() => {
    if (sliderPaused) return;
    const timer = setTimeout(
      () => goToSlide(slide + 1, 1),
      SLIDE_INTERVAL,
    );
    return () => clearTimeout(timer);
  }, [slide, sliderPaused, goToSlide]);

  const RAIL_GAP = 56;
  const testimonialRail = useRail(TRAIL_GAP, prefersReducedMotion);

  useMotionValueEvent(scrollY, "change", (currentScrollY) => {
    const root = rootRef.current;
    if (!root) return;

    const intro = root.querySelector<HTMLElement>(".intro");
    const nav = root.querySelector<HTMLElement>(".nav");
    if (nav) nav.classList.toggle("scrolled", currentScrollY > innerHeight * 0.7);
    if (!intro || prefersReducedMotion) return;

    const total = Math.max(1, intro.offsetHeight - innerHeight);
    introProgress.set(clamp((currentScrollY - intro.offsetTop) / total, 0, 1));
  });

  useMotionValueEvent(coverOpacity, "change", (value) => {
    const cover = rootRef.current?.querySelector<SVGElement>(".reveal-cover");
    if (cover) cover.style.opacity = String(value);
  });

  useMotionValueEvent(wordScale, "change", (value) => {
    const word = rootRef.current?.querySelector<SVGTextElement>("#wordText");
    if (word) {
      word.setAttribute(
        "transform",
        `translate(600 350) scale(${value.toFixed(3)}) translate(-600 -350)`,
      );
    }
  });

  useMotionValueEvent(stageOpacity, "change", (value) => {
    const stage = rootRef.current?.querySelector<HTMLElement>(".intro-stage");
    if (stage) stage.style.opacity = String(value);
  });

  useMotionValueEvent(hintOpacity, "change", (value) => {
    const hint = rootRef.current?.querySelector<HTMLElement>(".scroll-hint");
    if (hint) hint.style.opacity = String(value);
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];
    const animations: Array<{ stop: () => void }> = [];

    const preview = root.querySelector<HTMLElement>("#preview");
    if (preview) {
      preview.querySelectorAll<HTMLButtonElement>(".seg button").forEach((button) => {
        const onClick = () => {
          const segment = button.parentElement;
          if (!segment) return;
          segment
            .querySelectorAll("button")
            .forEach((item) => item.classList.remove("active"));
          button.classList.add("active");

          if (segment.dataset.group === "accent") {
            setAccentTheme(button.dataset.val === "amber");
          }
        };
        button.addEventListener("click", onClick);
        cleanups.push(() => button.removeEventListener("click", onClick));
      });

      const close = preview.querySelector<HTMLButtonElement>(".pv-close");
      if (close) {
        const onClose = () => {
          preview.style.display = "none";
        };
        close.addEventListener("click", onClose);
        cleanups.push(() => close.removeEventListener("click", onClose));
      }
    }

    const burger = root.querySelector<HTMLButtonElement>(".nav-toggle");
    const links = root.querySelector<HTMLElement>(".nav-links");
    if (burger && links) {
      const toggleMenu = () => {
        burger.classList.toggle("open");
        links.classList.toggle("open");
      };
      burger.addEventListener("click", toggleMenu);
      cleanups.push(() => burger.removeEventListener("click", toggleMenu));

      links.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
        const closeMenu = () => {
          burger.classList.remove("open");
          links.classList.remove("open");
        };
        link.addEventListener("click", closeMenu);
        cleanups.push(() => link.removeEventListener("click", closeMenu));
      });
    }

    if (matchMedia("(hover: none)").matches) {
      root.querySelectorAll<HTMLElement>(".flip").forEach((card) => {
        const flip = () => card.classList.toggle("flipped");
        card.addEventListener("click", flip);
        cleanups.push(() => card.removeEventListener("click", flip));
      });
    }

    const languageButton = root.querySelector<HTMLButtonElement>(".lang");
    if (languageButton) {
      let hindi = false;
      const toggleLanguage = () => {
        hindi = !hindi;
        root.querySelectorAll<HTMLElement>("[data-hi]").forEach((element) => {
          if (!element.dataset.en) element.dataset.en = element.textContent ?? "";
          element.textContent = hindi
            ? element.dataset.hi ?? ""
            : element.dataset.en ?? "";
        });
        languageButton.textContent = hindi ? "EN" : "हिं";
        document.documentElement.lang = hindi ? "hi" : "en";
      };
      languageButton.addEventListener("click", toggleLanguage);
      cleanups.push(() =>
        languageButton.removeEventListener("click", toggleLanguage),
      );
    }

    if (prefersReducedMotion) {
      document.body.classList.add("reduced");
      root.querySelectorAll<HTMLElement>(".reveal").forEach((element) => {
        element.classList.add("in");
      });
      const cover = root.querySelector<SVGElement>(".reveal-cover");
      const word = root.querySelector<SVGTextElement>("#wordText");
      if (cover) cover.style.opacity = "1";
      if (word) {
        word.setAttribute(
          "transform",
          "translate(600 350) scale(1.05) translate(-600 -350)",
        );
      }
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            const delayClass = Object.keys(delayByClass).find((className) =>
              element.classList.contains(className),
            );
            const control = animate(
              element,
              { opacity: 1, transform: "translateY(0px)" },
              {
                duration: 0.8,
                delay: delayClass ? delayByClass[delayClass] : 0,
                ease: [0.2, 0.7, 0.2, 1],
              },
            );
            animations.push(control);
            element.classList.add("in");
            revealObserver.unobserve(element);
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -40px 0px" },
      );

      root.querySelectorAll<HTMLElement>(".reveal").forEach((element) =>
        revealObserver.observe(element),
      );
      cleanups.push(() => revealObserver.disconnect());
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          const target = Number(element.dataset.count ?? 0);
          const indianGrouping = element.dataset.group === "indian";
          const control = animate(0, target, {
            duration: prefersReducedMotion ? 0 : 1.5,
            ease: "easeOut",
            onUpdate(value) {
              element.textContent = indianGrouping
                ? formatIndian(value)
                : Math.round(value).toString();
            },
          });
          animations.push(control);
          counterObserver.unobserve(element);
        });
      },
      { threshold: 0.6 },
    );

    root.querySelectorAll<HTMLElement>("[data-count]").forEach((element) =>
      counterObserver.observe(element),
    );
    cleanups.push(() => counterObserver.disconnect());

    const resize = () => {
      const intro = root.querySelector<HTMLElement>(".intro");
      if (!intro || prefersReducedMotion) return;
      const total = Math.max(1, intro.offsetHeight - innerHeight);
      introProgress.set(clamp((scrollY.get() - intro.offsetTop) / total, 0, 1));
    };
    resize();
    addEventListener("resize", resize);
    cleanups.push(() => removeEventListener("resize", resize));

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      animations.forEach((control) => control.stop());
      setAccentTheme(false);
      document.body.classList.remove("reduced");
    };
  }, [introProgress, prefersReducedMotion, scrollY]);

  return (
    <div ref={rootRef} className={tw.root}>
      <svg className="absolute h-0 w-0" aria-hidden={"true"}>
        <defs>
          <linearGradient id={"gAqua"} x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"0"} stopColor={"#5FC6EC"}></stop>
            <stop offset={"1"} stopColor={"#0E6BB0"}></stop>
          </linearGradient>
          <linearGradient id={"gSky"} x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"0"} stopColor={"#FBFDFF"}></stop>
            <stop offset={".55"} stopColor={"#EEF5FB"}></stop>
            <stop offset={"1"} stopColor={"#DCEBF7"}></stop>
          </linearGradient>
          <radialGradient id={"gCloud"} cx={"50%"} cy={"50%"} r={"50%"}>
            <stop offset={"0"} stopColor={"#ffffff"} stopOpacity={".9"}></stop>
            <stop offset={"1"} stopColor={"#ffffff"} stopOpacity={"0"}></stop>
          </radialGradient>
          <symbol id={"drop"} viewBox={"0 0 24 30"}>
            <path d={"M12 1C12 1 3 12 3 19a9 9 0 0 0 18 0C21 12 12 1 12 1Z"}></path>
            <ellipse cx={"9"} cy={"16"} rx={"2.4"} ry={"3.4"} fill={"#fff"} opacity={".5"}></ellipse>
          </symbol>
          <symbol id={"panelDigital"} viewBox={"0 0 200 260"}>
            <rect x={"14"} y={"12"} width={"172"} height={"236"} rx={"14"} fill={"#F1ECE3"} stroke={"#DBD3C4"} strokeWidth={"2"}></rect>
            <rect x={"14"} y={"12"} width={"172"} height={"30"} rx={"14"} fill={"#ffffff"} opacity={".35"}></rect>
            <path d={"M34 46 l12 -20 12 20 z"} fill={"#E8A33D"}></path>
            <text x={"46"} y={"43"} fontFamily={"Manrope"} fontWeight={"800"} fontSize={"12"} fill={"#fff"} textAnchor={"middle"}>!</text>
            <rect x={"42"} y={"64"} width={"116"} height={"52"} rx={"8"} fill={"#12212C"}></rect>
            <text x={"100"} y={"100"} fontFamily={"'IBM Plex Mono',monospace"} fontWeight={"500"} fontSize={"30"} fill={"#FF5B4C"} textAnchor={"middle"} letterSpacing={"3"}>230</text>
            <rect x={"60"} y={"132"} width={"80"} height={"26"} rx={"6"} fill={"#12315E"}></rect>
            <text x={"100"} y={"150"} fontFamily={"Manrope"} fontWeight={"800"} fontSize={"13"} fill={"#fff"} textAnchor={"middle"} letterSpacing={"2"}>MRK</text>
            <circle cx={"72"} cy={"200"} r={"17"} fill={"#33B36B"}></circle>
            <circle cx={"66"} cy={"194"} r={"5"} fill={"#fff"} opacity={".5"}></circle>
            <circle cx={"128"} cy={"200"} r={"17"} fill={"#E0503F"}></circle>
            <circle cx={"122"} cy={"194"} r={"5"} fill={"#fff"} opacity={".5"}></circle>
            <circle cx={"26"} cy={"24"} r={"3"} fill={"#C9C1B2"}></circle>
            <circle cx={"174"} cy={"24"} r={"3"} fill={"#C9C1B2"}></circle>
            <circle cx={"26"} cy={"236"} r={"3"} fill={"#C9C1B2"}></circle>
            <circle cx={"174"} cy={"236"} r={"3"} fill={"#C9C1B2"}></circle>
          </symbol>
          <symbol id={"panelAnalog"} viewBox={"0 0 200 260"}>
            <rect x={"14"} y={"12"} width={"172"} height={"236"} rx={"14"} fill={"#EFEAE0"} stroke={"#DBD3C4"} strokeWidth={"2"}></rect>
            <path d={"M32 44 l11 -18 11 18 z"} fill={"#E8A33D"}></path>
            <circle cx={"100"} cy={"86"} r={"40"} fill={"#fff"} stroke={"#12212C"} strokeWidth={"2.5"}></circle>
            <g stroke={"#12212C"} strokeWidth={"1.6"}>
              <line x1={"100"} y1={"50"} x2={"100"} y2={"56"}></line>
              <line x1={"136"} y1={"86"} x2={"130"} y2={"86"}></line>
              <line x1={"64"} y1={"86"} x2={"70"} y2={"86"}></line>
              <line x1={"75"} y1={"61"} x2={"79"} y2={"65"}></line>
              <line x1={"125"} y1={"61"} x2={"121"} y2={"65"}></line>
            </g>
            <line x1={"100"} y1={"86"} x2={"120"} y2={"66"} stroke={"#E0503F"} strokeWidth={"2.5"} strokeLinecap={"round"}></line>
            <circle cx={"100"} cy={"86"} r={"4"} fill={"#12212C"}></circle>
            <text x={"100"} y={"118"} fontFamily={"Manrope"} fontWeight={"700"} fontSize={"9"} fill={"#5D7488"} textAnchor={"middle"}>VOLTS</text>
            <rect x={"60"} y={"150"} width={"80"} height={"24"} rx={"6"} fill={"#12315E"}></rect>
            <text x={"100"} y={"167"} fontFamily={"Manrope"} fontWeight={"800"} fontSize={"12"} fill={"#fff"} textAnchor={"middle"} letterSpacing={"2"}>MRK</text>
            <rect x={"58"} y={"196"} width={"26"} height={"20"} rx={"4"} fill={"#33B36B"}></rect>
            <rect x={"116"} y={"196"} width={"26"} height={"20"} rx={"4"} fill={"#E0503F"}></rect>
          </symbol>
          <symbol id={"panelThree"} viewBox={"0 0 200 260"}>
            <rect x={"12"} y={"10"} width={"176"} height={"240"} rx={"12"} fill={"#ECECEE"} stroke={"#CFCFD6"} strokeWidth={"2"}></rect>
            <rect x={"12"} y={"10"} width={"176"} height={"26"} rx={"12"} fill={"#fff"} opacity={".4"}></rect>
            <path d={"M32 42 l11 -18 11 18 z"} fill={"#E8A33D"}></path>
            <rect x={"40"} y={"56"} width={"120"} height={"46"} rx={"8"} fill={"#0E1A24"}></rect>
            <text x={"100"} y={"88"} fontFamily={"'IBM Plex Mono',monospace"} fontSize={"24"} fill={"#5FC6EC"} textAnchor={"middle"} letterSpacing={"2"}>E‑04</text>
            <g>
              <circle cx={"62"} cy={"122"} r={"7"} fill={"#E0503F"}></circle>
              <circle cx={"100"} cy={"122"} r={"7"} fill={"#E8C13D"}></circle>
              <circle cx={"138"} cy={"122"} r={"7"} fill={"#4A8BE0"}></circle>
              <text x={"62"} y={"143"} fontFamily={"'IBM Plex Mono',monospace"} fontSize={"9"} fill={"#5D7488"} textAnchor={"middle"}>R</text>
              <text x={"100"} y={"143"} fontFamily={"'IBM Plex Mono',monospace"} fontSize={"9"} fill={"#5D7488"} textAnchor={"middle"}>Y</text>
              <text x={"138"} y={"143"} fontFamily={"'IBM Plex Mono',monospace"} fontSize={"9"} fill={"#5D7488"} textAnchor={"middle"}>B</text>
            </g>
            <rect x={"58"} y={"156"} width={"84"} height={"22"} rx={"5"} fill={"#12315E"}></rect>
            <text x={"100"} y={"172"} fontFamily={"Manrope"} fontWeight={"800"} fontSize={"11"} fill={"#fff"} textAnchor={"middle"} letterSpacing={"2"}>MRK · 3∅</text>
            <circle cx={"74"} cy={"210"} r={"15"} fill={"#33B36B"}></circle>
            <circle cx={"126"} cy={"210"} r={"15"} fill={"#E0503F"}></circle>
          </symbol>
          <symbol id={"plugWifi"} viewBox={"0 0 200 260"}>
            <rect x={"52"} y={"44"} width={"96"} height={"150"} rx={"20"} fill={"#EDE7DB"} stroke={"#DBD3C4"} strokeWidth={"2"}></rect>
            <circle cx={"100"} cy={"96"} r={"34"} fill={"#fff"} stroke={"#CFC7B8"} strokeWidth={"2"}></circle>
            <rect x={"88"} y={"82"} width={"6"} height={"16"} rx={"3"} fill={"#12212C"}></rect>
            <rect x={"106"} y={"82"} width={"6"} height={"16"} rx={"3"} fill={"#12212C"}></rect>
            <rect x={"97"} y={"104"} width={"6"} height={"14"} rx={"3"} fill={"#12212C"}></rect>
            <g fill={"none"} stroke={"#1E9BE0"} strokeWidth={"3"} strokeLinecap={"round"}>
              <path d={"M78 52 a30 30 0 0 1 44 0"}></path>
              <path d={"M85 60 a20 20 0 0 1 30 0"}></path>
            </g>
            <g>
              <rect x={"70"} y={"150"} width={"12"} height={"26"} rx={"3"} fill={"#1E9BE0"}></rect>
              <rect x={"88"} y={"150"} width={"12"} height={"26"} rx={"3"} fill={"#1E9BE0"}></rect>
              <rect x={"106"} y={"150"} width={"12"} height={"26"} rx={"3"} fill={"#5FC6EC"}></rect>
              <rect x={"124"} y={"150"} width={"12"} height={"26"} rx={"3"} fill={"#D6E7F2"}></rect>
            </g>
            <rect x={"86"} y={"194"} width={"6"} height={"24"} fill={"#9AA7B2"}></rect>
            <rect x={"108"} y={"194"} width={"6"} height={"24"} fill={"#9AA7B2"}></rect>
            <use href={"#drop"} width={"16"} height={"20"} x={"150"} y={"150"} fill={"#1E9BE0"}></use>
          </symbol>
          <symbol id={"cableCoil"} viewBox={"0 0 200 260"}>
            <g fill={"none"} stroke={"#33414D"} strokeWidth={"13"} strokeLinecap={"round"}>
              <rect x={"46"} y={"70"} width={"108"} height={"118"} rx={"52"}></rect>
              <rect x={"62"} y={"86"} width={"76"} height={"86"} rx={"38"} stroke={"#465563"}></rect>
              <rect x={"78"} y={"102"} width={"44"} height={"54"} rx={"24"} stroke={"#33414D"}></rect>
            </g>
            <rect x={"86"} y={"60"} width={"28"} height={"20"} rx={"4"} fill={"#E0503F"}></rect>
            <path d={"M150 150 q26 6 26 34"} fill={"none"} stroke={"#33414D"} strokeWidth={"12"} strokeLinecap={"round"}></path>
            <rect x={"128"} y={"196"} width={"30"} height={"18"} rx={"4"} fill={"#12315E"}></rect>
            <text x={"143"} y={"209"} fontFamily={"Manrope"} fontWeight={"800"} fontSize={"9"} fill={"#fff"} textAnchor={"middle"}>HT</text>
          </symbol>
        </defs>
      </svg>
      <div className={cn('preview', tw['preview'])} id={"preview"}>
        <button className={cn('pv-close', tw['pv-close'])} title={"Hide"} aria-label={"Hide preview controls"}>×</button>
        <div className={cn('pv-lbl', tw['pv-lbl'])}>Preview</div>
        <div className={cn('pv-row', tw['pv-row'])}>
          <span>Accent</span>
          <div className={cn('seg', tw['seg'])} data-group={"accent"}>
            <button data-val={"blue"} className={"active"}>Water-blue</button>
            <button data-val={"amber"}>Amber</button>
          </div>
        </div>
      </div>
      <header className={cn('nav', tw['nav'])}>
        <a className={cn('brand', tw['brand'])} href={"#top"} aria-label={"MRK Tradex home"}>
          <img className={cn('logo', tw['logo'])} src={"/images/mrk-logo.png"} alt={"MRK"} />
        </a>
        <nav className={cn('nav-links', tw['nav-links'])} aria-label={"Primary"}>
          <a href={"#top"} data-hi={"होम"}>Home</a>
          <a href={"#range"} data-hi={"उत्पाद"}>Products</a>
          <a href={"#why"} data-hi={"क्यों MRK"}>Why MRK</a>
          <a href={"#contact"} data-hi={"संपर्क"}>Contact</a>
        </nav>
        <div className={cn('nav-right', tw['nav-right'])}>
          <button className={cn('lang', tw['lang'])} aria-label={"Switch language"}>हिं</button>
          <a className={cn('nav-cta', tw['nav-cta'])} href={"#dealer"} data-hi={"डीलर बनें"}>Partner with us</a>
          <button className={cn('nav-toggle', tw['nav-toggle'])} aria-label={"Menu"}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      <span id={"top"}></span>
      <main>
        <section className={cn('intro', tw['intro'])} aria-label={"MRK Tradex"}>
          <div className={cn('intro-stage', tw['intro-stage'])}>
            <img className={cn('reveal-photo', tw['reveal-photo'])} src={"/images/intro-panels-wave.jpg"} alt={"MRK submersible starters and control panels"} />
            <svg className={cn('reveal-cover', tw['reveal-cover'])} viewBox={"0 0 1200 700"} preserveAspectRatio={"xMidYMid slice"} aria-hidden={"true"}>
              <defs>
                <mask id={"wordMask"} maskUnits={"userSpaceOnUse"} x={"0"} y={"0"} width={"1200"} height={"700"}>
                  <rect x={"0"} y={"0"} width={"1200"} height={"700"} fill={"#fff"}></rect>
                  <text id={"wordText"} x={"600"} y={"350"} textAnchor={"middle"} dominantBaseline={"central"} fontFamily={"'Plus Jakarta Sans', system-ui, sans-serif"} fontWeight={"800"} fontSize={"148"} letterSpacing={"2"} fill={"#000"}>MRK TRADEX</text>
                </mask>
              </defs>
              <rect x={"0"} y={"0"} width={"1200"} height={"700"} fill={"#ffffff"} mask={"url(#wordMask)"}></rect>
            </svg>
            <div className={cn('scroll-hint', tw['scroll-hint'])} aria-hidden={"true"}>
              <svg className={cn('chev', tw['chev'])} viewBox={"0 0 24 24"}>
                <path d={"M6 9l6 6 6-6"}></path>
              </svg>
              Scroll
            </div>
          </div>
        </section>
        <section className={cn('hero', tw['hero'])} id={"hero"}>
          <div className={cn('hero-bg', tw['hero-bg'])} aria-hidden={"true"}>
            <div className={cn('hero-photo', tw['hero-photo'])}></div>
            <div className={cn('hero-scrim', tw['hero-scrim'])}></div>
            <div className={cn('hero-glow', tw['hero-glow'])}></div>
            <span className={cn("bub2", tw.bub2, "left-[16%] h-[13px] w-[13px] [animation-delay:0s]")}></span>
            <span className={cn("bub2", tw.bub2, "left-[29%] h-[9px] w-[9px] [animation-delay:2.4s]")}></span>
            <span className={cn("bub2", tw.bub2, "left-[67%] h-4 w-4 [animation-delay:1.2s]")}></span>
            <span className={cn("bub2", tw.bub2, "left-[82%] h-[10px] w-[10px] [animation-delay:3.4s]")}></span>
            <span className={cn("bub2", tw.bub2, "left-[49%] h-2 w-2 [animation-delay:4.6s]")}></span>
          </div>
          <div className={cn('hero-inner container', tw['hero-inner'], tw['container'])}>
            <span className={cn('hero-eyebrow', tw['hero-eyebrow'])} data-hi={"सबमर्सिबल स्टार्टर और पैनल · 2005 से"}>Submersible starters & panels</span>
            <h1 className={cn('hero-title', tw['hero-title'])}>
              <span className={cn('aq', tw['aq'])}>Water</span>{" "}
              is life, and we fill
              <br />
              your life with{" "}
              <span className={cn('aq', tw['aq'])}>water</span>
              .
            </h1>
            <p className={cn('hero-sub', tw['hero-sub'])} data-hi={"MRK सबमर्सिबल स्टार्टर और पैनल हर उस पंप की रक्षा करते हैं जो भारत तक पानी पहुँचाता है, घर, खेत और उद्योग के लिए, सिंगल-फेज़ और थ्री-फेज़ दोनों में।"}>
              MRK submersible starters and panels protect every pump that brings India its water, for homes, farms and industry, across single-phase and three-phase.
            </p>
            <div className={cn('hero-actions', tw['hero-actions'])}>
              <a className={cn('btn btn-primary', tw['btn'], tw['btn-primary'])} href={"#range"} data-hi={"रेंज देखें"}>
                Explore the range
                <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                  <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                </svg>
              </a>
            </div>
          </div>
          
        </section>
        <section className={cn('stats', tw['stats'])}>
          <div className={cn("container", tw.container, "pb-14 pt-10")}>
            <div className={cn('stat-grid', tw['stat-grid'])}>
              <div className={cn('stat reveal', tw['stat'], tw['reveal'])}>
                <div className={cn('num', tw['num'])}>
                  <span data-count={"2005"} data-group={"none"}>0</span>
                </div>
                <div className={cn('lbl', tw['lbl'])} data-hi={"से सेवा में"}>In service since</div>
              </div>
              <div className={cn('stat reveal d1', tw['stat'], tw['reveal'])}>
                <div className={cn('num', tw['num'])}>
                  <span data-count={"100000"} data-group={"indian"}>0</span>
                  <span className={cn('plus', tw['plus'])}>+</span>
                </div>
                <div className={cn('lbl', tw['lbl'])} data-hi={"हर साल घरों में"}>Homes served each year</div>
              </div>
              <div className={cn('stat reveal d2', tw['stat'], tw['reveal'])}>
                <div className={cn('num', tw['num'])}>
                  <span data-count={"1000"} data-group={"indian"}>0</span>
                  <span className={cn('plus', tw['plus'])}>+</span>
                </div>
                <div className={cn('lbl', tw['lbl'])} data-hi={"देशभर में डीलर"}>Dealers nationwide</div>
              </div>
              <div className={cn('stat reveal d3', tw['stat'], tw['reveal'])}>
                <div className={cn('num', tw['num'])}>
                  <span data-count={"500"} data-group={"none"}>0</span>
                  <span className={cn('plus', tw['plus'])}>+</span>
                </div>
                <div className={cn('lbl', tw['lbl'])} data-hi={"शहर और कस्बे"}>Cities & towns</div>
              </div>
              <div className={cn('stat reveal d4', tw['stat'], tw['reveal'])}>
                <div className={cn('num', tw['num'])}>
                  <span data-count={"20"} data-group={"none"}>0</span>
                  <span className={cn('plus', tw['plus'])}>+</span>
                </div>
                <div className={cn('lbl', tw['lbl'])} data-hi={"राज्य"}>States</div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="range"
          className="relative h-[100svh] overflow-hidden bg-[#f3f7fb]"
        >
          {/* Background decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#dceefe]/70 blur-[130px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-64 -right-44 h-[600px] w-[600px] rounded-full bg-[#cfe7fb]/60 blur-[150px]"
          />

          {/* Main viewport-height wrapper */}
          <div
            className="
              relative z-10 mx-auto flex h-full w-full max-w-[1720px] flex-col
              px-4 py-5
              sm:px-6 sm:py-6
              lg:px-10 lg:py-7
              xl:px-16 xl:py-8
              2xl:px-20
            "
          >
            {/* Heading */}
            <div
              className="
                mb-[clamp(14px,2.4vh,30px)]
                flex shrink-0 flex-col gap-4
                sm:flex-row sm:items-start sm:justify-between
              "
            >
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="max-w-[1050px]"
              >
                <span
                  className="
                    mb-2 block font-mono text-[10px] font-medium uppercase
                    tracking-[0.28em] text-[#1598df]
                    sm:mb-3 sm:text-xs
                  "
                >
                  The range
                </span>

                <h2
                  className="
                    max-w-[1050px]
                    text-[clamp(2rem,4.5vw,4.8rem)]
                    font-extrabold leading-[0.96]
                    tracking-[-0.045em] text-[#071d33]

                    [@media(max-height:760px)]:text-[clamp(1.8rem,4vw,3.8rem)]
                    [@media(max-height:650px)]:text-[clamp(1.6rem,3.5vw,3.1rem)]
                  "
                >
                  Whatever your pump,
                  <br className="hidden lg:block" />{" "}
                  we make the panel that runs it.
                </h2>
              </motion.div>

              <motion.a
                href="#all-products"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  group hidden w-fit shrink-0 items-center justify-center gap-3
                  rounded-full border border-[#aebdcb] bg-white/80
                  px-6 py-3 text-sm font-semibold text-[#071d33]
                  shadow-[0_10px_30px_rgba(7,29,51,0.06)]
                  backdrop-blur-md transition-all duration-300

                  hover:-translate-y-1 hover:border-[#1598df]
                  hover:bg-[#1598df] hover:text-white
                  hover:shadow-[0_16px_35px_rgba(21,152,223,0.22)]

                  sm:inline-flex
                "
              >
                Explore all

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </div>

            {/* Cards available-height wrapper */}
            <div className="min-h-0 flex-1 overflow-hidden">
              {/* 
                Mobile/tablet:
                - Horizontal card scrolling
                - One large card at a time
              
                Desktop:
                - Four cards in one row
                - All cards fit inside remaining 100vh space
              */}
              <div
                className="
                  grid h-full grid-flow-col auto-cols-[84vw] gap-6
                  overflow-x-auto overscroll-x-contain pb-1
                  snap-x snap-mandatory
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden

                  sm:auto-cols-[46vw]

                  lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-4
                  lg:overflow-visible lg:pb-0
                "
              >
                {rangeProducts.map((product, index) => (
                  <motion.a
                    key={product.title}
                    href={product.href}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -7 }}
                    className={[
                      `
                        group relative flex h-full min-h-0 snap-center flex-col
                        overflow-hidden rounded-[24px] border
                        transition-shadow duration-500
                      `,
                      product.dark
                        ? `
                          border-[#1668b2]
                          bg-gradient-to-b
                          from-[#247bd0]
                          via-[#0d559b]
                          to-[#063d73]
                          shadow-[0_22px_45px_rgba(4,66,125,0.22)]
                        `
                        : `
                          border-white bg-white
                          shadow-[0_22px_48px_rgba(7,29,51,0.10)]
                        `,
                    ].join(" ")}
                  >
                    {/* Top-right arrow */}
                    <span
                      className={`
                        absolute right-4 top-4 z-30
                        flex h-10 w-10 items-center justify-center
                        rounded-full bg-white text-[#071d33]
                        shadow-[0_8px_22px_rgba(7,29,51,0.12)]
                        transition-all duration-300

                        group-hover:rotate-45
                        group-hover:scale-110

                        xl:right-5 xl:top-5 xl:h-11 xl:w-11
                      `}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="none"
                      >
                        <path
                          d="M7 17L17 7M9 7h8v8"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    {/* Image area */}
                    <div
                      className={[
                        `
                          relative m-3 mb-0 flex h-[56%] min-h-0
                          items-center justify-center overflow-hidden
                          rounded-[19px]

                          lg:m-3 lg:mb-0
                          xl:m-4 xl:mb-0
                        `,
                        product.dark
                          ? "bg-gradient-to-b from-white/15 to-white/[0.03]"
                          : "bg-gradient-to-b from-[#fbfdff] to-[#edf2f6]",
                      ].join(" ")}
                    >
                      {/* Image glow */}
                      <div
                        aria-hidden="true"
                        className={[
                          `
                            absolute left-1/2 top-1/2
                            h-[65%] w-[70%]
                            -translate-x-1/2 -translate-y-1/2
                            rounded-full blur-[45px]
                          `,
                          product.dark ? "bg-[#56b2ff]/25" : "bg-white",
                        ].join(" ")}
                      />

                      <img
                        src={product.image}
                        alt={product.alt}
                        loading="lazy"
                        className={[
                          `
                            relative z-10 h-full w-full object-contain
                            p-[clamp(14px,2vh,30px)]
                            transition-transform duration-700 ease-out

                            group-hover:scale-[1.06]
                          `,
                          product.dark
                            ? "drop-shadow-[0_20px_22px_rgba(0,0,0,0.28)]"
                            : "mix-blend-multiply drop-shadow-[0_18px_18px_rgba(7,29,51,0.15)]",
                        ].join(" ")}
                      />

                      {/* Product bottom shadow */}
                      <div
                        aria-hidden="true"
                        className="
                          absolute bottom-3 left-1/2 h-5 w-[55%]
                          -translate-x-1/2 rounded-full
                          bg-black/10 blur-xl
                        "
                      />
                    </div>

                    {/* Text content */}
                    <div
                      className="
                        flex min-h-0 flex-1 flex-col
                        px-5 pb-5 pt-4

                        xl:px-6 xl:pb-6 xl:pt-5

                        [@media(max-height:720px)]:px-4
                        [@media(max-height:720px)]:pb-4
                        [@media(max-height:720px)]:pt-3
                      "
                    >
                      <h3
                        className={[
                          `
                            max-w-[250px]
                            text-[clamp(1.25rem,1.65vw,2rem)]
                            font-extrabold leading-[1.02]
                            tracking-[-0.035em]

                            [@media(max-height:720px)]:text-[clamp(1.15rem,1.4vw,1.65rem)]
                          `,
                          product.dark ? "text-white" : "text-[#071d33]",
                        ].join(" ")}
                      >
                        {product.title}
                      </h3>

                      <p
                        className={[
                          `
                            mt-2 max-w-[31ch]
                            text-[clamp(0.75rem,0.82vw,0.92rem)]
                            leading-[1.5]

                            [@media(max-height:700px)]:mt-1
                            [@media(max-height:700px)]:leading-[1.4]
                          `,
                          product.dark
                            ? "text-white/75"
                            : "text-[#536b80]",
                        ].join(" ")}
                      >
                        {product.description}
                      </p>

                      <span
                        className={[
                          `
                            mt-auto inline-flex w-fit items-center gap-3
                            rounded-full border px-5 py-2.5
                            text-xs font-semibold
                            transition-all duration-300

                            xl:px-6 xl:py-3 xl:text-sm

                            [@media(max-height:690px)]:px-4
                            [@media(max-height:690px)]:py-2
                          `,
                          product.dark
                            ? `
                              border-white/65 text-white
                              group-hover:border-white
                              group-hover:bg-white
                              group-hover:text-[#07437e]
                            `
                            : `
                              border-[#b8c5d1] text-[#071d33]
                              group-hover:border-[#1598df]
                              group-hover:bg-[#1598df]
                              group-hover:text-white
                            `,
                        ].join(" ")}
                      >
                        Explore

                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="
                            h-4 w-4 transition-transform duration-300
                            group-hover:translate-x-1
                          "
                          fill="none"
                        >
                          <path
                            d="M5 12h14M13 6l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>

                    {/* Dark-card shine */}
                    {product.dark && (
                      <div
                        aria-hidden="true"
                        className="
                          pointer-events-none absolute inset-0
                          bg-[linear-gradient(125deg,transparent_20%,rgba(255,255,255,0.09)_48%,transparent_70%)]
                          opacity-0 transition-opacity duration-500
                          group-hover:opacity-100
                        "
                      />
                    )}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Mobile explore-all link */}
            <a
              href="#all-products"
              className="
                mt-3 inline-flex shrink-0 items-center justify-center gap-2
                text-sm font-semibold text-[#1598df]
                sm:hidden
              "
            >
              Explore all products

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </section>
        <section className="pt-[clamp(4.5rem,9vw,8rem)]">
          <div className={cn('swrap', tw['swrap'])}>
            <div
              className={cn('sslider', tw['sslider'])}
              onMouseEnter={() => setSliderPaused(true)}
              onMouseLeave={() => setSliderPaused(false)}
              onFocusCapture={() => setSliderPaused(true)}
              onBlurCapture={() => setSliderPaused(false)}
            >
              <button
                type={"button"}
                className={cn('sarrow prev', tw['sarrow'])}
                aria-label={"Previous idea"}
                onClick={() => goToSlide(slide - 1, -1)}
              >
                <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
                  <path d={"M15 5l-7 7 7 7"}></path>
                </svg>
              </button>
              <div className={cn('sviewport', tw['sviewport'])}>
                <AnimatePresence initial={false} custom={slideDir}>
                  <motion.article
                    key={slide}
                    className={cn('sslide', tw['sslide'])}
                    custom={slideDir}
                    variants={slideVariants}
                    initial={"enter"}
                    animate={"center"}
                    exit={"exit"}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { x: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }, opacity: { duration: 0.3 } }
                    }
                  >
                    <div className={cn(
                        "sslide-media",
                        starIdeas[slide].img && "photo",
                        tw["sslide-media"],
                        starIdeas[slide].img && tw.photo,
                      )}>
                      {starIdeas[slide].img ? (
                        <img src={starIdeas[slide].img} alt={starIdeas[slide].alt} />
                      ) : (
                        <svg viewBox={"0 0 200 260"}>
                          <use href={starIdeas[slide].icon}></use>
                        </svg>
                      )}
                    </div>
                    <div className={cn('sslide-body', tw['sslide-body'])}>
                      <span className={cn('no', tw['no'])}>{starIdeas[slide].no}</span>
                      <h3>{starIdeas[slide].title}</h3>
                      <p>{starIdeas[slide].copy}</p>
                      {starIdeas[slide].chips.length > 0 && (
                        <div className={cn('chips', tw['chips'])}>
                          {starIdeas[slide].chips.map((chip) => (
                            <span className={cn('chip', tw['chip'])} key={chip}>{chip}</span>
                          ))}
                        </div>
                      )}
                      <a className={cn('slink', tw['slink'])} href={"#range"}>{starIdeas[slide].link}</a>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>
              <button
                type={"button"}
                className={cn('sarrow next', tw['sarrow'])}
                aria-label={"Next idea"}
                onClick={() => goToSlide(slide + 1, 1)}
              >
                <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
                  <path d={"M9 5l7 7-7 7"}></path>
                </svg>
              </button>
              <div className={cn('sdots', tw['sdots'])}>
                {starIdeas.map((idea, index) => (
                  <button
                    type={"button"}
                    key={idea.no}
                    className={cn("sdot", index === slide && "on", tw.sdot)}
                    aria-label={`Show idea ${index + 1}`}
                    aria-current={index === slide || undefined}
                    onClick={() => goToSlide(index, index > slide ? 1 : -1)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className={cn('section container', tw['section'], tw['container'])} id={"why"}>
          <div className={cn('section-head', tw['section-head'])}>
            <span className={cn('eyebrow reveal', tw['eyebrow'], tw['reveal'])} data-hi={"MRK मानक"}>The MRK standard</span>
            <h2 className={cn('title reveal d1', tw['title'], tw['reveal'])}>Why India chooses MRK.</h2>
          </div>
          <div className={cn('flipgrid', tw['flipgrid'])}>
            <div className={cn('flip-wrap reveal', tw['flip-wrap'], tw['reveal'])}>
              <div className={cn('flip', tw['flip'])}>
                <div className={cn('flip-face flip-front', tw['flip-face'], tw['flip-front'])}>
                  <span className={cn('fbadge', tw['fbadge'])}>+</span>
                  <div className={cn('fic', tw['fic'])}>
                    <svg viewBox={"0 0 24 24"}>
                      <path d={"M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 19.3 7.2 21.9l.9-5.4L4.2 8.7l5.4-.8z"}></path>
                    </svg>
                  </div>
                  <h4>Considered components</h4>
                </div>
                <div className={cn('flip-face flip-back', tw['flip-face'], tw['flip-back'])}>
                  <p>EPCOS and MRK-grade capacitors, chosen to endure.</p>
                </div>
              </div>
            </div>
            <div className={cn('flip-wrap reveal d1', tw['flip-wrap'], tw['reveal'])}>
              <div className={cn('flip', tw['flip'])}>
                <div className={cn('flip-face flip-front', tw['flip-face'], tw['flip-front'])}>
                  <span className={cn('fbadge', tw['fbadge'])}>+</span>
                  <div className={cn('fic', tw['fic'])}>
                    <svg viewBox={"0 0 24 24"}>
                      <rect x={"3"} y={"3"} width={"7"} height={"7"} rx={"1"}></rect>
                      <rect x={"14"} y={"3"} width={"7"} height={"7"} rx={"1"}></rect>
                      <rect x={"3"} y={"14"} width={"7"} height={"7"} rx={"1"}></rect>
                      <rect x={"14"} y={"14"} width={"7"} height={"7"} rx={"1"}></rect>
                    </svg>
                  </div>
                  <h4>A complete range</h4>
                </div>
                <div className={cn('flip-face flip-back', tw['flip-face'], tw['flip-back'])}>
                  <p>Every HP and phase under one name, entry-level to heavy-duty.</p>
                </div>
              </div>
            </div>
            <div className={cn('flip-wrap reveal d2', tw['flip-wrap'], tw['reveal'])}>
              <div className={cn('flip', tw['flip'])}>
                <div className={cn('flip-face flip-front', tw['flip-face'], tw['flip-front'])}>
                  <span className={cn('fbadge', tw['fbadge'])}>+</span>
                  <div className={cn('fic', tw['fic'])}>
                    <svg viewBox={"0 0 24 24"}>
                      <path d={"M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"}></path>
                    </svg>
                  </div>
                  <h4>Enclosures built to last</h4>
                </div>
                <div className={cn('flip-face flip-back', tw['flip-face'], tw['flip-back'])}>
                  <p>ABS and MS bodies, finished to look the part.</p>
                </div>
              </div>
            </div>
            <div className={cn('flip-wrap reveal', tw['flip-wrap'], tw['reveal'])}>
              <div className={cn('flip', tw['flip'])}>
                <div className={cn('flip-face flip-front', tw['flip-face'], tw['flip-front'])}>
                  <span className={cn('fbadge', tw['fbadge'])}>+</span>
                  <div className={cn('fic', tw['fic'])}>
                    <svg viewBox={"0 0 24 24"}>
                      <path d={"M4 7h6l2 3 2-6 2 9 2-3"}></path>
                      <path d={"M4 17h16"}></path>
                    </svg>
                  </div>
                  <h4>Precision wiring</h4>
                </div>
                <div className={cn('flip-face flip-back', tw['flip-face'], tw['flip-back'])}>
                  <p>Clean, safe and serviceable in every unit.</p>
                </div>
              </div>
            </div>
            <div className={cn('flip-wrap reveal d1', tw['flip-wrap'], tw['reveal'])}>
              <div className={cn('flip', tw['flip'])}>
                <div className={cn('flip-face flip-front', tw['flip-face'], tw['flip-front'])}>
                  <span className={cn('fbadge', tw['fbadge'])}>+</span>
                  <div className={cn('fic', tw['fic'])}>
                    <svg viewBox={"0 0 24 24"}>
                      <path d={"M12 3l7 3v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V6z"}></path>
                      <path d={"M9 12l2 2 4-4"}></path>
                    </svg>
                  </div>
                  <h4>Warranty & service</h4>
                </div>
                <div className={cn('flip-face flip-back', tw['flip-face'], tw['flip-back'])}>
                  <p>Assured through a nationwide dealer network.</p>
                </div>
              </div>
            </div>
            <div className={cn('flip-wrap reveal d2', tw['flip-wrap'], tw['reveal'])}>
              <div className={cn('flip', tw['flip'])}>
                <div className={cn('flip-face flip-front', tw['flip-face'], tw['flip-front'])}>
                  <span className={cn('fbadge', tw['fbadge'])}>+</span>
                  <div className={cn('fic', tw['fic'])}>
                    <svg viewBox={"0 0 24 24"}>
                      <path d={"M7 5h8a4 4 0 0 1 0 8H8m-1 5h9M6 9h12"}></path>
                    </svg>
                  </div>
                  <h4>Value, without compromise</h4>
                </div>
                <div className={cn('flip-face flip-back', tw['flip-face'], tw['flip-back'])}>
                  <p>Advanced protection, priced for India.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={cn('section container tsec', tw['section'], tw['container'], tw['tsec'])}>
          <div className={cn('thead', tw['thead'])}>
            <div className={cn('section-head', tw['section-head'])}>
              <span className={cn('eyebrow reveal', tw['eyebrow'], tw['reveal'])} data-hi={"ग्राहकों की ज़ुबानी"}>In their words</span>
              <h2 className={cn('title reveal d1', tw['title'], tw['reveal'])}>Trusted where water matters most.</h2>
            </div>
            <div className={cn('tnav reveal d1', tw['tnav'], tw['reveal'])}>
              <button
                type={"button"}
                aria-label={"Previous testimonials"}
                disabled={testimonialRail.atEnds[0]}
                onClick={() => testimonialRail.nudge(-1)}
              >
                <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
                  <path d={"M15 5l-7 7 7 7"}></path>
                </svg>
              </button>
              <button
                type={"button"}
                aria-label={"Next testimonials"}
                disabled={testimonialRail.atEnds[1]}
                onClick={() => testimonialRail.nudge(1)}
              >
                <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
                  <path d={"M9 5l7 7-7 7"}></path>
                </svg>
              </button>
            </div>
          </div>
          <div className={cn('tgrid', tw['tgrid'])} ref={testimonialRail.ref} onScroll={testimonialRail.sync}>
            {testimonials.map((item, index) => (
              <article
                className={cn(
                  "tcard reveal",
                  item.video && "tcard-media",
                  tw.tcard,
                  tw.reveal,
                  item.video && tw["tcard-media"],
                )}
                key={item.name}
              >
                {item.video ? <img src={item.img} alt={item.alt} /> : null}
                <div className={cn('tcard-top', tw['tcard-top'])}>
                  <span className={cn('stars5', tw['stars5'])} aria-label={"Rated 5 out of 5"}>★★★★★</span>
                  <span className={cn('tidx', tw['tidx'])} aria-hidden={"true"}>
                    {index + 1}/{testimonials.length}
                  </span>
                </div>
                {item.video ? (
                  <button className={cn('tplay', tw['tplay'])} type={"button"} aria-label={"Play video testimonial"}>
                    <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
                      <path d={"M8 5l11 7-11 7z"}></path>
                    </svg>
                  </button>
                ) : (
                  <p>{item.quote}</p>
                )}
                <div className={cn('who', tw['who'])}>
                  {item.video ? null : <div className={cn('av', tw['av'])}>{item.initial}</div>}
                  <div>
                    <b>{item.name}</b>
                    <span>{item.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className={cn('ph-note', tw['ph-note'])}>▲ Send 5 real quotes with name + city to replace these.</p>
        </section>
        <section className={cn('deal', tw['deal'])} id={"dealer"}>
          <svg className={cn('wave-top', tw['wave-top'])} viewBox={"0 0 1200 60"} preserveAspectRatio={"none"} aria-hidden={"true"}>
            <path d={"M0,30 C200,55 400,5 600,26 C800,48 1000,8 1200,30 L1200,0 L0,0 Z"}></path>
          </svg>
          <div className={cn('deal-bubbles', tw['deal-bubbles'])} aria-hidden={"true"}>
            <span className={cn("bub", tw.bub, "bottom-[18%] left-[12%] h-[14px] w-[14px] [animation-delay:0s]")}></span>
            <span className={cn("bub", tw.bub, "bottom-[8%] left-[28%] h-[22px] w-[22px] [animation-delay:1.6s]")}></span>
            <span className={cn("bub", tw.bub, "bottom-[22%] left-[66%] h-3 w-3 [animation-delay:.8s]")}></span>
            <span className={cn("bub", tw.bub, "bottom-[12%] left-[82%] h-[18px] w-[18px] [animation-delay:2.4s]")}></span>
            <span className={cn("bub", tw.bub, "bottom-[30%] left-[48%] h-[10px] w-[10px] [animation-delay:3.2s]")}></span>
          </div>
          <div className={cn('container section', tw['container'], tw['section'])}>
            <div className={cn('inner', tw['inner'])}>
              <div className={cn('reveal', tw['reveal'])}>
                <span className={cn("eyebrow", tw.eyebrow, "!text-splash")} data-hi={"डीलर बनें"}>Become a dealer</span>
                <h2>Build your business with a complete pump-starter range.</h2>
                <p>
                  Single-phase, three-phase and smart plugs under one name, so one relationship covers every customer. Dependable margins, full-range demand, and marketing support.
                </p>
                <a className={cn('btn btn-light', tw['btn'], tw['btn-light'])} href={"#contact"} data-hi={"डीलरशिप के लिए आवेदन करें"}>
                  Apply for dealership
                  <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                    <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                  </svg>
                </a>
              </div>
              <div className={cn('dstats reveal d1', tw['dstats'], tw['reveal'])}>
                <div>
                  <b>1,000+</b>
                  <span>Dealers</span>
                </div>
                <div>
                  <b>500+</b>
                  <span>Cities</span>
                </div>
                <div>
                  <b>20+</b>
                  <span>States</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={cn('section container', tw['section'], tw['container'])} id={"downloads"}>
          <div className={cn('section-head', tw['section-head'])}>
            <span className={cn('eyebrow reveal', tw['eyebrow'], tw['reveal'])} data-hi={"डाउनलोड"}>Downloads</span>
            <h2 className={cn('title reveal d1', tw['title'], tw['reveal'])}>Everything you need, in one place.</h2>
          </div>
          <div className={cn('dl-grid', tw['dl-grid'])}>
            <a className={cn('dl-card reveal', tw['dl-card'], tw['reveal'])} href={"#"}>
              <span className={cn('dic', tw['dic'])}>
                <svg viewBox={"0 0 24 24"}>
                  <path d={"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}></path>
                  <path d={"M14 2v6h6"}></path>
                  <path d={"M12 12v6m0 0l-2.5-2.5M12 18l2.5-2.5"}></path>
                </svg>
              </span>
              <div>
                <h4>Product Catalog</h4>
                <p>PDF · full range</p>
              </div>
              <span className={cn('arr', tw['arr'])}>↓</span>
            </a>
            <a className={cn('dl-card reveal d1', tw['dl-card'], tw['reveal'])} href={"#"}>
              <span className={cn('dic', tw['dic'])}>
                <svg viewBox={"0 0 24 24"}>
                  <path d={"M9 3h6l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"}></path>
                  <path d={"M8 12h8M8 16h8M8 8h3"}></path>
                </svg>
              </span>
              <div>
                <h4>Current Price List</h4>
                <p>PDF · updated pricing</p>
              </div>
              <span className={cn('arr', tw['arr'])}>↓</span>
            </a>
          </div>
        </section>
      </main>
      <footer className={cn('foot', tw['foot'])} id={"contact"}>
        <svg className={cn('wave-top', tw['wave-top'])} viewBox={"0 0 1200 56"} preserveAspectRatio={"none"} aria-hidden={"true"}>
          <path d={"M0,28 C220,52 420,6 620,26 C820,46 1010,8 1200,30 L1200,0 L0,0 Z"}></path>
        </svg>
        <div className={cn('container', tw['container'])}>
          <div className={cn('foot-main', tw['foot-main'])}>
            <div>
              <div className={cn('fbrand', tw['fbrand'])}>
                <img className={cn('logo flogo', tw['logo'], tw['flogo'])} src={"/images/mrk-logo.png"} alt={"MRK"} />
                Tradex Pvt Ltd
              </div>
              <div className={cn('ftag', tw['ftag'])} data-hi={"पानी ही जीवन है, और हम आपके जीवन को पानी से भरते हैं।"}>Water is life, and we fill your life with water.</div>
              <address>
                R/3A, Dooars Trp Compound, GT Road,
                <br />
                Sahibabad, Ghaziabad, Uttar Pradesh 201005
                <br />
                <a href={"tel:+919319719670"}>+91 93197 19670</a>
                <br />
                <a href={"mailto:rajesh.mrktradex@gmail.com"}>rajesh.mrktradex@gmail.com</a>
              </address>
              <span className={cn('tagpill', tw['tagpill'])}>GST: [add number]</span>
            </div>
            <div>
              <h5>Products</h5>
              <ul>
                <li>
                  <a href={"#range"}>Single-Phase Starters</a>
                </li>
                <li>
                  <a href={"#range"}>Three-Phase Panels</a>
                </li>
                <li>
                  <a href={"#range"}>WLC Smart Plugs</a>
                </li>
                <li>
                  <a href={"#range"}>Cables & Accessories</a>
                </li>
              </ul>
            </div>
            <div>
              <h5>Company</h5>
              <ul>
                <li>
                  <a href={"#why"}>Why MRK</a>
                </li>
                <li>
                  <a href={"#dealer"}>Become a Dealer</a>
                </li>
                <li>
                  <a href={"#downloads"}>Downloads</a>
                </li>
                <li>
                  <a href={"#"}>YouTube: [add link]</a>
                </li>
              </ul>
            </div>
            <div>
              <h5>Get in touch</h5>
              <ul>
                <li>
                  <a href={"tel:+919319719670"}>Call us</a>
                </li>
                <li>
                  <a href={"#"}>WhatsApp</a>
                </li>
                <li>
                  <a href={"#contact"}>Feedback</a>
                </li>
                <li>
                  <a href={"#"}>Find a dealer</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={cn('foot-bottom', tw['foot-bottom'])}>
            <span>© 2026 MRK Tradex Pvt Ltd. All rights reserved.</span>
            <span>
              <a href={"#"}>Privacy Policy</a>
              ·
              <a href={"#"}>Terms & Conditions</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
