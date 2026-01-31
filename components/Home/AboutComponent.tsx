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
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  tint?: string;
  className?: string;
}) => {
  const btn = (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={cn("px-3 sm:px-4 py-2 rounded-xl font-bold inline-flex justify-center items-center whitespace-nowrap", className)}
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

        {/* Polaroids behind - Hidden on mobile for cleaner look */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="hidden lg:block">
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

          {/* Show minimal polaroids on tablet only */}
          <div className="hidden md:block lg:hidden">
            {[POLAROIDS[0], POLAROIDS[2]].map((p, idx) => (
              <div key={`t-${p.alt}`} className="pointer-events-auto">
                <Polaroid
                  src={p.src}
                  alt={p.alt}
                  baseRotate={tilts[idx].angle}
                  stylePos={p.desktop}
                  opacity={0.28}
                  baseScale={0.8}
                />
              </div>
            ))}
          </div>
        </div>

        <Vignette />

        {/* Content */}
        <div className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-120px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center gap-3 sm:gap-4"
          >
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl px-2">
              <InkTag text="Innovation" dot={PAPER.accent} />
              <InkTag text="Culture" dot={PAPER.lightAccent} />
              <InkTag text="Non-Tech + Tech" dot={PAPER.accent} />
              <InkTag text="Music Night" dot={PAPER.lightAccent} />
            </div>

            {/* Title */}
            <div className="relative w-full max-w-md mx-auto px-4">
              <Image
                src="/assets/texts/texus 2026.png"
                alt="TEXUS'26"
                width={500}
                height={150}
                className="w-full h-auto"
                priority
                style={{
                  filter: "drop-shadow(2px 2px 0 rgba(14,42,68,0.15))",
                }}
              />
            </div>

            <DoodleLine />

            {/* Description Card */}
            <PaperPanel className="w-full max-w-4xl p-4 sm:p-5 md:p-6 lg:p-8">
            <p
                className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-justify"
                style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.92)" }}
              >
                TEXUS '26 is SRM IST Ramapuram's flagship fest where{" "}
                <b>hackathons meet hype</b>, <b>workshops meet wins</b>, and{" "}
                <b>culture meets chaos</b>. Two days packed with competitions,
                showcases, community drives, and the kind of moments you'll clip
                forever.
              </p>

              {/* Buttons */}
              <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center">
                <PaperButton tint="rgba(121,166,119,0.3)" className="w-full sm:w-auto">
                  📅 Feb 2026
                </PaperButton>
                <PaperButton tint="rgba(171,191,168,0.3)" className="w-full sm:w-auto">
                  📍 SRM IST Ramapuram
                </PaperButton>
              </div>
            </PaperPanel>

            {/* Mobile Polaroid Gallery - Only on mobile */}
            <div className="md:hidden mt-8 w-full max-w-lg">
              <div className="grid grid-cols-2 gap-3 px-2">
                {POLAROIDS.slice(0, 2).map((p, idx) => (
                  <motion.div
                    key={`mobile-${p.alt}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    className="relative"
                  >
                    <div
                      className="relative rounded-xl overflow-hidden"
                      style={{
                        background: PAPER.white,
                        border: `3px solid ${PAPER.ink}`,
                        boxShadow: `6px 6px 0 ${PAPER.shadow}`,
                        transform: idx % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)',
                      }}
                    >
                      <Tape className="-top-3 left-3" rotate={-6} />
                      <div className="relative w-full aspect-[4/3]">
                        <Image
                          src={p.src}
                          alt={p.alt}
                          fill
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: "rgba(247,244,238,0.15)",
                            mixBlendMode: "multiply",
                          }}
                        />
                      </div>
                      <div
                        className="px-3 py-2 text-center"
                        style={{
                          background: PAPER.white,
                          borderTop: `2px solid rgba(18,56,89,0.12)`,
                          fontFamily: bodyFont,
                          color: PAPER.ink,
                          fontSize: "0.7rem",
                        }}
                      >
                        TEXUS '26
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      
      {/* SECTION 3 */}
      <section
        className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
        style={{
          background: `${PAPER.bg} url('/textures/paper.png')`,
          backgroundRepeat: "repeat",
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <Card className="border-0 bg-transparent">
            <CardContent className="p-0">
              <PaperPanel className="p-4 sm:p-6 md:p-8 lg:p-10" hover={false}>
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-120px" }}
                    transition={{ duration: 0.55 }}
                    className="space-y-3 sm:space-y-4"
                  >
                    <h2
                      className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold"
                      style={{ fontFamily: headingFont, color: PAPER.ink }}
                    >
                      About SRM IST Ramapuram
                    </h2>
                    <DoodleLine />
                    <p
                      className="text-sm xs:text-base sm:text-base md:text-lg leading-relaxed text-justify"
                      style={{
                        fontFamily: bodyFont,
                        color: "rgba(18,56,89,0.86)",
                      }}
                    >
                      SRM Institute of Science and Technology is one of the top ranking universities in India with over 60000+ full time students and more than 4460+ faculty across all the campuses – Kattankulathur, Ramapuram, Vadapalani, Baburayanpettai Campus – all in and around Chennai, Tiruchirappalli (in TN), Modinagar (in UP) & Sonepat (in Haryana) – both of which are located near Delhi NCR, Amaravati (in AP), Gangtok (in Sikkim) – offering a wide range of undergraduate, postgraduate and doctoral programs in six Faculties – Engineering & Technology, Management, Medicine & Health Sciences, Science & Humanities, Law and Agricultural Sciences.
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
