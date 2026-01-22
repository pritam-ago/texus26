"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

const PAPER = {
  bg: "#F7F4EE",
  ink: "#123859",
  accent: "#419FD9",
  teal: "#03738C",
  olive: "#8C7503",
  sand: "#A68160",
  shadow: "#0E2A44",
};

const headingFont =
  "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', 'Kalam', ui-rounded, system-ui)";
const bodyFont =
  "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)";

const PaperLoadingComponent = () => {
  // Add useEffect to handle scroll
  useEffect(() => {
    // Disable scroll when component mounts
    document.body.style.overflow = "hidden";

    // Re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="h-screen w-screen fixed overflow-y-hidden z-50 flex flex-col items-center justify-center"
      style={{
        background: `${PAPER.bg} url('/textures/paper.png')`,
        backgroundRepeat: "repeat",
      }}
    >
      {/* doodle grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${PAPER.ink} 1px, transparent 1px),
            linear-gradient(to bottom, ${PAPER.ink} 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(247,244,238,0) 0%, rgba(247,244,238,0.55) 62%, rgba(247,244,238,0.98) 100%)",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Paper panel for the loader */}
        <div
          className="relative rounded-2xl p-8 mb-6"
          style={{
            background: `${PAPER.bg} url('/textures/paper.png')`,
            backgroundRepeat: "repeat",
            border: `4px solid ${PAPER.ink}`,
            boxShadow: `12px 12px 0 ${PAPER.shadow}`,
          }}
        >
          {/* Tape elements */}
          <div
            className="absolute -top-3 left-8 h-6 w-20 rounded-md"
            style={{
              background: "rgba(166,129,96,0.35)",
              border: `2px solid ${PAPER.ink}`,
              transform: "rotate(-2deg)",
              boxShadow: `2px 2px 0 rgba(14,42,68,0.15)`,
            }}
          />
          <div
            className="absolute -top-3 right-8 h-6 w-20 rounded-md"
            style={{
              background: "rgba(166,129,96,0.35)",
              border: `2px solid ${PAPER.ink}`,
              transform: "rotate(2deg)",
              boxShadow: `2px 2px 0 rgba(14,42,68,0.15)`,
            }}
          />

          {/* Infinity loader */}
          <svg width="120" height="60" viewBox="0 0 60 30" className="mx-auto">
            <motion.path
              d="M15,15 C15,7.5 22.5,7.5 30,15 C37.5,22.5 45,22.5 45,15 C45,7.5 37.5,7.5 30,15 C22.5,22.5 15,22.5 15,15 Z"
              fill="transparent"
              strokeWidth="3"
              stroke={PAPER.ink}
              strokeOpacity="0.2"
              strokeLinecap="round"
            />
            <motion.path
              d="M15,15 C15,7.5 22.5,7.5 30,15 C37.5,22.5 45,22.5 45,15 C45,7.5 37.5,7.5 30,15 C22.5,22.5 15,22.5 15,15 Z"
              fill="transparent"
              strokeWidth="3"
              stroke={PAPER.accent}
              strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{
                pathLength: 1,
                pathOffset: 1,
                transition: {
                  pathLength: { duration: 2, repeat: Infinity, ease: "linear" },
                  pathOffset: { duration: 2, repeat: Infinity, ease: "linear" },
                },
              }}
            />
          </svg>
        </div>

        {/* Loading text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div
            className="text-lg md:text-xl font-bold mb-2 animate-pulse"
            style={{ fontFamily: headingFont, color: PAPER.ink }}
          >
            TEXUS '26
          </div>
          <div
            className="text-sm md:text-base animate-pulse"
            style={{ fontFamily: bodyFont, color: PAPER.ink, opacity: 0.8 }}
          >
            Loading the magic...
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaperLoadingComponent;