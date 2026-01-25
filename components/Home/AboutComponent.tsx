"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  PAPER,
  headingFont,
  bodyFont,
  Tape,
  CardTree,
  DoodleLine,
  PaperBase,
  Vignette,
} from "@/components/PaperComponents";

const InkTag = ({ text, dot }: { text: string; dot: string }) => (
  <motion.span
    whileHover={{ y: -2, scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold select-none"
    style={{
      background: PAPER.lightAccent,
      border: `2px solid ${PAPER.ink}`,
      boxShadow: `3px 3px 0 ${PAPER.shadow}`,
      color: PAPER.ink,
      fontFamily: bodyFont,
    }}
  >
    <span
      className="inline-block w-2 h-2 rounded-full mr-2"
      style={{
        background: dot,
        border: `1.5px solid ${PAPER.ink}`,
      }}
    />
    {text}
  </motion.span>
);

// Updated PaperPanel to match Hero section style (simple border, no torn corner)
const PaperPanel = ({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) => (
  <motion.div
    whileHover={
      hover
        ? {
            scale: 1.02,
            rotateZ: 1,
            boxShadow: `12px 12px 0 ${PAPER.shadow}`,
          }
        : undefined
    }
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={cn("relative p-6 sm:p-8 rounded-2xl", className)}
    style={{
      background: `${PAPER.bg} url("/textures/paper.png")`,
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `8px 8px 0 ${PAPER.shadow}`,
    }}
  >
    <Tape className="-top-4 sm:-top-5 left-6 sm:left-8" rotate={-3} />
    <Tape className="-top-4 sm:-top-5 right-6 sm:right-8" rotate={3} />
    <CardTree className="bottom-2 left-2" side="left" size={50} />
    <CardTree className="bottom-2 right-2" side="right" size={50} />
    {children}
  </motion.div>
);

// Updated PaperButton to match Hero section style (simple border)
const PaperButton = ({
  children,
  href,
  onClick,
  tint = "rgba(121,166,119,0.3)",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  tint?: string;
}) => {
  const btn = (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      className="px-3 sm:px-4 py-2 rounded-xl font-bold inline-flex justify-center items-center w-full sm:w-auto whitespace-nowrap"
      style={{
        fontFamily: bodyFont,
        background: tint,
        color: PAPER.ink,
        border: `2px solid ${PAPER.ink}`,
        boxShadow: `3px 3px 0 ${PAPER.shadow}`,
      }}
    >
      {children}
    </motion.button>
  );

  if (href) return <Link href={href}>{btn}</Link>;
  return btn;
};

type PolaroidConfig = {
  src: string;
  alt: string;
  desktop: React.CSSProperties; // only position props (left/right/top/bottom)
  mobile: React.CSSProperties; // only position props
  mobileScale: number;
};

const POLAROIDS: PolaroidConfig[] = [
  {
    src: "/assets/gallery-hackathon/hackathon1.jpg",
    alt: "polaroid-1",
    desktop: { left: "4%", top: "14%" },
    mobile: { left: "3%", top: "16%" },
    mobileScale: 0.68,
  },
  {
    src: "/assets/gallery-assets/texus-2k23/texus-2k23 (25).jpg",
    alt: "polaroid-2",
    desktop: { right: "4%", top: "16%" },
    mobile: { right: "3%", bottom: "10%" },
    mobileScale: 0.68,
  },
  {
    src: "/assets/gallery-assets/texus25-gala-remastered/gala-6.jpg",
    alt: "polaroid-3",
    desktop: { left: "10%", bottom: "10%" },
    mobile: { left: "3%", bottom: "8%" },
    mobileScale: 0.64,
  },
  {
    src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (8).jpeg",
    alt: "polaroid-4",
    desktop: { right: "10%", bottom: "8%" },
    mobile: { right: "3%", top: "34%" },
    mobileScale: 0.64,
  },
];

function seededNumber(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function useStableTilts(count: number) {
  return useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const r = seededNumber(i + 1);
      const angle = (r * 20 - 10) || 4; // -10..+10
      return { angle };
    });
  }, [count]);
}

const Polaroid = ({
  src,
  alt,
  baseRotate,
  stylePos,
  opacity = 0.45,
  baseScale = 1,
}: {
  src: string;
  alt: string;
  baseRotate: number;
  stylePos: React.CSSProperties;
  opacity?: number;
  baseScale?: number;
}) => {
  return (
    <motion.div
      className="absolute pointer-events-auto"
      style={{
        ...stylePos,
        // keep only positioning in style; Framer controls rotate/scale
      }}
      initial={{ opacity: 0, y: 12, rotate: baseRotate, scale: baseScale }}
      animate={{ opacity: 1, y: 0, rotate: baseRotate, scale: baseScale }}
      transition={{ duration: 0.45 }}
      whileHover={{
        y: -10,
        rotate: baseRotate + 1.5,
        scale: baseScale * 1.02,
      }}
    >
      <Tape className="-top-4 left-6" rotate={-6} />
      <Tape className="-top-4 right-6" rotate={6} />

      <div
        className="relative"
        style={{
          width: "clamp(160px, 18vw, 300px)",
          borderRadius: 22,
          background: PAPER.white,
          border: `4px solid ${PAPER.ink}`,
          boxShadow: `12px 12px 0 ${PAPER.shadow}`,
          overflow: "hidden",
        }}
      >
        <div className="relative w-full" style={{ aspectRatio: "16 / 11" }}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 55vw, 320px"
          />

          <div
            className="absolute inset-0"
            style={{
              background: `rgba(247,244,238,${1 - opacity})`,
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity,
              background:
                "linear-gradient(180deg, rgba(247,244,238,0.12), rgba(247,244,238,0.45))",
            }}
          />
        </div>

        <div
          className="px-4 py-3"
          style={{
            background: PAPER.white,
            borderTop: `3px solid rgba(18,56,89,0.12)`,
            fontFamily: headingFont,
            color: PAPER.ink,
            letterSpacing: "0.04em",
          }}
        >
          <span className="text-xs opacity-80">TEXUS ’26</span>
        </div>
      </div>
    </motion.div>
  );
};

/** SRM Carousel */
const SRM_IMAGES = [
  { src: "/assets/deptpics/5.webp", alt: "SRM Campus 1" },
  { src: "/assets/deptpics/image.png", alt: "SRM Campus 2" },
  { src: "/assets/deptpics/gsl1.webp", alt: "SRM Campus 3" },
];

function ImageCard({
  src,
  alt,
  aspect,
}: {
  src: string;
  alt: string;
  aspect: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, rotate: -0.6 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        border: `3px solid ${PAPER.ink}`,
        boxShadow: `8px 8px 0 ${PAPER.shadow}`,
        background: PAPER.white,
        aspectRatio: aspect,
      }}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: "rgba(247,244,238,0.22)", mixBlendMode: "multiply" }}
      />
    </motion.div>
  );
}

function SRMCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((p) => (p + 1) % SRM_IMAGES.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [paused]);

  const prev = () =>
    setIndex((p) => (p - 1 + SRM_IMAGES.length) % SRM_IMAGES.length);
  const next = () => setIndex((p) => (p + 1) % SRM_IMAGES.length);

  const onDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const x = info.offset.x;
    if (x > 80) prev();
    else if (x < -80) next();
  };

  const a = index;
  const b = (index + 1) % SRM_IMAGES.length;

  const ControlBtn = ({
    children,
    onClick,
    tint,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    tint: string;
  }) => (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-xl font-extrabold"
      style={{
        fontFamily: headingFont,
        background: tint,
        border: `3px solid ${PAPER.ink}`,
        boxShadow: `6px 6px 0 ${PAPER.shadow}`,
        color: PAPER.ink,
      }}
    >
      {children}
    </button>
  );

  const Dot = ({ i }: { i: number }) => (
    <button
      onClick={() => setIndex(i)}
      className="h-3 w-3 rounded-full"
      style={{
        background: i === index ? PAPER.accent : "rgba(18,56,89,0.18)",
        border: `2px solid ${PAPER.ink}`,
        boxShadow: `2px 2px 0 ${PAPER.shadow}`,
      }}
    />
  );

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Desktop: Tall + small */}
      <div className="hidden lg:grid grid-cols-[1fr_0.72fr] gap-4">
        <motion.div
          key={`tall-${a}`}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={onDragEnd}
        >
          <ImageCard
            src={SRM_IMAGES[a].src}
            alt={SRM_IMAGES[a].alt}
            aspect="3 / 4"
          />
        </motion.div>

        <div className="grid gap-4">
          <motion.div
            key={`small-${b}`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
          >
            <ImageCard
              src={SRM_IMAGES[b].src}
              alt={SRM_IMAGES[b].alt}
              aspect="4 / 3"
            />
          </motion.div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <ControlBtn tint="rgba(121,166,119,0.3)" onClick={prev}>
                ←
              </ControlBtn>
              <ControlBtn tint="rgba(171,191,168,0.3)" onClick={next}>
                →
              </ControlBtn>
            </div>

            <div className="flex gap-2">
              {SRM_IMAGES.map((_, i) => (
                <Dot key={i} i={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/tablet: one wide */}
      <div className="lg:hidden">
        <motion.div
          key={`mobile-${index}`}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={onDragEnd}
        >
          <ImageCard
            src={SRM_IMAGES[index].src}
            alt={SRM_IMAGES[index].alt}
            aspect="16 / 11"
          />
        </motion.div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <ControlBtn tint="rgba(121,166,119,0.3)" onClick={prev}>
              ←
            </ControlBtn>
            <ControlBtn tint="rgba(171,191,168,0.3)" onClick={next}>
              →
            </ControlBtn>
          </div>

          <div className="flex gap-2">
            {SRM_IMAGES.map((_, i) => (
              <Dot key={i} i={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const tilts = useStableTilts(POLAROIDS.length);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <div ref={containerRef} className="relative scroll-smooth">
      {/* SECTION 1 */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <PaperBase />

        <div className="absolute inset-0 opacity-[0.08]">
          <Image
            src="/assets/aboutbg.png"
            alt="bg"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Polaroids behind */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="hidden md:block">
            {POLAROIDS.map((p, idx) => (
              <div key={p.alt} className="pointer-events-auto">
                <Polaroid
                  src={p.src}
                  alt={p.alt}
                  baseRotate={tilts[idx].angle}
                  stylePos={p.desktop}
                  opacity={0.42}
                  baseScale={1}
                />
              </div>
            ))}
          </div>

          <div className="md:hidden">
            {[POLAROIDS[0], POLAROIDS[1]].map((p, idx) => (
              <div key={`m-${p.alt}`} className="pointer-events-auto">
                <Polaroid
                  src={p.src}
                  alt={p.alt}
                  baseRotate={tilts[idx].angle}
                  stylePos={p.mobile}
                  opacity={0.34}
                  baseScale={p.mobileScale}
                />
              </div>
            ))}
          </div>
        </div>

        <Vignette />

        {/* Content */}
        <div className="relative z-30 max-w-6xl mx-auto px-4 pt-[clamp(84px,10vh,120px)] pb-[clamp(56px,8vh,88px)]">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-120px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
              <InkTag text="Innovation" dot={PAPER.accent} />
              <InkTag text="Culture" dot={PAPER.lightAccent} />
              <InkTag text="Non-Tech + Tech" dot={PAPER.accent} />
              <InkTag text="Music Night" dot={PAPER.lightAccent} />
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05]"
              style={{
                fontFamily: headingFont,
                color: PAPER.ink,
                letterSpacing: "0.06em",
                textShadow: "2px 2px 0 rgba(14,42,68,0.15)",
              }}
            >
              TEXUS’26
            </h1>

            <DoodleLine />

            <PaperPanel className="w-full max-w-4xl p-5 sm:p-6 md:p-8">
              <p
                className="text-base sm:text-lg md:text-xl leading-relaxed"
                style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.92)" }}
              >
                TEXUS ’26 is SRM IST Ramapuram’s flagship fest where{" "}
                <b>hackathons meet hype</b>, <b>workshops meet wins</b>, and{" "}
                <b>culture meets chaos</b>. Two days packed with competitions,
                showcases, community drives, and the kind of moments you’ll clip
                forever.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
                <PaperButton tint="rgba(121,166,119,0.3)">Feb 2026</PaperButton>
                <PaperButton tint="rgba(171,191,168,0.3)">
                  SRM IST Ramapuram
                </PaperButton>
              </div>
            </PaperPanel>
          </motion.div>
        </div>
      </section>

      
      {/* SECTION 3 */}
      <section
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          background: `${PAPER.bg} url('/textures/paper.png')`,
          backgroundRepeat: "repeat",
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Card className="border-0 bg-transparent">
            <CardContent className="p-0">
              <PaperPanel className="p-6 md:p-10" hover={false}>
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-120px" }}
                    transition={{ duration: 0.55 }}
                    className="space-y-4"
                  >
                    <h2
                      className="text-3xl md:text-4xl font-extrabold"
                      style={{ fontFamily: headingFont, color: PAPER.ink }}
                    >
                      About SRM IST Ramapuram
                    </h2>
                    <DoodleLine />
                    <p
                      className="text-base md:text-lg leading-relaxed"
                      style={{
                        fontFamily: bodyFont,
                        color: "rgba(18,56,89,0.86)",
                      }}
                    >
                      SRM Institute of Science and Technology is known for its
                      strong academic ecosystem, vibrant student culture, and
                      industry exposure. SRM IST Ramapuram brings the energy —
                      clubs, events, innovation, and a community that actually
                      shows up.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <InkTag text="20,000+ students" dot={PAPER.accent} />
                      <InkTag text="A++ NAAC" dot={PAPER.lightAccent} />
                      <InkTag text="Industry exposure" dot={PAPER.accent} />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, margin: "-120px" }}
                    transition={{ duration: 0.55 }}
                  >
                    <SRMCarousel />
                  </motion.div>
                </div>
              </PaperPanel>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Progress bar */}
      <motion.div
        className="fixed left-0 top-0 h-1 z-[999]"
        style={{
          scaleX: smoothProgress,
          transformOrigin: "0%",
          background: `linear-gradient(to right, ${PAPER.accent}, ${PAPER.lightAccent})`,
        }}
      />
    </div>
  );
}
