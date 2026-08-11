"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

type FaqItem = {
  no: string;
  question: string;
  points: string[];
  // ReactNode rather than string: several answers carry emphasis or run to a
  // second paragraph.
  answer: ReactNode;
};

const FAQS: FaqItem[] = [
  {
    no: "01",
    question: "What are the main products of MRK?",
    points: ["Starter panels", "WLC Smart Plugs", "Cables"],
    answer: (
      <>
        MRK manufactures{" "}
        <strong className="font-semibold text-ink">
          submersible starter panels, WLC Smart Plugs, submersible support
          cables, and power cables.
        </strong>
      </>
    ),
  },
  {
    no: "02",
    question: "What is a WLC device?",
    points: ["Water Level Controller", "Overflow cut-off"],
    answer: (
      <>
        A{" "}
        <strong className="font-semibold text-ink">
          WLC (Water Level Controller)
        </strong>{" "}
        is an electrical device used to stop water from overflowing from an
        overhead tank.
      </>
    ),
  },
  {
    no: "03",
    question: "Is any other company providing the same services?",
    points: ["Market position"],
    answer: "No.",
  },
  {
    no: "04",
    question: "What is the difference between a Franchisee and a Distributor?",
    points: ["Distributor", "Franchisee", "Service scope"],
    answer: (
      <>
        <span className="block">
          A <strong className="font-semibold text-ink">Distributor</strong> is a
          regular stockist of MRK who keeps our range of starter panels for
          local distribution.
        </span>
        <span className="mt-4 block">
          A <strong className="font-semibold text-ink">Franchisee</strong> works
          in a selected area within a town or city. Along with selling our
          products, the franchisee also provides{" "}
          <strong className="font-semibold text-ink">
            new installation and repair services for existing installations on a
            chargeable basis.
          </strong>
        </span>
      </>
    ),
  },
  {
    no: "05",
    question: "What is the process of becoming a Dealer or Franchisee?",
    points: ["Scan the QR code", "10 working days", "Registration"],
    answer: (
      <>
        Scan the{" "}
        <strong className="font-semibold text-ink">respective QR code</strong>{" "}
        for the offer you are interested in. Our company will contact you within
        the next{" "}
        <strong className="font-semibold text-ink">10 working days</strong>.
        After that, the applicant can complete the registration process and
        start transactions with MRK.
      </>
    ),
  },
  {
    no: "06",
    question: "What warranty is offered on the WLC Smart Plug?",
    points: ["Free replacement", "7 days from sale", "Manufacturing defect"],
    answer: (
      <>
        MRK provides a{" "}
        <strong className="font-semibold text-ink">
          free replacement within 7 days from the date of sale
        </strong>{" "}
        if there is any manufacturing defect in the device.
      </>
    ),
  },
  {
    no: "07",
    question: "What should I do if the device stops working after a few days?",
    points: ["Scan the QR code", "YouTube walkthrough", "Live video support"],
    answer: (
      <>
        <span className="block">
          You can scan the{" "}
          <strong className="font-semibold text-ink">QR code</strong> to watch
          the relevant YouTube video for troubleshooting and rectification.
        </span>
        <span className="mt-4 block">
          You can also contact our{" "}
          <strong className="font-semibold text-ink">
            customer support executive
          </strong>{" "}
          and show the complaint through a{" "}
          <strong className="font-semibold text-ink">live video</strong> for
          assistance.
        </span>
      </>
    ),
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
