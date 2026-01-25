"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// PAPER Theme Colors
export const PAPER = {
  bg: "#F2F2F2",
  ink: "#12590F",
  accent: "#79A677",
  lightAccent: "#ABBFA8",
  shadow: "#12590F",
  white: "#FFFFFF",
  purple: "#8B5CF6",
  pink: "#EC4899",
  green: "#10B981",
};

export const headingFont =
  "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', 'Kalam', ui-rounded, system-ui)";
export const bodyFont =
  "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)";

// Tape decoration component
export const Tape = ({
  className = "",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) => (
  <img
    src="/textures/tape.png"
    alt="tape"
    className={cn("absolute w-16 sm:w-20 h-auto", className)}
    style={{
      transform: `rotate(${rotate}deg) ${rotate > 0 ? "scaleX(-1)" : ""}`,
    }}
  />
);

// Small tree decoration
export const CardTree = ({
  className = "",
  side = "left",
  size = 60,
}: {
  className?: string;
  side?: "left" | "right";
  size?: number;
}) => (
  <svg
    width={size}
    height={size * 1.5}
    viewBox="0 0 120 180"
    fill="none"
    className={cn("absolute pointer-events-none opacity-20", className)}
    style={{
      transform: side === "right" ? "scaleX(-1)" : undefined,
    }}
  >
    {/* Foliage layers */}
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

// Main PaperCard component - EXACT style from Hero section
export const PaperCard = ({
  children,
  className = "",
  hover = true,
  withTape = true,
  withTrees = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  withTape?: boolean;
  withTrees?: boolean;
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
    className={cn("relative p-6 sm:p-8 rounded-2xl group", className)}
    style={{
      background: `${PAPER.bg} url('/textures/paper.png')`,
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `8px 8px 0 ${PAPER.shadow}`,
      transformStyle: "preserve-3d",
    }}
  >
    {/* Tape decorations */}
    {withTape && (
      <>
        <Tape className="-top-4 sm:-top-5 left-6 sm:left-8" rotate={-3} />
        <Tape className="-top-4 sm:-top-5 right-6 sm:right-8" rotate={3} />
      </>
    )}

    {/* Tree decorations */}
    {withTrees && (
      <>
        <CardTree className="bottom-2 left-2" side="left" size={50} />
        <CardTree className="bottom-2 right-2" side="right" size={50} />
      </>
    )}

    {children}
  </motion.div>
);

// Badge component - EXACT style from Hero section
export const PaperBadge = ({
  children,
  color = PAPER.accent,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) => (
  <div
    className={cn(
      "inline-flex items-center px-3 py-1 sm:py-1.5 rounded-full",
      className
    )}
    style={{
      background: color,
      border: `2px solid ${PAPER.ink}`,
      boxShadow: `3px 3px 0 ${PAPER.shadow}`,
    }}
  >
    <span
      className="text-xs sm:text-sm font-extrabold"
      style={{ fontFamily: headingFont, color: PAPER.ink }}
    >
      {children}
    </span>
  </div>
);

// Button/Date box component - EXACT style from Hero section
export const PaperBox = ({
  children,
  color = PAPER.lightAccent,
  className = "",
  onClick,
  href,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
  href?: string;
}) => {
  const Component = href ? motion.a : motion.div;
  const props = href ? { href } : onClick ? { onClick } : {};

  return (
    <Component
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex items-center px-3 sm:px-4 py-2 rounded-xl cursor-pointer",
        className
      )}
      style={{
        background: color,
        border: `2px solid ${PAPER.ink}`,
        boxShadow: `3px 3px 0 ${PAPER.shadow}`,
      }}
      {...props}
    >
      <span
        className="text-base sm:text-lg font-bold"
        style={{ fontFamily: bodyFont, color: PAPER.ink }}
      >
        {children}
      </span>
    </Component>
  );
};

// Heading component - matching Hero section style
export const PaperHeading = ({
  children,
  className = "",
  size = "2xl",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "xl" | "2xl" | "3xl" | "4xl";
}) => {
  const sizeClasses = {
    xl: "text-xl sm:text-2xl md:text-3xl",
    "2xl": "text-2xl sm:text-3xl md:text-4xl",
    "3xl": "text-3xl sm:text-4xl md:text-5xl",
    "4xl": "text-4xl sm:text-5xl md:text-6xl",
  };

  return (
    <h3
      className={cn(sizeClasses[size], "font-extrabold mb-2 sm:mb-3", className)}
      style={{ fontFamily: headingFont, color: PAPER.ink }}
    >
      {children}
    </h3>
  );
};

// Description text component - matching Hero section style
export const PaperText = ({
  children,
  className = "",
  opacity = 0.8,
}: {
  children: React.ReactNode;
  className?: string;
  opacity?: number;
}) => (
  <p
    className={cn("text-sm sm:text-base mb-3 sm:mb-4", className)}
    style={{ fontFamily: bodyFont, color: PAPER.ink, opacity }}
  >
    {children}
  </p>
);

// Paper background component
export const PaperBase = ({ className = "" }: { className?: string }) => (
  <div
    className={cn("absolute inset-0", className)}
    style={{
      background: `${PAPER.bg} url('/textures/paper.png')`,
      backgroundRepeat: "repeat",
    }}
  />
);

// Vignette overlay component
export const Vignette = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        "radial-gradient(circle at center, rgba(242,242,242,0) 0%, rgba(242,242,242,0.45) 62%, rgba(242,242,242,0.95) 100%)",
    }}
  />
);

// Doodle line decoration
export const DoodleLine = ({ className = "" }: { className?: string }) => (
  <div
    className={cn("h-[6px] w-28 sm:w-32 md:w-40 rounded-full", className)}
    style={{
      background: PAPER.accent,
      transform: "rotate(-2deg)",
      boxShadow: `3px 3px 0 ${PAPER.shadow}`,
      border: `2px solid ${PAPER.ink}`,
    }}
  />
);

// Simple card without hover effect (for lists and static content)
export const PaperSimpleCard = ({
  children,
  className = "",
  withTape = false,
}: {
  children: React.ReactNode;
  className?: string;
  withTape?: boolean;
}) => (
  <div
    className={cn("relative p-4 sm:p-6 rounded-xl", className)}
    style={{
      background: `${PAPER.bg} url('/textures/paper.png')`,
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `6px 6px 0 ${PAPER.shadow}`,
    }}
  >
    {withTape && (
      <>
        <Tape className="-top-3 left-4" rotate={-3} />
        <Tape className="-top-3 right-4" rotate={3} />
      </>
    )}
    {children}
  </div>
);

// Panel component (for larger sections)
export const PaperPanel = ({
  children,
  className = "",
  padding = "large",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: "small" | "medium" | "large";
}) => {
  const paddingClasses = {
    small: "p-4 sm:p-6",
    medium: "p-6 sm:p-8",
    large: "p-8 sm:p-12",
  };

  return (
    <div
      className={cn("relative rounded-2xl", paddingClasses[padding], className)}
      style={{
        background: `${PAPER.bg} url('/textures/paper.png')`,
        border: `4px solid ${PAPER.ink}`,
        boxShadow: `10px 10px 0 ${PAPER.shadow}`,
      }}
    >
      {children}
    </div>
  );
};

// Button component with paper style
export const PaperButton = ({
  children,
  onClick,
  href,
  className = "",
  variant = "default",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "default" | "accent" | "white";
  disabled?: boolean;
}) => {
  const Component = href ? motion.a : motion.button;
  const props = href ? { href } : {};

  const colors = {
    default: { bg: PAPER.accent, color: PAPER.ink },
    accent: { bg: PAPER.lightAccent, color: PAPER.ink },
    white: { bg: PAPER.white, color: PAPER.ink },
  };

  return (
    <Component
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.95, y: 0 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-extrabold transition active:translate-y-[1px]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        background: colors[variant].bg,
        color: colors[variant].color,
        border: `3px solid ${PAPER.ink}`,
        boxShadow: `3px 3px 0 ${PAPER.shadow}`,
        fontFamily: bodyFont,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

// Status badge (for payment status, event status, etc.)
export const PaperStatusBadge = ({
  children,
  status = "default",
  className = "",
}: {
  children: React.ReactNode;
  status?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}) => {
  const statusColors = {
    default: PAPER.lightAccent,
    success: PAPER.green,
    warning: "#FCD34D",
    error: "#EF4444",
    info: "#3B82F6",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full",
        className
      )}
      style={{
        background: statusColors[status],
        border: `2px solid ${PAPER.ink}`,
        boxShadow: `2px 2px 0 ${PAPER.shadow}`,
      }}
    >
      <span
        className="text-xs font-extrabold"
        style={{ fontFamily: bodyFont, color: PAPER.ink }}
      >
        {children}
      </span>
    </div>
  );
};

// Ink Badge (smaller, for tags)
export const InkBadge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn("inline-block px-3 py-1 rounded-full text-xs font-bold", className)}
    style={{
      background: PAPER.lightAccent,
      border: `2px solid ${PAPER.ink}`,
      color: PAPER.ink,
      fontFamily: bodyFont,
    }}
  >
    {children}
  </span>
);

// Ink Tag (even smaller, for inline tags)
export const InkTag = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn("inline-block px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold", className)}
    style={{
      background: PAPER.accent,
      border: `1px solid ${PAPER.ink}`,
      color: PAPER.ink,
      fontFamily: bodyFont,
    }}
  >
    {children}
  </span>
);

// Container with slight rotation (for dynamic look)
export const PaperTiltCard = ({
  children,
  className = "",
  tilt = -0.8,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: number;
}) => (
  <motion.div
    whileHover={{
      scale: 1.02,
      rotate: tilt * 1.5,
      boxShadow: `12px 12px 0 ${PAPER.shadow}`,
    }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={cn("relative p-6 rounded-2xl", className)}
    style={{
      background: `${PAPER.bg} url('/textures/paper.png')`,
      border: `4px solid ${PAPER.ink}`,
      boxShadow: `8px 8px 0 ${PAPER.shadow}`,
      transform: `rotate(${tilt}deg)`,
    }}
  >
    {children}
  </motion.div>
);

// Polaroid-style card (for images)
export const PolaroidCard = ({
  image,
  caption,
  className = "",
}: {
  image: string;
  caption?: string;
  className?: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: 2 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={cn("relative bg-white p-3 rounded-lg", className)}
    style={{
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `6px 6px 0 ${PAPER.shadow}`,
    }}
  >
    <div className="relative w-full aspect-square overflow-hidden rounded-sm mb-2">
      <img
        src={image}
        alt={caption || "Image"}
        className="w-full h-full object-cover"
      />
    </div>
    {caption && (
      <p
        className="text-center text-sm font-bold"
        style={{ fontFamily: bodyFont, color: PAPER.ink }}
      >
        {caption}
      </p>
    )}
  </motion.div>
);

// Arrow decoration for cards
export const ArrowDecoration = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={cn("absolute", className)}
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
);

// Dialog/Modal component
export const PaperDialog = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: 20 }}
    transition={{ duration: 0.2 }}
    className={cn("relative p-6 sm:p-8 rounded-2xl max-w-2xl w-full", className)}
    style={{
      background: `${PAPER.bg} url('/textures/paper.png')`,
      border: `4px solid ${PAPER.ink}`,
      boxShadow: `10px 10px 0 ${PAPER.shadow}`,
    }}
  >
    {children}
  </motion.div>
);
