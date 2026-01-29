"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { PAPER } from "../PaperComponents";

const Proshows = () => {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const isInView = useInView(textContainerRef, { once: false, amount: 0.3 });
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
    offset: ["start end", "end start"],
  });

  const springConfig = { mass: 1, stiffness: 150, damping: 30 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Fix for type error - explicitly typing the transform input/output arrays
  const contentOpacity = useTransform(
    smoothProgress,
    [0.1, 0.2, 0.8, 0.9] as number[],
    [0, 1, 1, 0] as number[]
  );

  // Add vinyl rotation based on scroll
  const vinylRotation = useTransform(
    smoothProgress,
    [0, 1],
    [0, 720] // Rotate 2 full turns (720 degrees) from start to end of scroll
  );

  // Drop animation variants for text elements
  const dropAnimation = {
    hidden: { y: -100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    }),
  };

  return (
    <div ref={containerRef} className="relative h-[150vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex flex-col w-full justify-center items-center p-4 h-full"
          style={{ 
            opacity: contentOpacity,
            background: `${PAPER.bg} url('/textures/paper.png')`,
          }}
        >
          {/* Main content container - flex-col on mobile, flex-row on larger screens */}
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center mt-4">
            {/* Vinyl container - full width on mobile, 3/4 width on larger screens */}
            <div className="w-full md:w-3/4 flex justify-center items-center">
              <div className="relative w-3/4 md:w-full aspect-square flex justify-center items-center">
                <div className="flex justify-center items-center w-full h-full ">
                  <motion.div
                    style={{ rotate: vinylRotation }}
                    className="w-full h-full flex justify-center items-center"
                  >
                    <Image
                      src="/assets/proshow/vinyl.png"
                      alt="vinyl disc"
                      width={isMobile ? 300 : 1920}
                      height={isMobile ? 300 : 1080}
                      quality={100}
                      className="object-contain"
                    />
                  </motion.div>
                </div>
                
                <Image
                  src="/assets/proshowtexusnobg.png"
                  alt="proshow text"
                  width={isMobile ? 600 : 1920}
                  height={isMobile ? 600 : 1080}
                  quality={100}
                  className="absolute h-96 w-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
                />
              </div>
            </div>

            {/* Text container with drop animation - triggered when in viewport */}
            <div
              ref={textContainerRef}
              className="w-full flex flex-col justify-center items-center md:items-end mt-4 md:mt-0 px-24"
            >
              <div className="flex flex-col md:flex-row md:gap-5 justify-center items-center">
                <motion.h1
                  className="text-4xl font-poppins font-black md:text-7xl"
                  style={{
                    color: PAPER.ink,
                    WebkitTextStroke: `1px ${PAPER.ink}`,
                  }}
                  variants={dropAnimation}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={0}
                >
                  PROSHOWS
                </motion.h1>
              </div>
              <div className="justify-center items-center gap-1 md:gap-4 flex flex-row">
                <motion.h1
                  className="font-poppins text-4xl flex md:text-7xl font-extrabold"
                  style={{
                    color: PAPER.accent,
                  }}
                  variants={dropAnimation}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={2}
                >
                  COMING
                </motion.h1>
                <motion.h1
                  className="font-poppins text-4xl w-full flex md:text-7xl font-extrabold"
                  style={{
                    color: PAPER.accent,
                  }}
                  variants={dropAnimation}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={2.4}
                >
                  SOON
                </motion.h1>
              </div>
              <motion.h1
                className="text-4xl md:text-7xl font-poppins font-extrabold"
                style={{
                  color: PAPER.ink,
                  WebkitTextStroke: `1px ${PAPER.ink}`,
                }}
                variants={dropAnimation}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={3}
              >
                FEBRUARY
              </motion.h1>
              <motion.div
                className="py-8"
                variants={dropAnimation}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={4}
              >
                <Link href="/events/musical-night">
                  <Button
                    className="font-montserrat font-bold text-xl"
                    style={{
                      backgroundColor: PAPER.accent,
                      color: PAPER.ink,
                      border: `3px solid ${PAPER.ink}`,
                      boxShadow: `4px 4px 0 ${PAPER.shadow}`,
                    }}
                  >
                    Let's Rock!
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Proshows;
