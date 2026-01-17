"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div
      className={cn("items-start overflow-y-hidden w-full", className)}
      ref={gridRef}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-52 px-10"
        ref={gridRef}
      >
        <div className="grid gap-10">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }} // Apply the translateY motion value here
              key={"grid-1" + idx}
              whileHover={{ scale: 1.05, rotateX: 10, rotateY: 10 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "bg-gray-900 shadow-lg transition-shadow duration-300",
                "hover:shadow-[0_0_15px_rgba(99,102,241,0.6)]",
                "hover:shadow-[0_0_20px_rgba(255,105,180,0.8), 0_0_30px_rgba(0,255,255,0.8), 0_0_40px_rgba(255,255,0,0.8)]"
              )}
            >
              <Image
                src={el}
                className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <motion.div
              style={{ y: translateSecond }}
              key={"grid-2" + idx}
              whileHover={{ scale: 1.05, rotateX: 10, rotateY: 10 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "bg-gray-900 shadow-lg transition-shadow duration-300",
                "hover:shadow-[0_0_15px_rgba(99,102,241,0.6)]",
                "hover:shadow-[0_0_20px_rgba(255,105,180,0.8), 0_0_30px_rgba(0,255,255,0.8), 0_0_40px_rgba(255,255,0,0.8)]"
              )}
            >
              <Image
                src={el}
                className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <motion.div
              style={{ y: translateThird }}
              key={"grid-3" + idx}
              whileHover={{ scale: 1.05, rotateX: 10, rotateY: 10 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "bg-gray-900 shadow-lg transition-shadow duration-300",
                "hover:shadow-[0_0_15px_rgba(99,102,241,0.6)]",
                "hover:shadow-[0_0_20px_rgba(255,105,180,0.8), 0_0_30px_rgba(0,255,255,0.8), 0_0_40px_rgba(255,255,0,0.8)]"
              )}
            >
              <Image
                src={el}
                className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};