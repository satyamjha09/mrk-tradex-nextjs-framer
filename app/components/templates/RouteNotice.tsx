// @ts-nocheck
import Link from "next/link";
import MainLayout from "./MainLayout";

type Action = {
  href: string;
  label: string;
  primary?: boolean;
};

export default function RouteNotice({
  eyebrow,
  title,
  description,
  actions = [
    { href: "/shop", label: "Browse catalog", primary: true },
    { href: "/contact", label: "Contact MRK" },
  ],
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: Action[];
}) {
  return (
    <MainLayout>
      <section className="min-h-[68vh] bg-[#f4f8fc] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {eyebrow && (
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.28em] text-[#1598df]">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-[#071d33] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#60758a] sm:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={
                  action.primary
                    ? "rounded-full bg-[#1598df] px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(21,152,223,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0d78b6]"
                    : "rounded-full border border-[#c9d9e7] bg-white px-6 py-3 text-sm font-bold text-[#0d559b] transition hover:border-[#1598df] hover:text-[#1598df]"
                }
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
