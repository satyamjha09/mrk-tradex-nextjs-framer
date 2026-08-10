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
import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import ProductStackSection from "./ProductStack";
import CurvedVideoReel from "./CurvedVideoReel";
import FaqAccordion from "./FaqAccordion";
import {
  Award,
  Headset,
  IndianRupee,
  PanelTop,
  Shield,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

import SiteFooter from "@/app/components/layout/SiteFooter";
import { shopUrl } from "@/app/data/catalog/series";
import useToast from "@/app/hooks/ui/useToast";
import { useCreateDealerApplicationMutation } from "@/app/store/apis/MrkApi";

const SHOP_URL = "/shop";

function ReviewStars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span
      className={cn("stars5", tw["stars5"])}
      aria-label={`Rated ${rating} out of 5`}
    >
      <span aria-hidden={"true"} className="text-[#F5A524]">
        {"★".repeat(filled)}
      </span>
      <span aria-hidden={"true"} className="text-line">
        {"★".repeat(5 - filled)}
      </span>
    </span>
  );
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function ParticleWordmark({ text }: { text: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Array<{
      x: number;
      y: number;
      hx: number;
      hy: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }> = [];
    const mouse = { x: -9999, y: -9999 };

    const initCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(Math.floor(rect.width), 1);
      const height = Math.max(Math.floor(rect.height), 1);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offscreenCtx = offscreen.getContext("2d");
      if (!offscreenCtx) return;
      
      let fontSize = height * 0.65;
      offscreenCtx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      while (offscreenCtx.measureText(text).width > width * 0.92 && fontSize > 12) {
        fontSize -= 2;
        offscreenCtx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      }
      offscreenCtx.textAlign = "center";
      offscreenCtx.textBaseline = "middle";
      offscreenCtx.fillStyle = "#ffffff";
      offscreenCtx.fillText(text, width / 2, height / 2);

      const imageData = offscreenCtx.getImageData(0, 0, width, height).data;
      const gap = width < 520 ? 4 : 3;
      const points: Array<{ x: number; y: number }> = [];

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          if (imageData[(y * width + x) * 4 + 3] > 128) {
            points.push({ x, y });
          }
        }
      }

      const colorA = [30, 51, 201];
      const colorB = [77, 124, 255];
      particles = points.map((point) => {
        const ratio = point.x / width;
        const r = Math.round(colorA[0] + (colorB[0] - colorA[0]) * ratio);
        const g = Math.round(colorA[1] + (colorB[1] - colorA[1]) * ratio);
        const b = Math.round(colorA[2] + (colorB[2] - colorA[2]) * ratio);

        return {
          x: Math.random() * width,
          y: Math.random() * height + (Math.random() < 0.5 ? -height : height),
          hx: point.x,
          hy: point.y,
          vx: 0,
          vy: 0,
          size: 1.35 * (0.75 + Math.random() * 0.55),
          color: `rgb(${r},${g},${b})`,
        };
      });

      particles.forEach((particle) => {
        gsap.to(particle, {
          x: particle.hx,
          y: particle.hy,
          duration: 1.8 + Math.random() * 0.8,
          ease: "power3.out",
        });
      });
    };

    const handlePointerMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const radius = 60;

        if (distSq < radius * radius) {
          const distance = Math.sqrt(distSq) || 1;
          const force = (1 - distance / radius) * 2.2;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        particle.vx += (particle.hx - particle.x) * 0.08;
        particle.vy += (particle.hy - particle.y) * 0.08;
        particle.vx *= 0.82;
        particle.vy *= 0.82;
        particle.x += particle.vx;
        particle.y += particle.vy;

        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    initCanvas();
    render();

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("resize", initCanvas);

    return () => {
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("resize", initCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      className="relative z-10 my-3 h-[116px] w-full max-w-[980px] sm:h-[150px] md:h-[190px] lg:h-[210px]"
    />
  );
}

function DealerParticleSection() {
  return (
    <section
      id={"dealer"}
      className="relative overflow-hidden bg-[#f7f9ff] px-4 py-16 text-center sm:px-6 md:px-16 md:py-20"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_55%_at_50%_40%,rgba(77,124,255,0.12),transparent_75%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-35 bg-[linear-gradient(to_right,rgba(46,75,239,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(46,75,239,0.10)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#4d7cff]/25 bg-[#eef3ff] px-4 py-1.5 text-xs font-semibold tracking-wide text-[#1e33c9] md:text-sm"
        >
          <svg className="h-4 w-4 text-[#2e4bef]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3l1.4 5.2L19 7l-4.2 3.8L17 16l-5-2.8L7 16l2.2-5.2L5 7l5.6 1.2L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          Pump-starter dealership network
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full justify-center"
        >
          <ParticleWordmark text="MRKTradex" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-[#5A6178] sm:text-lg md:text-xl"
        >
          Build your business with a complete pump-starter range covering
          single-phase, three-phase and smart water-level products.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#1E33C9,#4D7CFF)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(46,75,239,0.28)] transition-shadow hover:shadow-[0_18px_42px_rgba(46,75,239,0.34)] md:text-base"
          >
            Apply for dealership
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </motion.div>

        <div className="mt-14 grid w-full max-w-4xl grid-cols-3 gap-4 border-t border-[#0d559b]/10 pt-8">
          {[
            ["1,000+", "Dealers"],
            ["500+", "Cities"],
            ["20+", "States"],
          ].map(([value, label], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: 0.32 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="bg-[linear-gradient(135deg,#0d559b,#1e9be0)] bg-clip-text text-3xl font-extrabold tracking-[-0.04em] text-transparent md:text-4xl">
                {value}
              </div>
              <div className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#536b80] md:text-xs">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


// each card pairs a claim with a photograph of the thing being claimed, so the
// grid reads as evidence rather than six icons. imgClass carries the crop: the
// studio shots sit on their own backdrop and are contained, the in-situ photos
// are cropped away from their watermarks and clutter.
// A bento grid: on wide screens the row shapes are 4+2+2 and 2+3+3 across eight
// columns, so the two picture cards and the closing value card each get room to
// breathe. Everything collapses to two columns, then one, further down.
type WhyCard = {
  title: string;
  hiTitle: string;
  copy: string;
  hiCopy: string;
  icon: LucideIcon;
  span: string;
  img?: string;
  alt?: string;
  imgClass?: string;
  tone?: "light" | "dark";
};

const whyCards: WhyCard[] = [
  {
    title: "Considered components",
    hiTitle: "सोच-समझकर चुने गए कंपोनेंट",
    copy: "EPCOS and MRK-grade capacitors, chosen to endure the supply our customers actually get.",
    hiCopy: "EPCOS और MRK-ग्रेड कैपेसिटर, टिकाऊपन को ध्यान में रखकर चुने गए।",
    icon: Award,
    span: "md:col-span-2 lg:col-span-4",
    img: "/images/panel-components.png",
    alt: "MRK capacitor and terminal block inside an open starter panel",
    imgClass: "object-contain",
  },
  {
    title: "Warranty & service",
    hiTitle: "वारंटी और सर्विस",
    copy: "Assured through a nationwide dealer network, with spares close to where you are.",
    hiCopy: "देशभर के डीलर नेटवर्क के ज़रिए, स्पेयर आपके नज़दीक।",
    icon: Headset,
    span: "md:col-span-1 lg:col-span-2",
  },
  {
    title: "Enclosures built to last",
    hiTitle: "मज़बूत एनक्लोज़र",
    copy: "ABS and MS bodies, finished to look the part on the wall for years.",
    hiCopy: "ABS और MS बॉडी, सालों तक दीवार पर अच्छी दिखने वाली फिनिश के साथ।",
    icon: Shield,
    span: "md:col-span-1 lg:col-span-2",
  },
  {
    title: "Precision wiring",
    hiTitle: "सटीक वायरिंग",
    copy: "Clean, safe and serviceable in every unit, so any electrician can work on it.",
    hiCopy: "हर यूनिट में साफ़, सुरक्षित और सर्विस-योग्य वायरिंग।",
    icon: Waypoints,
    span: "md:col-span-1 lg:col-span-2",
  },
  {
    title: "A complete range",
    hiTitle: "पूरी रेंज",
    copy: "Every HP and phase under one name, from entry-level starters to heavy-duty panels.",
    hiCopy: "हर HP और फेज़ एक ही नाम के तहत, एंट्री-लेवल से हैवी-ड्यूटी तक।",
    icon: PanelTop,
    span: "md:col-span-1 lg:col-span-3",
    img: "/images/single-phase-starter.png",
    alt: "An MRK single-phase starter panel",
    imgClass: "object-contain",
  },
  {
    title: "Value, without compromise",
    hiTitle: "बिना समझौते के वैल्यू",
    copy: "Advanced protection, priced for India, with nothing quietly left out to hit a number.",
    hiCopy: "बेहतर सुरक्षा, भारत के लिए सही कीमत पर।",
    icon: IndianRupee,
    span: "md:col-span-2 lg:col-span-3",
    tone: "dark",
  },
];

/** Soft organic wash behind the picture cards. */
function WhyBlob({ className }: { className?: string }) {
  return (
    <svg
      viewBox={"0 0 200 200"}
      aria-hidden={"true"}
      className={className}
      fill={"currentColor"}
    >
      <path
        d={
          "M45.6,-58.3C58.3,-49.5,66.5,-34.2,70.2,-18.1C73.9,-2,73.1,14.9,66.2,28.8C59.3,42.7,46.3,53.6,31.7,60.5C17.1,67.4,0.9,70.3,-15.6,68.1C-32.1,65.9,-48.9,58.6,-59.6,45.9C-70.3,33.2,-74.9,15.1,-73.4,-2.1C-71.9,-19.3,-64.3,-35.6,-52.4,-45.1C-40.5,-54.6,-24.3,-57.3,-8.4,-59.3C7.5,-61.3,32.9,-67.1,45.6,-58.3Z"
        }
        transform={"translate(100 100)"}
      />
    </svg>
  );
}

/**
 * A stylised India outline for the closing card. Deliberately simplified — it
 * sits at low opacity as a dashed silhouette, so it reads as the map without
 * pretending to be a survey boundary.
 */
function IndiaOutline({ className }: { className?: string }) {
  const outline =
    "M74 16 L88 10 L96 22 L112 30 L130 40 L150 52 L168 60 L182 58 L192 66 L186 78 L194 86 L180 90 L168 84 L158 92 L150 106 L146 122 L138 146 L128 172 L116 198 L104 226 L94 206 L84 180 L74 152 L64 126 L54 104 L38 96 L26 84 L34 70 L48 58 L58 40 L66 26 Z";

  return (
    <svg
      viewBox={"0 0 220 240"}
      aria-hidden={"true"}
      className={className}
      fill={"none"}
    >
      <path
        d={outline}
        stroke={"currentColor"}
        strokeWidth={1.5}
        strokeDasharray={"3 5"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      />
      {[
        [110, 74],
        [110, 122],
        [110, 170],
        [72, 122],
        [148, 122],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2.4} fill={"currentColor"} />
      ))}
    </svg>
  );
}

const dealerStats: { value: string; label: string; hi: string }[] = [
  { value: "1,000+", label: "Dealers", hi: "डीलर" },
  { value: "500+", label: "Cities", hi: "शहर" },
  { value: "20+", label: "States", hi: "राज्य" },
];

// The short version of the /dealer application. These four are exactly the
// fields that page treats as required, so a submission from here is a complete
// record — the optional detail is collected later, not dropped.
type DealerFormFieldName = "name" | "businessName" | "address" | "mobile";

type DealerFormField = {
  name: DealerFormFieldName;
  label: string;
  hi: string;
  placeholder: string;
  autoComplete: string;
  type?: string;
  inputMode?: "numeric" | "tel" | "text";
  multiline?: boolean;
};

const dealerFormFields: DealerFormField[] = [
  {
    name: "name",
    label: "Name",
    hi: "नाम",
    placeholder: "Your full name",
    autoComplete: "name",
  },
  {
    name: "businessName",
    label: "Business name",
    hi: "व्यवसाय का नाम",
    placeholder: "Shop or firm name",
    autoComplete: "organization",
  },
  {
    name: "address",
    label: "Address",
    hi: "पता",
    placeholder: "Shop address with city",
    autoComplete: "street-address",
    multiline: true,
  },
  {
    name: "mobile",
    label: "Mobile number",
    hi: "मोबाइल नंबर",
    placeholder: "10-digit mobile number",
    autoComplete: "tel",
    type: "tel",
    inputMode: "numeric",
  },
];

const emptyDealerForm: Record<DealerFormFieldName, string> = {
  name: "",
  businessName: "",
  address: "",
  mobile: "",
};

function DealerApplicationForm() {
  const { showToast } = useToast();
  const [createDealerApplication, { isLoading }] =
    useCreateDealerApplicationMutation();
  const [form, setForm] = useState(emptyDealerForm);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.businessName.trim() ||
      !form.address.trim() ||
      !form.mobile.trim()
    ) {
      showToast(
        "Name, business name, address, and mobile are required",
        "error",
      );
      return;
    }

    try {
      await createDealerApplication({
        name: form.name,
        businessName: form.businessName,
        address: form.address,
        mobile: form.mobile,
        // distinguishes these from the full /dealer submissions in the inbox
        metadata: { source: "home_dealer_cta" },
      }).unwrap();

      setForm(emptyDealerForm);
      showToast("Dealer application submitted successfully", "success");
    } catch (error: any) {
      showToast(
        error?.data?.message || "Failed to submit dealer application",
        "error",
      );
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[0.95rem] text-white outline-none transition-colors placeholder:text-white/45 focus:border-[#5fb8ef] focus:bg-white/[0.16]";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-[24px] border border-white/15 bg-white/[0.07] p-6 shadow-[0_24px_60px_rgba(3,17,32,0.35)] backdrop-blur-md sm:p-8 lg:max-w-[470px] lg:justify-self-end"
    >
      <h3
        className="text-[1.35rem] font-extrabold tracking-[-0.02em] text-white"
        data-hi={"डीलर आवेदन"}
      >
        Dealer application
      </h3>
      <p
        className="mt-2 text-[0.9rem] leading-relaxed text-white/60"
        data-hi={"अपनी जानकारी भेजें और हमारी टीम आपसे संपर्क करेगी।"}
      >
        Share your details and our team will get in touch.
      </p>

      <div className="mt-6 space-y-4">
        {dealerFormFields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`dealer-${field.name}`}
              className="mb-2 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/60"
              data-hi={field.hi}
            >
              {field.label}
            </label>
            {field.multiline ? (
              <textarea
                id={`dealer-${field.name}`}
                name={field.name}
                rows={2}
                required
                value={form[field.name]}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.name]: event.target.value,
                  }))
                }
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                className={`${fieldClass} resize-none`}
              />
            ) : (
              <input
                id={`dealer-${field.name}`}
                name={field.name}
                type={field.type ?? "text"}
                inputMode={field.inputMode}
                required
                value={form[field.name]}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.name]: event.target.value,
                  }))
                }
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                className={fieldClass}
              />
            )}
          </div>
        ))}
      </div>

      <motion.button
        type={"submit"}
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-[0.95rem] font-bold text-[#0a2540] shadow-[0_18px_40px_rgba(3,17,32,0.35)] transition-colors hover:bg-[#eaf4fd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Submitting..." : "Apply for dealership"}
        {!isLoading && (
          <svg
            viewBox={"0 0 24 24"}
            aria-hidden={"true"}
            className="h-4 w-4 fill-none stroke-current stroke-2"
          >
            <path
              d={"M5 12h14M13 6l6 6-6 6"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
            ></path>
          </svg>
        )}
      </motion.button>
    </motion.form>
  );
}

function DealerCtaSection() {
  return (
    <section
      id={"dealer"}
      className="relative overflow-hidden bg-[#071a2e] bg-[radial-gradient(125%_130%_at_88%_78%,#1a7ac6_0%,#0d4d88_26%,#0a2c4d_56%,#071a2e_100%)]"
    >
      <div
        aria-hidden={"true"}
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#1e9be0]/10 blur-[150px]"
      />
      <div
        aria-hidden={"true"}
        className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] gap-12 px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
        <div className="max-w-[640px]">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="block font-mono text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#5fb8ef]"
            data-hi={"डीलर बनें"}
          >
            Become a dealer
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white"
            data-hi={"पूरी पंप-स्टार्टर रेंज के साथ अपना कारोबार बढ़ाइए।"}
          >
            Build your business with a complete pump-starter range.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-[560px] text-[clamp(1rem,1.15vw,1.15rem)] leading-relaxed text-white/70"
            data-hi={"सिंगल-फेज़, थ्री-फेज़ और स्मार्ट प्लग एक ही नाम के तहत, ताकि एक रिश्ता हर ग्राहक को कवर करे। भरोसेमंद मार्जिन, पूरी रेंज की माँग और मार्केटिंग सहयोग।"}
          >
            Single-phase, three-phase and smart plugs under one name, so one
            relationship covers every customer. Dependable margins, full-range
            demand, and marketing support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={"#contact"}
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[0.95rem] font-bold text-[#0a2540] shadow-[0_18px_40px_rgba(3,17,32,0.35)] transition-colors hover:bg-[#eaf4fd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Apply for dealership
              <svg
                viewBox={"0 0 24 24"}
                aria-hidden={"true"}
                className="h-4 w-4 fill-none stroke-current stroke-2"
              >
                <path
                  d={"M5 12h14M13 6l6 6-6 6"}
                  strokeLinecap={"round"}
                  strokeLinejoin={"round"}
                ></path>
              </svg>
            </motion.a>
          </motion.div>

          {/* Stats sit under the copy now — the right column belongs to the form. */}
          <div className="mt-12 flex flex-wrap gap-x-[clamp(1.75rem,4vw,3.5rem)] gap-y-8 border-t border-white/10 pt-10">
            {dealerStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.55,
                  delay: 0.3 + index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="text-[clamp(1.9rem,3.2vw,2.6rem)] font-extrabold leading-none tracking-[-0.04em] text-white">
                  {stat.value}
                </div>
                <div
                  className="mt-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/55"
                  data-hi={stat.hi}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <DealerApplicationForm />
      </div>
    </section>
  );
}

function formatIndian(value: number) {
  const rounded = Math.round(value).toString();
  const lastThree = rounded.slice(-3);
  let rest = rounded.slice(0, -3);

  if (!rest) return lastThree;
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${lastThree}`;
}

const starIdeas: {
  no: string;
  title: string;
  copy: string;
  img: string;
  alt: string;
  chips: string[];
  link: string;
  icon?: string;
}[] = [
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

const GOOGLE_LISTING_URL = "https://maps.app.goo.gl/vuo8G1zForLxoT1bA";

const googleReviewLinks = [
  {
    label: "Read all Google reviews",
    href: GOOGLE_LISTING_URL,
  },
  {
    label: "Write a review",
    href: GOOGLE_LISTING_URL,
  },
];

// Individual reviews from the Google Maps listing, each quoted verbatim with
// the reviewer's name and star rating exactly as published. Spelling is theirs.
//
// The earlier entries here were Google's auto-generated "review summary"
// snippets, which carry no author, which is why the cards had no names. These
// are whole reviews, so they can be attributed.
//
// Names must be copied from the listing, never guessed — anything else is false
// attribution on a real person's words. Omitting `name` falls back to a generic
// "Google review" byline.
const googleReviews: { quote: string; rating: number; name?: string }[] = [
  {
    quote:
      "Yeah ! You can buy different types of Panel from here in minimum Amount. And The Company also give us one year warranty.",
    rating: 4,
    name: "Amit Dubey",
  },
  {
    quote: "Very nice product WLC MRK PLUG",
    rating: 5,
    name: "sanjay sharma",
  },
  {
    quote: "Very nice wlc prodect tank over flow",
    rating: 5,
    name: "Pankaj Singj",
  },
];


const rangeProducts = [
  {
    title: "I-Phase Starter Panels",
    description:
      "Multiple series of I-phase starters for motors up to 7.5 HP, available in both manual and fully digital options.",
    image: "/images/wlcphase.png",
    alt: "MRK single-phase starters",
    href: shopUrl("single-phase-starter"),
    dark: false,
  },
  {
    title: "III-Phase Starter Panels",
    description:
      "A complete range of III-phase starter panels in DOL and Star Delta models, suitable for motors up to 40 HP and designed for agriculture, industrial applications, and high-rise societies.",
    image: "/images/three-phase-panel.png",
    alt: "MRK three-phase control panel",
    href: shopUrl("three-phase-panel"),
    dark: true,
  },
  {
    title: "WLC Smart Plugs",
    description:
      "Our new arrivals for effortless water level control, available in two options: Sensor-wire models and Wi-Fi models.",

    // This existing image will remain visible.
    // Change it to "/images/wlc-smart-plug.png"
    // only after adding that file inside public/images.
    image: "/images/mrg-dpt-2-auto-timer.png",

    alt: "MRK WLC smart plug",
    href: shopUrl("wlc-smart-plug"),
    dark: false,
  },
  {
    title: "Switch Gears",
    description:
      "Long-lasting, rugged-quality switches, digital meters, capacitors, and contactors are the hallmark of our starter panels.",
    image: "/images/switch&gears.jpeg",
    alt: "MRK switch gears and accessories",
    href: shopUrl("cables-accessories"),
    dark: true,
  },
] as const;

const showcaseSlides = [
  { src: "/images/single-phase-starter.png", alt: "MRK single-phase starter" },
  { src: "/images/three-phase-panel.png", alt: "MRK three-phase control panel" },
  { src: "/images/panel-components.png", alt: "MRK panel components" },
  { src: "/images/mrg-dpt-2-auto-timer.png", alt: "MRK MRG auto-timer" },
  { src: "/images/intro-panels-wave.jpg", alt: "MRK starters and panels" },
  { src: "/images/intro-products.jpg", alt: "The MRK product range" },
  { src: "/images/farmers.jpeg", alt: "A farmer at a pump running on MRK protection" },
] as const;

const showcaseStats = [
  { label: "In service since", value: "2005" },
  { label: "Based in", value: "India" },
  { label: "Dealers", value: "1000+" },
] as const;

const VISIBLE_SLIDES = 4;

// an autoplaying four-up image rail. the window of visible slides walks forward
// every 3s and wraps, so the strip reads as continuous without cloning nodes.
function ProductShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const reducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (reducedMotion) return;
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % showcaseSlides.length);
    }, 3000);
  }, [reducedMotion, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  // stepping restarts the timer so a manual move always gets a full 3s to be read.
  const step = useCallback(
    (delta: number) => {
      setCurrentSlide(
        (prev) => (prev + delta + showcaseSlides.length) % showcaseSlides.length,
      );
      startAutoplay();
    },
    [startAutoplay],
  );

  const visibleSlides = Array.from(
    { length: VISIBLE_SLIDES },
    (_, offset) => (currentSlide + offset) % showcaseSlides.length,
  );

 
}

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
  root: "min-h-screen bg-paper text-ink [&_a]:no-underline [&_img]:block [&_img]:max-w-full [&_:focus-visible]:rounded-sm [&_:focus-visible]:outline [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-[3px] [&_:focus-visible]:outline-aqua",
  container: "mx-auto w-full max-w-[1200px] px-6",
  section: "py-[clamp(4.5rem,9vw,8rem)]",
  reveal: "translate-y-[26px] opacity-0 [&.in]:translate-y-0 [&.in]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100",
  eyebrow: "mb-4 inline-block font-mono text-[0.72rem] uppercase tracking-[0.24em] text-aqua",
  title: "font-sans text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.01em] text-ink",
  "section-head": "mb-[clamp(2.4rem,5vw,3.6rem)] max-w-[60ch]",


  nav: "fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-8 sm:px-12 py-4 transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)] [&.scrolled]:bg-paper/85 [&.scrolled]:py-3 [&.scrolled]:shadow-[0_1px_0_rgb(var(--line))] [&.scrolled]:backdrop-blur-md",
  brand: "flex items-center gap-2 font-semibold ml-2 sm:ml-6",
  logo: "h-[36px] sm:h-[39px] w-auto max-w-none transition-all duration-300",
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

  // above 900px the copy sits in the scrim over the photo; below it the photo is
  // dropped and the copy becomes a centred, content-height block.
  // the 52vw ceiling keeps the hero flatter than the photo's own 16:9 (56.28vw),
  // so bg-cover always fits the image by width. that pins the product cluster to
  // a known fraction of the hero (it ends at 55.8% of the source image) whatever
  // the viewport does, and the copy column can be parked clear of it. the 4.3vw
  // of surplus image height is split top and bottom by bg-center, trimming empty
  // sky above and the tail of the reflections below.
  // 92svh keeps the whole hero, button included, inside the first screen; on a
  // short, wide window svh is what drives the height and anything over 100 clips.
  hero: "relative flex min-h-[max(520px,min(92svh,52vw))] w-full items-center overflow-hidden bg-[linear-gradient(180deg,#FBFDFF_0%,#EDF6FC_100%)] pt-10 sm:pt-14 max-[900px]:min-h-0 max-[900px]:py-14",
  "hero-photo": "pointer-events-none absolute inset-0 bg-[url('/images/hero_section1.png')] bg-cover bg-center max-[900px]:hidden",
  // the product cluster ends at 55.8% of the photo, so the scrim is held fully
  // transparent until 56% and only then lifts — the whole fade now falls in
  // empty water and none of it touches the lineup. the stops are measured
  // against the hero, not the scrim's own box, so they hold at every width
  // without a separate narrow-viewport variant. the photo's right side is
  // near-white empty water already, so a light veil is enough for the copy.
  "hero-scrim": "pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_56%,rgba(255,255,255,.5)_68%,rgba(255,255,255,.66)_100%)] max-[900px]:hidden",
  // 62% clears the cluster's 55.8% edge with room for the scrim's fade to land
  // in between, and buys the headline ~50px more line width than the old 65%.
  "hero-inner": "relative z-10 w-full pl-[62%] pr-[3%] max-[900px]:flex max-[900px]:flex-col max-[900px]:items-center max-[900px]:px-5 max-[900px]:text-center min-[520px]:max-[900px]:px-8",
  "hero-copy": "max-w-[620px] translate-y-4 max-[900px]:translate-y-0",
  // below 900px the backdrop photo is dropped, so the lineup gets its own block
  // instead of vanishing. 4:3 anchored left shows the cluster (which ends at
  // 55.8% of the source) filling the frame, rather than the zoomed-in slice a
  // full-bleed cover crop would give on a portrait screen.
  // order-first puts it above the copy: the copy stack alone is taller than a
  // short phone viewport, so below the button the photo never got seen.
  "hero-photo-m": "relative mb-9 hidden aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-2xl bg-[#EDF6FC] shadow-[0_18px_40px_rgba(11,31,51,.10)] max-[900px]:order-first max-[900px]:block",
  "hero-title": "text-[clamp(1.75rem,3.5vw,3.75rem)] font-extrabold leading-[1.14] tracking-[-0.02em]",
  "hero-title-lead": "block text-ink",
  "hero-title-rest": "block bg-[linear-gradient(180deg,rgb(var(--marine)),rgb(var(--aqua)))] bg-clip-text text-transparent",
  "hero-rule": "mt-7 block h-[3px] w-[74px] rounded-full bg-aqua max-[900px]:mx-auto max-[900px]:mt-6",
  // ink/75 rather than the muted token: over the hero photo's pale water the
  // muted grey only reaches 4.2:1, short of AA for body text. below 900px the
  // photo is dropped and the plain muted grey is fine again.
  "hero-sub": "mt-7 max-w-[46ch] text-[clamp(0.98rem,1.15vw,1.12rem)] leading-[1.85] text-ink/75 max-[900px]:mx-auto max-[900px]:mt-5 max-[900px]:text-muted",
  "hero-actions": "mt-9 flex flex-wrap items-center gap-4 max-[900px]:mt-7 max-[900px]:justify-center",

  aq: "text-aqua",
  btn: "relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full border border-transparent px-[1.6rem] py-[0.95rem] text-sm font-semibold transition duration-300 ease-[cubic-bezier(.2,.7,.2,1)] before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:content-[''] before:transition-transform before:duration-[450ms] before:ease-[cubic-bezier(.2,.7,.2,1)] hover:before:translate-y-0 [&>svg]:h-4 [&>svg]:w-4",
  "btn-primary": "bg-aqua text-white before:bg-gradient-to-b before:from-marine before:to-deep",
  "btn-light": "bg-white text-ink before:bg-gradient-to-b before:from-splash before:to-aqua hover:text-white",

  stats:
    "relative overflow-hidden bg-[linear-gradient(115deg,rgb(var(--deep))_0%,#0f4485_45%,#0b4d97_100%)] text-white",
  // items size to their own content and the leftover width is split evenly, so the
  // gaps between figures read as equal. below 1100px that would cramp, so it falls
  // back to an even grid.
  "stat-grid":
    "flex justify-between gap-x-8 gap-y-10 max-[1100px]:grid max-[1100px]:grid-cols-3 max-[1100px]:gap-x-6 max-[640px]:grid-cols-2 max-[640px]:gap-x-5 max-[640px]:gap-y-7",
  stat: "border-t border-white/20 pt-5",
  num: "text-[clamp(1.65rem,3.1vw,2.35rem)] font-bold leading-none tracking-[-0.015em] tabular-nums",
  plus: "text-splash",
  lbl: "mt-3 font-mono text-[0.68rem] uppercase leading-[1.5] tracking-[0.12em] text-white/65",

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

  tsec: "[&_.section-head]:mb-0 [&_.section-head]:max-w-none [&_h2.title]:uppercase [&_h2.title]:leading-[.95] [&_h2.title]:tracking-[-.02em]",
  thead: "mb-10 flex items-end justify-between gap-8 max-[1000px]:mb-[2.4rem] max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-6",
  tgrid: "grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1",
  tcard: "group relative flex min-h-[250px] flex-col rounded-xl bg-mist p-6 text-left text-ink no-underline transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_42px_rgba(11,31,51,.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua [&>p]:mb-0 [&>p]:text-sm [&>p]:leading-[1.62] [&>p]:text-muted",
  "tcard-top": "relative z-10 mb-6 flex items-center justify-between gap-2",
  stars5: "text-xs leading-none tracking-[0.2em] text-ink",
  tidx: "font-mono text-xs text-muted",
  who: "relative z-10 mt-auto flex items-center gap-3 pt-6 [&_b]:block [&_b]:text-sm [&_b]:text-ink [&_span]:block [&_span]:font-mono [&_span]:text-xs [&_span]:text-muted",
  av: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-aqua to-marine text-sm font-semibold text-white",
  "tcard-media": "overflow-hidden bg-ink after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(11,31,51,.30),rgba(11,31,51,.78))] after:content-[''] [&>img]:absolute [&>img]:inset-0 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&_.stars5]:text-white [&_.tidx]:text-white [&_.who_b]:text-white [&_.who_span]:text-white/80",
  tplay: "absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white transition duration-300 hover:scale-105 hover:bg-splash [&>svg]:ml-0.5 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-current [&>svg]:text-ink",
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

  foot: "relative bg-ink pt-8 pb-8 text-white border-t-2 border-aqua/30 [&_address]:not-italic [&_address]:text-sm [&_address]:leading-7 [&_address]:text-white/70 [&_h5]:mb-3 [&_h5]:font-mono [&_h5]:text-[0.72rem] [&_h5]:uppercase [&_h5]:tracking-[0.14em] [&_h5]:text-white/60 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-2.5 [&_ul]:p-0 [&_ul_a]:text-sm [&_ul_a]:text-white/75 [&_ul_a:hover]:text-white",
  "foot-main": "grid grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-8 py-[clamp(3.5rem,7vw,5rem)] pb-10 max-[1000px]:grid-cols-2 max-[720px]:grid-cols-1",
  fbrand: "mb-3 flex items-center gap-2 font-sans text-[1.4rem] font-semibold",
  flogo: "h-[34px] w-auto",
  ftag: "mb-5 text-base italic text-white",
  tagpill: "mt-3 inline-block rounded-full border border-splash/40 px-3 py-1 text-[0.68rem] tracking-[0.06em] text-splash",
  "foot-bottom": "flex flex-wrap justify-between gap-4 border-t border-white/15 pt-4 text-sm text-white/70 [&_a]:mx-1",
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
      <header className={cn('nav hidden', tw['nav'])} style={{ display: "none" }}>
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
        {/* <section className={cn('intro', tw['intro'])} aria-label={"MRK Tradex"}>
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
        </section> */}
        <section className={cn('hero', tw['hero'])} id={"hero"}>
          <div className={cn('hero-photo', tw['hero-photo'])} aria-hidden={"true"}></div>
          <div className={cn('hero-scrim', tw['hero-scrim'])} aria-hidden={"true"}></div>
          <div className={cn('hero-inner', tw['hero-inner'])}>
            <div className={cn('hero-copy', tw['hero-copy'])}>
              <h1 className={cn('hero-title', tw['hero-title'])}>
                <span className={cn('hero-title-lead', tw['hero-title-lead'])} data-hi={"पानी ही जीवन है,"}>Water is life,</span>
                <span className={cn('hero-title-rest', tw['hero-title-rest'])} data-hi={"और हम आपके जीवन को पानी से भरते हैं।"}>and we fill your life with water.</span>
              </h1>
              <span className={cn('hero-rule', tw['hero-rule'])} aria-hidden={"true"}></span>
              <p className={cn('hero-sub', tw['hero-sub'])} data-hi={"MRK सबमर्सिबल स्टार्टर और पैनल हर उस पंप की रक्षा करते हैं जो भारत तक पानी पहुँचाता है, घर, खेत और उद्योग के लिए, सिंगल-फेज़ और थ्री-फेज़ दोनों में।"}>
                MRK submersible starters and panels protect every pump that brings India its water, for homes, farms and industry, across single-phase and three-phase.
              </p>
              <div className={cn('hero-actions', tw['hero-actions'])}>
                <a className={cn('btn btn-primary', tw['btn'], tw['btn-primary'])} href={SHOP_URL} data-hi={"सभी देखें"}>
                  Explore all
                  <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                    <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                  </svg>
                </a>
              </div>
            </div>

            <div className={cn('hero-photo-m', tw['hero-photo-m'])}>
              <Image
                src={"/images/hero_section.png"}
                alt={"MRK single-phase starters, three-phase panels, digital meters and switchgear"}
                fill
                sizes={"(max-width: 900px) 92vw, 1px"}
                className="object-cover object-left"
              />
            </div>
          </div>
        </section>

        <section className={cn('stats', tw['stats'])}>
          <div
            aria-hidden={"true"}
            className="pointer-events-none absolute -right-32 -top-48 h-[560px] w-[560px] rounded-full bg-[#3aa0e6]/20 blur-[150px]"
          />
          <div className={cn("container", tw.container, "relative z-10 py-[clamp(2.5rem,5vw,4rem)]")}>
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
        {/* flat bg-paper, matching the page: the my-8 margin lets the page
            background show through above and below, so any other tone here —
            including a decorative glow, which overflow-hidden clips dead flat
            at the section edge — reads as a seam. */}
        <section
          id="range"
          className="relative overflow-hidden bg-paper lg:h-[100svh] my-8"
        >
          {/* Main viewport-height wrapper. max-w and px are kept identical to
              the #solutions wrapper in ProductStack so the two sections share a
              left and right edge — change them together. */}
          <div
            className="
              relative z-10 mx-auto flex w-full max-w-[1340px] flex-col
              px-4 pb-10 pt-10
              sm:px-6 sm:py-12
              md:py-14
              lg:h-full lg:min-h-0
              lg:py-7
              xl:py-8
            "
          >
            {/* Heading */}
            <div
              className="
                mb-6
                flex shrink-0 flex-col gap-4
                sm:flex-row sm:items-start sm:justify-between
                md:mb-[clamp(28px,5vh,64px)]
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
                 <h2
                  className="
                    font-mono text-[clamp(1.75rem,4vw,3rem)] font-bold
                    leading-[1.05] uppercase
                    tracking-[0.05em] text-[#1598df]
                  "
                  data-hi={"हमारे लोकप्रिय उत्पाद।"}
                >
                  THE RANGE
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

             
            </div>

            {/* Cards available-height wrapper. Below lg the rail gets a fixed
                height so the cards keep a sane aspect on tall phones/tablets;
                at lg it goes back to filling the leftover viewport height. */}
            <div className="h-[480px] overflow-hidden sm:h-[540px] md:h-[600px] lg:h-auto lg:min-h-0 lg:flex-1">
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
                        `
                        : `
                          border-[#e4ecf4] bg-white
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
              href={SHOP_URL}
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
        <ProductStackSection />
       
         <CurvedVideoReel />
        {/* <DealerParticleSection /> */}
        <section
          className={cn(
            tw['section'],
            "relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F2F8FC_100%)]",
          )}
          id={"why"}
        >
          <div
            aria-hidden={"true"}
            className="pointer-events-none absolute -left-44 top-16 h-[520px] w-[520px] rounded-full bg-[#dceefe]/70 blur-[130px]"
          />
          <div
            aria-hidden={"true"}
            className="pointer-events-none absolute -right-48 bottom-0 h-[560px] w-[560px] rounded-full bg-[#cfe7fb]/60 blur-[150px]"
          />

          <div className={cn("relative z-10 mx-auto w-full max-w-[1440px] px-6")}>
          <div className={cn('section-head', tw['section-head'])}>
            <span className={cn('eyebrow reveal', tw['eyebrow'], tw['reveal'])} data-hi={"MRK मानक"}>The MRK standard</span>
            <h2 className={cn('title reveal d1', tw['title'], tw['reveal'])}>Why India chooses MRK.</h2>
            <p
              className={cn('reveal d2', tw['reveal'], "mt-6 max-w-[52ch] text-[1.02rem] leading-[1.8] text-muted")}
              data-hi={"छह बातें जो हर पैनल में एक जैसी रहती हैं, चाहे हॉर्सपावर कोई भी हो और कीमत कोई भी।"}
            >
              Six things we hold constant, whatever the panel, the horsepower or
              the price.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-8">
            {whyCards.map((card, index) => {
              const Icon = card.icon;
              const isDark = card.tone === "dark";

              return (
                <article
                  key={card.title}
                  className={cn(
                    "reveal",
                    index % 3 === 1 && "d1",
                    index % 3 === 2 && "d2",
                    tw["reveal"],
                    card.span,
                    `group/why relative flex min-h-[228px] overflow-hidden rounded-[1.5rem]
                     p-6 transition duration-300 ease-[cubic-bezier(.2,.7,.2,1)]
                     hover:-translate-y-1.5 sm:p-7`,
                    isDark
                      ? "border border-transparent bg-[linear-gradient(150deg,#1f6fc0_0%,#12315e_100%)] shadow-[0_18px_44px_rgba(11,31,51,.22)] hover:shadow-[0_30px_60px_rgba(11,31,51,.3)]"
                      : "border border-line/60 bg-white shadow-[0_14px_34px_rgba(11,31,51,.06)] hover:shadow-[0_26px_48px_rgba(11,31,51,.12)]",
                  )}
                >
                  {/* Wash + artwork sit behind the copy, never over it. */}
                  <WhyBlob
                    className={cn(
                      "pointer-events-none absolute -right-10 -top-8 h-[260px] w-[260px]",
                      isDark ? "text-white/[0.06]" : "text-[#e5edfb]",
                    )}
                  />

                  {isDark && (
                    <IndiaOutline className="pointer-events-none absolute -right-2 bottom-0 top-0 my-auto h-[86%] w-auto text-white/25" />
                  )}

                  {card.img && (
                    <div className="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-[46%] sm:block">
                      <Image
                        src={card.img}
                        alt={card.alt ?? ""}
                        fill
                        // never wider than half a card, and a card is at most
                        // half the 1440px grid
                        sizes={"(max-width: 1180px) 30vw, 22vw"}
                        className={cn(
                          "p-4 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover/why:scale-[1.04]",
                          card.imgClass,
                        )}
                      />
                    </div>
                  )}

                  <div
                    className={cn(
                      "relative z-10 flex min-w-0 flex-col",
                      card.img ? "sm:max-w-[54%]" : "max-w-full",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-[52px] w-[52px] items-center justify-center rounded-full",
                        isDark
                          ? "border border-white/35 text-white"
                          : "bg-mist text-aqua",
                      )}
                    >
                      <Icon size={24} strokeWidth={1.6} aria-hidden={"true"} />
                    </span>

                    <h3
                      className={cn(
                        "mt-7 text-[1.15rem] font-bold leading-[1.3] tracking-[-0.01em]",
                        isDark ? "text-white" : "text-ink",
                      )}
                      data-hi={card.hiTitle}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 text-[0.9rem] leading-[1.68]",
                        isDark ? "text-white/75" : "text-muted",
                      )}
                      data-hi={card.hiCopy}
                    >
                      {card.copy}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
          </div>
        </section>

         <section className={cn('section container tsec', tw['section'], tw['container'], tw['tsec'])}>
          <div className={cn('thead', tw['thead'])}>
            <div className={cn('section-head', tw['section-head'])}>
              <span className={cn('eyebrow reveal', tw['eyebrow'], tw['reveal'])} data-hi={"ग्राहकों की ज़ुबानी"}>TESTIMONIALS</span>
              <h2 className={cn('title reveal d1', tw['title'], tw['reveal'])}>What our customers say about us</h2>
            </div>
          </div>
          <div className={cn('tgrid', tw['tgrid'])}>
            {googleReviews.map((review, index) => (
              <a
                className={cn("tcard", tw.tcard)}
                href={GOOGLE_LISTING_URL}
                key={`review-${index}`}
                rel={"noopener noreferrer"}
                target={"_blank"}
              >
                <div className={cn('tcard-top', tw['tcard-top'])}>
                  <ReviewStars rating={review.rating} />
                  <span className={cn('tidx', tw['tidx'])}>Google</span>
                </div>
                <p>&ldquo;{review.quote}&rdquo;</p>
                <div className={cn('who', tw['who'])}>
                  <div className={cn('av', tw['av'])}>
                    {review.name ? review.name.trim().charAt(0).toUpperCase() : "G"}
                  </div>
                  <div>
                    <b>{review.name || "Google review"}</b>
                    <span>Posted on Google Maps</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {googleReviewLinks.map((item, index) => (
              <a
                className="inline-flex items-center gap-2 rounded-full bg-aqua px-5 py-3 text-sm font-semibold text-white transition hover:bg-marine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua"
                href={item.href}
                key={`${item.href}-${index}`}
                rel={"noopener noreferrer"}
                target={"_blank"}
              >
                {item.label}
                <svg viewBox={"0 0 24 24"} aria-hidden={"true"} className="h-4 w-4 fill-none stroke-current stroke-2">
                  <path d={"M5 12h14M13 6l6 6-6 6"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                </svg>
              </a>
            ))}
          </div>
        </section>

        <DealerCtaSection />

        {/* ── Curved Product Reel ── */}

        <FaqAccordion />

      </main>
      <SiteFooter />
    </div>
  );
}
