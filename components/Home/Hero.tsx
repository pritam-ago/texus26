"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

const PAPER = {
  bg: "#F2F2F2",
  ink: "#12590F",
  accent: "#79A677",
  lightAccent: "#ABBFA8",
  shadow: "#12590F",
};

const headingFont =
  "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', 'Kalam', ui-rounded, system-ui)";
const bodyFont =
  "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)";

// Magnetic button effect
const MagneticButton = ({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <a ref={ref} href={href} className={className}>
      {children}
    </a>
  );
};

// Morphing blob background
const MorphingBlob = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-30"
      initial={{ scale: 0.8 }}
      animate={{
        scale: [0.8, 1.2, 0.9, 1.1, 0.8],
        x: [0, 50, -30, 40, 0],
        y: [0, -40, 30, -20, 0],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        width: "400px",
        height: "400px",
        background: `radial-gradient(circle, ${PAPER.accent}, ${PAPER.lightAccent})`,
      }}
    />
  );
};

// Scrambled text reveal effect
const ScrambleText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let iteration = 0;
    const totalIterations = text.length;

    setTimeout(() => {
      setIsAnimating(true);
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (char === " ") return " ";
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        iteration += 1 / 3;

        if (iteration >= totalIterations) {
          clearInterval(interval);
          setDisplayText(text);
          setIsAnimating(false);
        }
      }, 30);

      return () => clearInterval(interval);
    }, delay);
  }, [text, delay]);

  return <span>{displayText}</span>;
};

// Staggered word reveal
const StaggeredText = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  const words = text.split(" ");

  return (
    <span className="flex flex-wrap justify-center gap-x-2">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: delay + i * 0.1,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ transformStyle: "preserve-3d" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Rotating badge
const RotatingBadge = ({ text }: { text: string }) => {
  const [radius, setRadius] = useState(30);

  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth >= 768) {
        setRadius(45); // md and above
      } else if (window.innerWidth >= 640) {
        setRadius(38); // sm
      } else {
        setRadius(30); // mobile
      }
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  return (
    <motion.div
      className="relative"
      style={{ width: radius * 2, height: radius * 2 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      {text.split("").map((char, i) => {
        const angle = (360 / text.length) * i;
        return (
          <span
            key={i}
            className="absolute font-bold text-xs sm:text-sm"
            style={{
              fontFamily: bodyFont,
              color: PAPER.ink,
              left: "50%",
              top: "50%",
              transform: `rotate(${angle}deg) translateY(-${radius}px)`,
              transformOrigin: "0 0",
            }}
          >
            {char}
          </span>
        );
      })}
    </motion.div>
  );
};

// Tree illustration
const TreeSVG = ({ className = "", size = 120 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size * 1.5}
    viewBox="0 0 120 180"
    fill="none"
    className={className}
  >
    {/* Foliage layers - from top to bottom */}
    <path
      d="M60 30 L110 60 L85 60 L100 90 L80 90 L90 120 L60 120 L30 120 L40 90 L20 90 L35 60 L10 60 Z"
      fill={PAPER.accent}
      stroke={PAPER.ink}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Decorative circles on foliage */}
    <circle cx="45" cy="70" r="8" fill={PAPER.lightAccent} opacity="0.6" />
    <circle cx="75" cy="65" r="10" fill={PAPER.lightAccent} opacity="0.6" />
    <circle cx="60" cy="50" r="7" fill={PAPER.lightAccent} opacity="0.6" />
    {/* Tree trunk */}
    <rect
      x="50"
      y="120"
      width="20"
      height="60"
      fill="#8B6F47"
      stroke={PAPER.ink}
      strokeWidth="3"
    />
  </svg>
);

// Grass illustration
const GrassSVG = ({ className = "" }: { className?: string }) => (
  <svg width="100%" height="60" viewBox="0 0 1000 60" fill="none" className={className} preserveAspectRatio="none">
    <path
      d="M0 60 L0 40 Q50 20, 100 40 Q150 20, 200 40 Q250 20, 300 40 Q350 20, 400 40 Q450 20, 500 40 Q550 20, 600 40 Q650 20, 700 40 Q750 20, 800 40 Q850 20, 900 40 Q950 20, 1000 40 L1000 60 Z"
      fill={PAPER.accent}
      stroke={PAPER.ink}
      strokeWidth="2"
    />
  </svg>
);

const Hero = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Trees are now static (no animation)

  if (!isClient) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden" style={{ background: PAPER.bg }}>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden pt-20">
      {/* Paper background with texture */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `${PAPER.bg} url('/assets/hero-bg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `url('/textures/paper.png')`,
            backgroundRepeat: "repeat",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Morphing blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <MorphingBlob delay={0} />
        <MorphingBlob delay={5} />
      </div>

      {/* Trees on sides */}
      <div className="absolute bottom-0 left-0 hidden lg:block">
        <TreeSVG size={150} />
      </div>
      <div className="absolute bottom-0 left-[10%] hidden md:block">
        <TreeSVG size={120} />
      </div>
      <div className="absolute bottom-0 right-0 hidden lg:block" style={{ transform: "scaleX(-1)" }}>
        <TreeSVG size={150} />
      </div>
      <div className="absolute bottom-0 right-[10%] hidden md:block" style={{ transform: "scaleX(-1)" }}>
        <TreeSVG size={120} />
      </div>

      {/* Grass at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <GrassSVG />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:py-20">
        {/* Rotating badge */}
        <motion.div
          className="absolute top-4 sm:top-10 right-4 sm:right-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, duration: 1, type: "spring" }}
        >
          <div
            className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center"
            style={{
              background: PAPER.accent,
              border: `3px sm:border-4 solid ${PAPER.ink}`,
              boxShadow: `6px 6px 0 ${PAPER.shadow}`,
            }}
          >
            <RotatingBadge text="★ FEB ★ 2026" />
            <div
              className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-extrabold"
              style={{ fontFamily: headingFont, color: PAPER.ink }}
            >
              '26
            </div>
          </div>
        </motion.div>

        {/* Main title with 3D perspective */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 md:mb-16 mt-8 sm:mt-0 lg:-mt-8 xl:-mt-12" 
          style={{ perspective: "1000px" }}
        >
          <motion.div
            initial={{ opacity: 0, rotateX: -90, z: -200 }}
            animate={{ opacity: 1, rotateX: 0, z: 0 }}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              rotateZ: 2,
              y: -10,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 15 
              }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d", cursor: "pointer" }}
            className="flex justify-center items-center"
          >
            {/* Hero Logo Image */}
            <motion.img
              src="/assets/hero-logo.png"
              alt="TEXUS Logo"
              className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl"
              style={{
                filter: `drop-shadow(4px 4px 0 ${PAPER.shadow})`,
              }}
              whileHover={{
                filter: `drop-shadow(6px 6px 0 ${PAPER.shadow}) brightness(1.1)`,
              }}
            />
          </motion.div>

          {/* Subtitle with stagger effect */}
          <motion.div
            className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-xl md:text-2xl lg:text-3xl px-4"
            style={{
              fontFamily: bodyFont,
              color: PAPER.ink,
            }}
          >
            <StaggeredText text="SRM IST Ramapuram's Flagship Festival" delay={1.8} />
          </motion.div>

          {/* Feature tags */}
          <motion.div
            className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4 sm:mt-6 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            {["Culture", "Tech", "Music"].map((tag, i) => (
              <motion.span
                key={tag}
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm"
                style={{
                  fontFamily: bodyFont,
                  background: PAPER.lightAccent,
                  border: `2px sm:border-3 solid ${PAPER.ink}`,
                  boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                  color: PAPER.ink,
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Phase cards with tilt effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl w-full px-4">
          {/* Phase 1 */}
          <MagneticButton href="/nilgiris" className="block">
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: -45 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 2.5, duration: 0.8, type: "spring" }}
              whileHover={{
                scale: 1.02,
                rotateZ: 1,
                boxShadow: `12px 12px 0 ${PAPER.shadow}`,
              }}
              className="relative p-6 sm:p-8 rounded-2xl group touch-manipulation"
              style={{
                background: `${PAPER.bg} url('/textures/paper.png')`,
                border: `3px sm:border-4 solid ${PAPER.ink}`,
                boxShadow: `8px 8px 0 ${PAPER.shadow}`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Tape decoration */}
              <img 
                src="/textures/tape.png" 
                alt="tape"
                className="absolute -top-4 sm:-top-5 left-6 sm:left-8 w-16 sm:w-20 h-auto"
                style={{ transform: "rotate(-3deg)" }}
              />
              <img 
                src="/textures/tape.png" 
                alt="tape"
                className="absolute -top-4 sm:-top-5 right-6 sm:right-8 w-16 sm:w-20 h-auto"
                style={{ transform: "rotate(3deg) scaleX(-1)" }}
              />

              {/* Badge */}
              <div
                className="inline-flex items-center px-3 py-1 sm:py-1.5 rounded-full mb-3 sm:mb-4"
                style={{
                  background: PAPER.accent,
                  border: `2px sm:border-3 solid ${PAPER.ink}`,
                  boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                }}
              >
                <span
                  className="text-xs sm:text-sm font-extrabold"
                  style={{ fontFamily: headingFont, color: PAPER.ink }}
                >
                  PHASE 1
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3"
                style={{ fontFamily: headingFont, color: PAPER.ink }}
              >
                GLOBAL SUMMIT
              </h3>

              {/* Description */}
              <p
                className="text-sm sm:text-base mb-3 sm:mb-4"
                style={{ fontFamily: bodyFont, color: PAPER.ink, opacity: 0.8 }}
              >
                Sustainability • Go-Green • Community Impact
              </p>

              {/* Date */}
              <div
                className="inline-flex items-center px-3 sm:px-4 py-2 rounded-xl"
                style={{
                  background: PAPER.lightAccent,
                  border: `2px sm:border-3 solid ${PAPER.ink}`,
                  boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                }}
              >
                <span
                  className="text-base sm:text-lg font-bold"
                  style={{ fontFamily: bodyFont, color: PAPER.ink }}
                >
                  📅 FEB 14 & 15
                </span>
              </div>

              {/* Hover arrow */}
              <motion.div
                className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="w-6 h-6 sm:w-8 sm:h-8">
                  <path
                    d="M8 16H24M24 16L16 8M24 16L16 24"
                    stroke={PAPER.ink}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </MagneticButton>

          {/* Phase 2 */}
          <MagneticButton href="/events/#events" className="block">
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 45 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 2.7, duration: 0.8, type: "spring" }}
              whileHover={{
                scale: 1.02,
                rotateZ: -1,
                boxShadow: `12px 12px 0 ${PAPER.shadow}`,
              }}
              className="relative p-6 sm:p-8 rounded-2xl group touch-manipulation"
              style={{
                background: `${PAPER.bg} url('/textures/paper.png')`,
                border: `3px sm:border-4 solid ${PAPER.ink}`,
                boxShadow: `8px 8px 0 ${PAPER.shadow}`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Tape decoration */}
              <img 
                src="/textures/tape.png" 
                alt="tape"
                className="absolute -top-4 sm:-top-5 left-6 sm:left-8 w-16 sm:w-20 h-auto"
                style={{ transform: "rotate(-3deg)" }}
              />
              <img 
                src="/textures/tape.png" 
                alt="tape"
                className="absolute -top-4 sm:-top-5 right-6 sm:right-8 w-16 sm:w-20 h-auto"
                style={{ transform: "rotate(3deg) scaleX(-1)" }}
              />

              {/* Badge */}
              <div
                className="inline-flex items-center px-3 py-1 sm:py-1.5 rounded-full mb-3 sm:mb-4"
                style={{
                  background: PAPER.lightAccent,
                  border: `2px sm:border-3 solid ${PAPER.ink}`,
                  boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                }}
              >
                <span
                  className="text-xs sm:text-sm font-extrabold"
                  style={{ fontFamily: headingFont, color: PAPER.ink }}
                >
                  PHASE 2
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3"
                style={{ fontFamily: headingFont, color: PAPER.ink }}
              >
                TEXUS'26
              </h3>

              {/* Description */}
              <p
                className="text-sm sm:text-base mb-3 sm:mb-4"
                style={{ fontFamily: bodyFont, color: PAPER.ink, opacity: 0.8 }}
              >
                Tech Events • Workshops • Hackathon • Music Night
              </p>

              {/* Date */}
              <div
                className="inline-flex items-center px-3 sm:px-4 py-2 rounded-xl"
                style={{
                  background: PAPER.accent,
                  border: `2px sm:border-3 solid ${PAPER.ink}`,
                  boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                }}
              >
                <span
                  className="text-base sm:text-lg font-bold"
                  style={{ fontFamily: bodyFont, color: PAPER.ink }}
                >
                  📅 FEB 27 & 28
                </span>
              </div>

              {/* Hover arrow */}
              <motion.div
                className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="w-6 h-6 sm:w-8 sm:h-8">
                  <path
                    d="M8 16H24M24 16L16 8M24 16L16 24"
                    stroke={PAPER.ink}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </MagneticButton>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 3, duration: 0.5 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-6 sm:bottom-10"
        >
          <div
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-full"
            style={{
              background: PAPER.lightAccent,
              border: `2px sm:border-3 solid ${PAPER.ink}`,
              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
            }}
          >
            <span
              className="text-xs sm:text-sm font-bold"
              style={{ fontFamily: bodyFont, color: PAPER.ink }}
            >
              ↓ Scroll to explore
            </span>
          </div>
        </motion.div>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(242,242,242,0) 30%, rgba(242,242,242,0.5) 70%, rgba(242,242,242,0.9) 100%)",
        }}
      />
    </div>
  );
};

export default Hero;
