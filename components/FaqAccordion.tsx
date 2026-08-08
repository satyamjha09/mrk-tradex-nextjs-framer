"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type FaqItem = {
  no: string;
  question: string;
  points: string[];
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    no: "01",
    question: "Choosing a starter",
    points: ["Pump rating", "Phase & supply", "Panel type"],
    answer:
      "Match the starter to your pump's horsepower and to the supply at your site. Up to 7.5 HP on a single-phase line, a single-phase starter is enough; for three-phase supply or larger pumps, use a DOL or Star-Delta panel. Your dealer can confirm the right model from your pump's nameplate.",
  },
  {
    no: "02",
    question: "Dry-run protection",
    points: ["Level sensing", "Auto cut-off", "Auto restart"],
    answer:
      "When the borewell runs dry the motor keeps spinning with no water to cool it, and that is what burns a pump out. MRK starters sense the loss and cut the supply before damage is done, then restore it automatically once water returns.",
  },
  {
    no: "03",
    question: "Installation",
    points: ["Labelled terminals", "Wiring diagram", "Wall mounting"],
    answer:
      "Every unit ships with a wiring diagram in the box and clearly labelled terminals, with enough cable room to work comfortably. Most installations take a few minutes for an electrician: mount the unit, land the cables, set the rating, power on.",
  },
  {
    no: "04",
    question: "Warranty & service",
    points: ["Coverage", "Dealer network", "Spare parts"],
    answer:
      "Every unit is bench-tested under load before it leaves the floor. Service, spares and replacements are handled through your dealer, and with 1000+ dealers across 500+ cities and towns there is likely one close to you.",
  },
  {
    no: "05",
    question: "Becoming a dealer",
    points: ["Territory", "Margins", "Field support"],
    answer:
      "We have been building starters and panels since 2005 and work with dealers across 20+ states. Get in touch and we will talk through territory, pricing and the support we provide on the ground.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reducedMotion = useReducedMotion();

  return (
    <section id="faq" className="bg-[#f4f5f6] py-[clamp(4rem,8vw,7rem)]">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <span className="mb-10 inline-block font-mono text-[0.7rem] uppercase tracking-[0.24em] text-marine">
          Common questions
        </span>

        <div className="border-t border-[#d8dade]">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.no} className="border-b border-[#d8dade]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.no}`}
                    className="group flex w-full items-center gap-5 py-[clamp(1.1rem,2.2vw,1.6rem)] text-left sm:gap-8"
                  >
                    <span className="w-6 shrink-0 font-mono text-[11px] font-semibold tabular-nums text-ink/70">
                      {item.no}
                    </span>

                    <span className="flex-1 text-[clamp(1.35rem,3.4vw,2.5rem)] font-medium uppercase leading-[1.1] tracking-[-0.015em] text-ink transition-colors group-hover:text-aqua">
                      {item.question}
                    </span>

                    {/* plus that loses its vertical stroke when open */}
                    <span
                      aria-hidden="true"
                      className="relative h-5 w-5 shrink-0 text-ink"
                    >
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 bg-current" />
                      <span
                        className={`absolute left-1/2 top-0 h-5 w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300 ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${item.no}`}
                      initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-4 pb-[clamp(1.4rem,2.6vw,2rem)] pl-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] sm:gap-10 sm:pl-[3.25rem]">
                        <ul className="flex flex-col gap-2">
                          {item.points.map((point) => (
                            <li key={point} className="text-[15px] text-ink">
                              {point}
                            </li>
                          ))}
                        </ul>

                        <p className="max-w-[62ch] text-[15px] leading-[1.65] text-muted">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
