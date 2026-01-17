"use client";
import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import SeparatorLine from "../ui/SeparatorLine";

// Lazy load the Particles component since it's visually optional
const Particles = lazy(() => import("./ParticlesComponent"));

const departmentData = {
  title: "SRM IST",
  desc: "SRM Institute of Science and Technology, India's educational powerhouse with over 20,000+ students, offers diverse programs in engineering, management, medicine, and humanities. Its dynamic curriculum and global collaborations promise top-tier education. SRMIST's impressive placement record, featuring companies like Adobe, speaks to its excellence. Accredited with an 'A++' grade by NAAC, SRMIST fosters innovation and attracts students from across India.",
  image1: "/assets/deptpics/5.webp",
  image2: "/assets/deptpics/image.png",
  image3: "/assets/deptpics/gsl1.webp",
};

const Aboutdept = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.5, 0]);

  // Using client-side only rendering instead of isMounted state
  return (
    <div ref={containerRef} className="relative scroll-smooth bg-black">
      {/* <SeparatorLine /> */}
      {/* Scroll Indicator */}
      {/* Gradient Transition Div */}
      <motion.div
        className="absolute left-0 right-0 h-48   from-transparent to-black/90 -mt-48 z-10"
        style={{ opacity }}
      />
      {/* Second Section - About Department */}
      <motion.div
        ref={secondSectionRef}
        className="min-h-fit relative bg-gradient-to-b from-black/90 to-black overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, margin: "-100px" }}
      >
        {/* Lazy load particles with fallback */}
        <Suspense fallback={<div className="absolute inset-0 opacity-10" />}>
          <Particles reduced={true} className="opacity-30" />
        </Suspense>

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <Card className="bg-black/40 backdrop-blur-sm border-0">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: false, margin: "-100px" }}
                >
                  <h2 className="text-3xl md:text-4xl text-justify font-thuast bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    {departmentData.title}
                  </h2>
                  <p className="text-white/80 md:text-xl text-justify font-montserrat leading-relaxed">
                    {departmentData.desc}
                  </p>
                </motion.div>
                <motion.div
                  className="relative aspect-square"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: false, margin: "-100px" }}
                >
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <motion.div
                      className="relative overflow-hidden rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 20 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      viewport={{ once: false }}
                    >
                      <Image
                        src={departmentData.image3}
                        alt="SRM IST"
                        width={1920}
                        height={1080}
                        className="h-full object-cover"
                        priority={false}
                      />
                    </motion.div>
                    <div className="grid gap-4">
                      <motion.div
                        className="relative overflow-hidden rounded-lg aspect-square"
                        whileHover={{ scale: 1.05 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        viewport={{ once: false }}
                      >
                        <Image
                          src={departmentData.image2}
                          alt="SRM IST"
                          width={1920}
                          height={1080}
                          className="h-full object-cover"
                        />
                      </motion.div>
                      <motion.div
                        className="relative overflow-hidden rounded-lg aspect-square"
                        whileHover={{ scale: 1.05 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        viewport={{ once: false }}
                      >
                        <Image
                          src={departmentData.image1}
                          alt="SRM IST"
                          width={1920}
                          height={1080}
                          className="h-full object-cover"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed left-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
        style={{
          scaleX: smoothProgress,
          transformOrigin: "0%",
        }}
      />
    </div>
  );
};

export default Aboutdept;
