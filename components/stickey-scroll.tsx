"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AllModels from "./Models/AllModels";
import { Canvas } from "@react-three/fiber";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: React.ReactNode | string;
    content?: React.ReactNode | string;
    color: string;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    target: ref,
    // container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map(
      (_, index) => (index / cardLength) * 0.8
    );
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = ["bg-black", "bg-black", "bg-black", "bg-black"];
  const linearGradients = ["transparent", "transparent", "transparent"];

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="h-full flex w-full relative rounded-md"
      ref={ref}
    >
      <section className="px-6 md:p-16 lg:py-32 max-w-7xl mx-auto flex w-full h-full">
        <div className="div flex h-full items-start w-full lg:w-1/2">
          <div className="w-full">
            {content.map((item, index) => (
              <div key={item.title + index} className={`mb-20 mt-4`}>
                <motion.h2
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                  }}
                  className={`text-2xl font-montserrat ${item.color}`}
                >
                  {item.title}
                </motion.h2>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                  }}
                  className={`text-lg max-w-sm mt-6 text-justify`}
                >
                  {item.description}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        <motion.div
          animate={{
            background: linearGradients[activeCard % linearGradients.length],
          }}
          className={cn(
            "hidden lg:block h-[32rem] lg:w-1/2 rounded-md bg-white !sticky top-36 overflow-hidden",
            contentClassName
          )}
        >
          {content[activeCard]?.content || (
            <Canvas
              camera={{
                position: [
                  -0.9958009305814268, 0.9639528671992462, 3.3880125928512967,
                ],
              }}
            >
              <ambientLight intensity={2} />
              <AllModels activeCard={activeCard} />
            </Canvas>
          )}
        </motion.div>
      </section>
    </motion.div>
  );
};
