"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function GoGreenScrollAnimation() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  // Transform scroll progress to various animation values - must be before any conditional returns
  const leafRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const leafRotation2 = useTransform(scrollYProgress, [0, 1], [0, -360]);
  const treeGrowth = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 1]);
  const plantOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Pre-compute all useTransform hooks for floating leaves
  const floatingLeafOpacities = [
    useTransform(scrollYProgress, [0, 0.2], [0, 1]),
    useTransform(scrollYProgress, [0.15, 0.35], [0, 1]),
    useTransform(scrollYProgress, [0.3, 0.5], [0, 1]),
    useTransform(scrollYProgress, [0.45, 0.65], [0, 1]),
    useTransform(scrollYProgress, [0.6, 0.8], [0, 1]),
  ];

  const floatingLeafY = [
    useTransform(scrollYProgress, [0, 1], [0, -50]),
    useTransform(scrollYProgress, [0.15, 1], [0, -70]),
    useTransform(scrollYProgress, [0.3, 1], [0, -90]),
    useTransform(scrollYProgress, [0.45, 1], [0, -110]),
    useTransform(scrollYProgress, [0.6, 1], [0, -130]),
  ];

  const floatingLeafRotations = [
    useTransform(scrollYProgress, [0, 1], [0, 180]),
    useTransform(scrollYProgress, [0.15, 1], [0, 225]),
    useTransform(scrollYProgress, [0.3, 1], [0, 270]),
    useTransform(scrollYProgress, [0.45, 1], [0, 315]),
    useTransform(scrollYProgress, [0.6, 1], [0, 360]),
  ];

  // Recycling symbol transforms
  const recycleOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const recycleScale = useTransform(scrollYProgress, [0.7, 0.9], [0.5, 1]);
  const recycleRotation = useTransform(scrollYProgress, [0.7, 1], [0, 360]);

  // Earth transforms
  const earthScale = useTransform(scrollYProgress, [0.8, 1], [0.5, 1.2]);
  const earthOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  // Flower opacities
  const flowerOpacities = [
    useTransform(scrollYProgress, [0, 0.05], [0, 1]),
    useTransform(scrollYProgress, [0.125, 0.175], [0, 1]),
    useTransform(scrollYProgress, [0.25, 0.3], [0, 1]),
    useTransform(scrollYProgress, [0.375, 0.425], [0, 1]),
    useTransform(scrollYProgress, [0.5, 0.55], [0, 1]),
    useTransform(scrollYProgress, [0.625, 0.675], [0, 1]),
    useTransform(scrollYProgress, [0.75, 0.8], [0, 1]),
    useTransform(scrollYProgress, [0.875, 0.925], [0, 1]),
  ];

  // Message opacities
  const messageOpacity1 = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const messageOpacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [0, 1, 0]);
  const messageOpacity3 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);
  const messageOpacity4 = useTransform(scrollYProgress, [0.6, 0.7, 0.8], [0, 1, 0]);
  const messageOpacity5 = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed left-0 top-0 h-screen w-24 md:w-32 z-[100] pointer-events-none">
      <div className="relative h-full">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-green-700/10 to-green-900/20" />

        {/* Animated leaves falling */}
        <motion.div
          className="absolute top-10 left-4"
          style={{
            rotate: leafRotation,
          }}
        >
          <div className="text-4xl md:text-5xl filter drop-shadow-lg">🍃</div>
        </motion.div>

        <motion.div
          className="absolute top-32 right-4"
          style={{
            rotate: leafRotation2,
          }}
        >
          <div className="text-3xl md:text-4xl filter drop-shadow-lg">🌿</div>
        </motion.div>

        {/* Growing tree in the center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <motion.div
            style={{
              scale: treeGrowth,
              opacity: plantOpacity,
            }}
            className="flex flex-col items-center"
          >
            <div className="text-5xl md:text-6xl filter drop-shadow-lg">🌳</div>
            <div className="text-xs md:text-sm font-bold text-green-600 mt-2 text-center whitespace-nowrap">
              GO GREEN
            </div>
          </motion.div>
        </div>

        {/* Floating leaves at various positions */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${20 + i * 15}%`,
              left: `${20 + (i % 2) * 40}%`,
              opacity: floatingLeafOpacities[i],
              y: floatingLeafY[i],
              rotate: floatingLeafRotations[i],
            }}
          >
            <div className="text-2xl md:text-3xl filter drop-shadow-lg">
              {["🍀", "🌱", "🌾", "🪴", "🌿"][i]}
            </div>
          </motion.div>
        ))}

        {/* Recycling symbol that appears on scroll */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2"
          style={{
            opacity: recycleOpacity,
            scale: recycleScale,
            rotate: recycleRotation,
          }}
        >
          <div className="text-4xl md:text-5xl filter drop-shadow-lg">♻️</div>
        </motion.div>

        {/* Earth icon at the bottom */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{
            scale: earthScale,
            opacity: earthOpacity,
          }}
        >
          <div className="text-5xl md:text-6xl filter drop-shadow-lg">🌍</div>
        </motion.div>

        {/* Animated progress bar styled as growing vine */}
        <div className="absolute left-2 top-0 h-full w-1 bg-green-900/20 rounded-full">
          <motion.div
            className="w-full bg-gradient-to-b from-green-400 via-green-600 to-green-800 rounded-full origin-top"
            style={{
              scaleY: scrollYProgress,
            }}
          />
        </div>

        {/* Small flowers appearing along the progress */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`flower-${i}`}
            className="absolute left-3"
            style={{
              top: `${i * 12.5}%`,
              opacity: flowerOpacities[i],
            }}
          >
            <div className="text-lg md:text-xl">
              {["🌸", "🌺", "🌻", "🌼", "🌷", "🏵️", "💐", "🌹"][i]}
            </div>
          </motion.div>
        ))}

        {/* Eco-friendly messages */}
        <motion.div
          className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-green-700 whitespace-nowrap"
          style={{
            opacity: messageOpacity1,
          }}
        >
          🌱 Save Earth
        </motion.div>

        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-green-700 whitespace-nowrap"
          style={{
            opacity: messageOpacity2,
          }}
        >
          ♻️ Reduce
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-green-700 whitespace-nowrap"
          style={{
            opacity: messageOpacity3,
          }}
        >
          🔄 Reuse
        </motion.div>

        <motion.div
          className="absolute top-3/4 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-green-700 whitespace-nowrap"
          style={{
            opacity: messageOpacity4,
          }}
        >
          ♻️ Recycle
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-green-700 whitespace-nowrap"
          style={{
            opacity: messageOpacity5,
          }}
        >
          🌍 Save Planet
        </motion.div>
      </div>
    </div>
  );
}
