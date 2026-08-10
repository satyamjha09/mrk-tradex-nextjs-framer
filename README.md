# MRK Tradex Homepage — Next.js + Tailwind CSS + Framer Motion

This project contains the MRK Tradex homepage in the Next.js App Router. The complete visual styling has been moved from regular CSS selectors into Tailwind utility classes while retaining the sections, responsive layout, animations, product artwork, and interactions.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main files

- `app/page.tsx` — homepage route
- `components/MrkHome.tsx` — React/JSX homepage, Tailwind utility classes, and Framer Motion interactions
- `tailwind.config.ts` — brand colors, font families, and custom keyframe animations
- `app/globals.css` — only the three Tailwind directives
- `public/images` — logo and product images

## Included interactions

- sticky “MRK TRADEX” scroll-mask intro
- scroll-triggered section reveals
- animated number counters
- fixed navigation scroll state
- responsive mobile navigation
- hover/tap flip cards
- English/Hindi demo toggle
- water-blue/amber preview switcher
- wave, bubble, slider, and liquid-button effects

## Production placeholders still present

Replace the placeholder testimonial copy, GST number, catalog/price-list links, WhatsApp URL, YouTube URL, and any `#` links before launch.





