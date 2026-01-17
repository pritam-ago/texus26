"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
const Musicalnight = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  // Handle responsive values
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["100px end", "end start"],
  });
  const springConfig = { mass: 1, stiffness: 150, damping: 30 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  const startPoint = 0.3;
  const midPoint = 0.6;
  const endPoint = 0.7;
  const textScale = useTransform(
    smoothProgress,
    [startPoint, midPoint],
    [1, isMobile ? 35 : 55]
  );
  const textX = useTransform(
    smoothProgress,
    [startPoint, midPoint],
    isMobile ? ["0%", "-78%"] : ["0%", "-100%"]
  );
  const textY = useTransform(
    smoothProgress,
    [startPoint, midPoint],
    isMobile ? ["0%", "-160%"] : ["0%", "-0%"]
  );
  const whiteScreenScale = useTransform(
    smoothProgress,
    [startPoint + 0.1, midPoint],
    isMobile ? [1, 2] : [1, 2.5]
  );
  const whiteScreenOpacity = useTransform(
    smoothProgress,
    [midPoint, endPoint],
    [1, 1]
  );
  const textOpacity = useTransform(
    smoothProgress,
    [startPoint, endPoint],
    [1, 1]
  );
  return (
    <div ref={containerRef} className="relative h-[300vh] md:h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Video */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-screen object-cover object-center"
          >
            <source src="/assets/Texus DJ Landscape.mp4" type="video/mp4" />
          </video>
        </motion.div>
        {/* SVG Text Mask */}
        <motion.div
          className="absolute inset-0 overflow-hidden bg-transparent"
          style={{
            opacity: whiteScreenOpacity,
            scale: whiteScreenScale,
            transformOrigin: "center",
          }}
          transition={{ type: "spring", ...springConfig }}
        >
          <motion.div
            className="absolute inset-0 flex items-center px-5 justify-center"
            style={{
              scale: textScale,
              x: textX,
              y: textY,
              opacity: textOpacity,
            }}
            transition={{ type: "spring", ...springConfig }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 285 80"
              preserveAspectRatio="xMidYMid slice"
              className="absolute top-0 left-0 w-full h-full"
              id="masktext"
            >
              <defs>
                <mask id="textMask" x="0" y="0" width="100%" height="100%">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  <text
                    ref={textRef}
                    x="50"
                    y="50"
                    className=" fill-black uppercase text-[4px] md:text-[13px] font-thuast translate-x-[72px] translate-y-[-5px] md:translate-y-[-5px]  md:translate-x-[25px]"
                  >
                    MUSICAL NIGHT
                  </text>
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="black"
                mask="url(#textMask)"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
export default Musicalnight;
