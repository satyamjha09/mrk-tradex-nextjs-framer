"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Eye,
  X,
} from "lucide-react";
import gsap from "gsap";

// ─── Types ────────────────────────────────────────────────────────────────────

type LayoutMode = "arc" | "cylinder" | "perspective" | "ribbon";

// px of horizontal travel past which a pointer gesture counts as a drag, not a tap
const DRAG_CLICK_SLOP = 6;

interface CurvedReelConfig {
  arcDepth: number;
  speed: number;
  layoutMode: LayoutMode;
  autoPlay: boolean;
  soundEnabled: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;        // empty string if no video — falls back to poster
  // youtube shorts id. present = the card is clickable and opens the player
  // modal. the iframe is only mounted once the modal opens, so youtube's
  // player script never loads for visitors who don't watch anything.
  youtubeId?: string;
  // shorts are 9/16, ordinary uploads are 16/9. the modal sizes itself from this,
  // so a landscape video is not pillarboxed inside a portrait frame.
  aspect?: "9/16" | "16/9";
  posterUrl: string;
  category: string;
  views: string;
  creatorName: string;
  creatorAvatar: string;
  conversionBoost: string;
  duration: string;
}

// ─── MRK Product Data as VideoItems ──────────────────────────────────────────

const MRK_VIDEOS: VideoItem[] = [
  {
    id: "ahd-series",
    title: "AHD Series Single-Phase Starter",
    videoUrl: "",
    youtubeId: "Um2M55FT0ws", // "MOTORGUARD single-phase starters with overload trip"
    aspect: "16/9",
    posterUrl: "/images/MRK WEBSITE/I Phase Starters/AHD Series/ahd24E.png",
    category: "1-Phase",
    views: "1-Phase",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "0.5–5 HP",
    duration: "Starter",
  },
  {
    id: "mrk-iii-phase",
    title: "MRK III Phase Control Panel",
    videoUrl: "",
    youtubeId: "q40lKRqwOBs", // "MRK III PHASE PANEL TESTING in single-phase supply"
    aspect: "9/16",
    posterUrl: "/images/MRK WEBSITE/III Phase Panels/MRK III Phase.png",
    category: "3-Phase",
    views: "3-Phase",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "5–30 HP",
    duration: "Panel",
  },
  {
    id: "mrg-auto-timer",
    title: "MRG Auto-Timer Panel",
    videoUrl: "",
    youtubeId: "NzPfdG1fqsw", // "MRK MOTOR GUARD — first submersible starter with stop timer"
    aspect: "9/16",
    posterUrl: "/images/MRK WEBSITE/SLider MRG Auto Timer/21.png",
    category: "Smart",
    views: "Auto-Stop",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "0–99 min",
    duration: "Smart",
  },
  {
    id: "mhd-series",
    title: "MHD Series Digital Starter",
    videoUrl: "",
    youtubeId: "C8XATCVnJQc", // "Motor Guard single-phase starter with timer facility"
    aspect: "16/9",
    posterUrl: "/images/MRK WEBSITE/I Phase Starters/MHD Series/MHD34B.jpg",
    category: "1-Phase",
    views: "Digital",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "Up to 3 HP",
    duration: "Starter",
  },
  {
    id: "mrd-series",
    title: "MRD Economy Starter",
    videoUrl: "",
    youtubeId: "wSYPU52jCho", // "MRK new ABS BOX" — enclosure, best guess of product match
    aspect: "9/16",
    posterUrl: "/images/MRK WEBSITE/I Phase Starters/MRD Series/52.jpg",
    category: "1-Phase",
    views: "Economy",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "0.5–2 HP",
    duration: "Starter",
  },
  {
    id: "wlc-smart-plug",
    title: "WLC Smart Water-Level Plug",
    videoUrl: "",
    youtubeId: "9h9agAJ09MU", // "ABOUT MRK WLC PLUG"
    aspect: "9/16",
    posterUrl: "/images/MRK WEBSITE/WLC Smart Plug/DOC-20260802-WA0063_.jpg",
    category: "Smart",
    views: "Wi-Fi",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "Tullu + Sub",
    duration: "Controller",
  },
  {
    id: "mrx-hd",
    title: "MRX-HD Full-Digital 3-Phase",
    videoUrl: "",
    youtubeId: "7kwwUu-61dw", // "MRX HD III PHASE DIGITAL STARTER ER3"
    aspect: "16/9",
    posterUrl: "/images/MRK WEBSITE/Slider MRX HD/DOC-20260802-WA0062_.jpg",
    category: "3-Phase",
    views: "Full-Digital",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "Live V & A",
    duration: "Panel",
  },
  {
    id: "intro-range",
    title: "Complete MRK Product Range",
    videoUrl: "",
    youtubeId: "zAuqVOgM4D0", // "MRK MOTORGUARD || Know All About It"
    aspect: "16/9",
    posterUrl: "/images/intro1.png",
    category: "Range",
    views: "2005–Now",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "1 & 3 Phase",
    duration: "Full Range",
  },

  // video-led cards: these exist so every uploaded video is reachable, rather
  // than being stranded because its product card already had one. posters come
  // from youtube's own thumbnail, so there is nothing to add to /public.
  {
    id: "wlc-install-guide",
    title: "How to Install a WLC Starter",
    videoUrl: "",
    youtubeId: "Evt7_ZBd0O4", // "How to install & run a MRK WLC motor starter"
    aspect: "16/9",
    posterUrl: "https://i.ytimg.com/vi/Evt7_ZBd0O4/hqdefault.jpg",
    category: "Guide",
    views: "How-To",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "Step by step",
    duration: "Install",
  },
  {
    id: "mrx-hd-er6",
    title: "MRX-HD ER6 Digital Starter",
    videoUrl: "",
    youtubeId: "0gEPe_3An14", // "MRX HD III PHASE DIGITAL STARTER ER6"
    aspect: "16/9",
    posterUrl: "https://i.ytimg.com/vi/0gEPe_3An14/hqdefault.jpg",
    category: "3-Phase",
    views: "ER6",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "Full-Digital",
    duration: "Starter",
  },
  {
    id: "abs-box",
    title: "MRK ABS Enclosure",
    videoUrl: "",
    youtubeId: "AZBbjWrDF5k", // "MRK ABS BOX"
    aspect: "9/16",
    posterUrl: "https://i.ytimg.com/vi/AZBbjWrDF5k/hqdefault.jpg",
    category: "Build",
    views: "ABS Box",
    creatorName: "MRK Tradex",
    creatorAvatar: "/images/mrk-logo.png",
    conversionBoost: "Weatherproof",
    duration: "Enclosure",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const CurvedVideoReel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // fixed since the on-screen controls were removed — nothing mutates this now
  const [config] = useState<CurvedReelConfig>({
    arcDepth: 55,
    speed: 1.2,
    layoutMode: "cylinder",
    autoPlay: true,
    soundEnabled: false,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Triplicate for seamless infinite loop
  const duplicatedVideos = [
    ...MRK_VIDEOS,
    ...MRK_VIDEOS,
    ...MRK_VIDEOS,
  ];

  // the reel is positioned by hand in px, so the card box has to be a number the
  // transform maths and the DOM agree on. it is picked per breakpoint rather than
  // via CSS, and `arcScale` flattens the 3D curve on narrow viewports where a
  // card only a slot or two from centre would otherwise be rotated edge-on.
  const [metrics, setMetrics] = useState({
    cardWidth: 230,
    cardGap: 20,
    arcScale: 1,
  });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setMetrics({ cardWidth: 150, cardGap: 14, arcScale: 0.5 });
      } else if (width < 1024) {
        setMetrics({ cardWidth: 190, cardGap: 18, arcScale: 0.75 });
      } else {
        setMetrics({ cardWidth: 230, cardGap: 20, arcScale: 1 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scrollOffsetRef = useRef(0);
  const { cardWidth, cardGap, arcScale } = metrics;
  // the card art is 230x340 at full size; keep that ratio at every width
  const cardHeight = Math.round(cardWidth * (340 / 230));
  const totalItemWidth = cardWidth + cardGap;
  const singleLoopWidth = totalItemWidth * MRK_VIDEOS.length;
  // top inset + card + the arc's vertical travel, so the track is never clipped
  const stageHeight = Math.round(
    24 + cardHeight + config.arcDepth * 0.8 * arcScale + 24,
  );

  const dragStartRef = useRef(0);
  const dragScrollStartRef = useRef(0);
  const dragMovedRef = useRef(false);
  const isDraggingRef = useRef(false);

  // ── GSAP Ticker: exact 3D transform math from reference ──────────────────
  useEffect(() => {
    const tickerCallback = () => {
      if (!isDragging) {
        if (config.autoPlay && !isHovered) {
          scrollOffsetRef.current += config.speed;
        }
        if (scrollOffsetRef.current >= singleLoopWidth) {
          scrollOffsetRef.current %= singleLoopWidth;
        } else if (scrollOffsetRef.current < 0) {
          scrollOffsetRef.current =
            singleLoopWidth + (scrollOffsetRef.current % singleLoopWidth);
        }
      }

      if (trackRef.current && containerRef.current) {
        const containerWidth =
          containerRef.current.offsetWidth || window.innerWidth;
        const centerX = containerWidth / 2;
        const cards = trackRef.current.children;

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i] as HTMLElement;

          const itemBaseX = i * totalItemWidth - scrollOffsetRef.current;
          const cardCenterX = itemBaseX + cardWidth / 2;
          const distFromCenter = cardCenterX - centerX;
          const normalizedDist = distFromCenter / (containerWidth / 2);

          let translateY = 0;
          let rotateZ = 0;
          let rotateY = 0;
          let scale = 1;

          if (config.layoutMode === "arc") {
            // ── Inner Concave Bowl Arc with deep 3D rotation & depth movement ──
            const absDist = Math.abs(normalizedDist);
            const clampedDist = Math.min(absDist, 1.5);

            // Y: center cards bow down (+arcDepth), outer cards stay high
            translateY = (1 - Math.pow(clampedDist, 2)) * config.arcDepth;

            // Z depth: center comes forward, edges recede
            const translateZ =
              (1 - Math.pow(clampedDist, 2)) * 30 -
              Math.pow(clampedDist, 1.8) * 110;

            // Y rotation: left cards face right, right cards face left
            rotateY = -normalizedDist * 22;

            // Z tilt along arc
            rotateZ = -normalizedDist * 5.5;

            // Subtle scale bump at center
            scale = 0.96 + (1 - Math.min(absDist, 1)) * 0.08;

            card.style.transform = `translate3d(${itemBaseX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
          } else if (config.layoutMode === "cylinder") {
            // ── Full 3D Cylinder Reel ──
            const absDist = Math.abs(normalizedDist);
            translateY =
              (1 - Math.pow(Math.min(absDist, 1.4), 2)) *
              (config.arcDepth * 0.8 * arcScale);
            const translateZ = -Math.pow(absDist, 2) * 140 * arcScale;
            rotateY = -normalizedDist * 30 * arcScale;
            rotateZ = -normalizedDist * 4 * arcScale;
            card.style.transform = `translate3d(${itemBaseX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
          } else if (config.layoutMode === "perspective") {
            // ── Parabolic Wave ──
            translateY =
              Math.sin(normalizedDist * Math.PI) * (config.arcDepth * 0.9);
            const translateZ = Math.cos(normalizedDist * Math.PI) * 60;
            rotateZ = -normalizedDist * 6;
            rotateY = -normalizedDist * 15;
            card.style.transform = `translate3d(${itemBaseX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
          } else {
            // ── Flat Ribbon ──
            card.style.transform = `translate3d(${itemBaseX}px, 0px, 0px) scale(${scale})`;
          }
        }
      }
    };

    gsap.ticker.add(tickerCallback);
    return () => gsap.ticker.remove(tickerCallback);
  }, [
    config,
    isDragging,
    isHovered,
    singleLoopWidth,
    totalItemWidth,
    cardWidth,
    arcScale,
  ]);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  // isDragging is mirrored into a ref because the move handlers read it in the
  // same tick the press sets it. reading the state there loses the first moves
  // of every gesture, which made a real drag read as a tap now and then.
  const beginDrag = (clientX: number) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragMovedRef.current = false;
    dragStartRef.current = clientX;
    dragScrollStartRef.current = scrollOffsetRef.current;
  };
  const moveDrag = (clientX: number) => {
    if (!isDraggingRef.current) return;
    if (Math.abs(clientX - dragStartRef.current) > DRAG_CLICK_SLOP) {
      dragMovedRef.current = true;
    }
    scrollOffsetRef.current =
      dragScrollStartRef.current - (clientX - dragStartRef.current);
  };

  const handleMouseDown = (e: React.MouseEvent) => beginDrag(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => moveDrag(e.clientX);
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) =>
    beginDrag(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    moveDrag(e.touches[0].clientX);

  // a drag that ends on a card must not be read as a click on it
  const handleCardClick = (video: VideoItem) => {
    if (dragMovedRef.current || !video.youtubeId) return;
    setActiveVideo(video);
  };

  // escape closes the player, and the page must not scroll behind it
  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeVideo]);

  return (
    <section
      id="product-reel"
      className="relative overflow-hidden bg-white text-ink py-12 sm:py-16 lg:py-20"
    >
      {/* ── Section Header ── */}
      {/* one margin scale, not three: mb-8 / sm:mb-10 / mb-12 were all set here
          and fought each other, leaving less gap at sm+ than below it. */}
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-6 mb-14 sm:mb-20 lg:mb-24">
        <span className="mb-4 inline-block font-mono text-[1rem] uppercase tracking-[0.22em] text-marine font-semibold">
          In Service Since 2005
        </span>
        
       <h2 className="
            mb-10
            text-[clamp(1.9rem,3.5vw,2.9rem)]
            font-extrabold
            leading-[1]
            tracking-[0.08em]
            text-ink
          ">
            SEE THE ACTION{" "}
            <span className="text-aqua">LIVE</span>
          </h2>
        
      </div>

      {/* ── Curved Reel Track Wrapper ── */}
      <div className="relative my-4 mx-auto w-full max-w-[1680px] overflow-hidden px-2 sm:my-6 sm:px-8 ">
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsDragging(false);
            setHoveredCardId(null);
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          // pan-y keeps a vertical swipe scrolling the page while a horizontal
          // one drags the reel
          style={{ height: stageHeight, touchAction: "pan-y" }}
          className="relative w-full cursor-grab select-none overflow-hidden active:cursor-grabbing"
        >
          {/* 1680px Ocean Blue Edge Fade & Blur Overlay (Left & Right) */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 sm:w-24 md:w-36 lg:w-52 backdrop-blur-[5px]"
            style={{
              background:
                "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.92) 45%, rgba(255,255,255,0.3) 80%, transparent 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 sm:w-24 md:w-36 lg:w-52 backdrop-blur-[5px]"
            style={{
              background:
                "linear-gradient(to left, #ffffff 0%, rgba(255,255,255,0.92) 45%, rgba(255,255,255,0.3) 80%, transparent 100%)",
            }}
          />

          {/* ── Dynamic Card Container — 3D perspective + preserve-3d ── */}
          <div
            ref={trackRef}
            // pointer-events-none is load-bearing: this is a preserve-3d parent,
            // and the arc gives most cards a negative translateZ, putting them
            // behind this element's own plane. as a hit target it would swallow
            // every hover and click except the one card at dead centre.
            className="absolute left-0 top-6 w-full h-full pointer-events-none"
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            {duplicatedVideos.map((video, idx) => {
              const cardUniqueKey = `${video.id}-${idx}`;
              const isHoveredCard = hoveredCardId === cardUniqueKey;

              return (
                <div
                  key={cardUniqueKey}
                  onMouseEnter={() => setHoveredCardId(cardUniqueKey)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  // pointerup, not click: the reel can shift between press and
                  // release, and a `click` only fires if both landed on the same
                  // element — which silently swallowed taps on a moving card.
                  onPointerUp={() => handleCardClick(video)}
                  role={video.youtubeId ? "button" : undefined}
                  tabIndex={video.youtubeId ? 0 : undefined}
                  aria-label={video.youtubeId ? `Play ${video.title}` : undefined}
                  onKeyDown={(e) => {
                    if (!video.youtubeId) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveVideo(video);
                    }
                  }}
                  className={`pointer-events-auto group absolute left-0 top-0 transform-gpu overflow-hidden rounded-[18px] border border-white/20 bg-black transition-shadow duration-300 sm:rounded-[24px] ${
                    video.youtubeId ? "cursor-pointer" : "cursor-grab"
                  }`}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    boxShadow: isHoveredCard
                      ? "0 24px 60px rgba(10,60,110,0.28), 0 8px 20px rgba(10,60,110,0.18)"
                      : "0 8px 32px rgba(10,60,110,0.15)",
                  }}
                >
                  {/* Product image (falls back gracefully if no video) */}
                  {video.videoUrl ? (
                    <video
                      src={video.videoUrl}
                      poster={video.posterUrl}
                      autoPlay
                      loop
                      muted={!config.soundEnabled || !isHoveredCard}
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={video.posterUrl}
                      alt={video.title}
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{
                        transform: isHoveredCard ? "scale(1.06)" : "scale(1)",
                      }}
                    />
                  )}

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Top: category + views/badge */}
                  <div className="absolute left-2 right-2 top-2 z-10 flex items-center justify-between gap-1 text-xs text-white sm:left-3 sm:right-3 sm:top-3">
                    <span className="truncate rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px]">
                      {video.category}
                    </span>
                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md sm:px-2 sm:py-1 sm:text-[11px]">
                      <Eye className="h-3 w-3" />
                      <span>{video.views}</span>
                    </div>
                  </div>

                  {/* Center play button — only on cards that actually have a video.
                      a real button so there is one unambiguous hit target even
                      where neighbouring cards overlap this one. on touch there is
                      no hover to reveal it, so it stays put. */}
                  {video.youtubeId && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                      <button
                        type="button"
                        aria-label={`Play ${video.title}`}
                        onPointerUp={(e) => {
                          e.stopPropagation();
                          handleCardClick(video);
                        }}
                        className="flex h-10 w-10 scale-75 transform cursor-pointer items-center justify-center rounded-full bg-[rgb(30,155,224)] text-white shadow-lg transition-transform duration-300 group-hover:scale-100 sm:h-12 sm:w-12 [@media(hover:none)]:scale-100"
                      >
                        <Play className="ml-0.5 h-4 w-4 fill-white sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  )}

                  {/* Bottom card info */}
                  <div className="absolute bottom-2 left-2 right-2 z-10 text-white sm:bottom-3 sm:left-3 sm:right-3">
                    <div className="mb-1 flex items-center gap-1.5 sm:mb-1.5 sm:gap-2">
                      <img
                        src={video.creatorAvatar}
                        alt={video.creatorName}
                        className="h-5 w-5 shrink-0 rounded-full border border-white/60 bg-white object-cover sm:h-6 sm:w-6"
                      />
                      <span className="truncate text-[10px] font-bold text-white/95 sm:text-xs">
                        {video.creatorName}
                      </span>
                    </div>
                    <h4 className="line-clamp-2 text-[12px] font-extrabold leading-snug text-white sm:text-sm">
                      {video.title}
                    </h4>
                    <div className="mt-1.5 flex items-center justify-between gap-1 text-[9px] font-bold text-emerald-400 sm:mt-2 sm:text-[11px]">
                      <span className="truncate rounded border border-emerald-500/30 bg-emerald-500/20 px-1.5 py-0.5 sm:px-2">
                        {video.conversionBoost}
                      </span>
                      <span className="shrink-0 text-white/80">{video.duration}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Player Modal — iframe mounts only while open ── */}
      {activeVideo?.youtubeId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-4"
        >
          {/* the close button and caption are in flow, not offset above the
              frame, so the dialog cannot run off a short or landscape screen */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-full flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              className="mb-2 flex items-center gap-1.5 self-end rounded-full bg-white/10 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-white/20"
            >
              <X className="h-4 w-4" />
              Close
            </button>

            {/* width is capped by the viewport's height too, so the frame keeps
                its true ratio instead of being squashed by a max-height */}
            <div
              className={`relative overflow-hidden rounded-2xl bg-black shadow-2xl ${
                activeVideo.aspect === "16/9"
                  ? "aspect-video w-[min(1000px,92vw,calc(68vh_*_16_/_9))]"
                  : "aspect-[9/16] w-[min(400px,86vw,calc(68vh_*_9_/_16))]"
              }`}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>

            <p className="mt-3 text-center text-sm font-semibold text-white">
              {activeVideo.title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default CurvedVideoReel;
