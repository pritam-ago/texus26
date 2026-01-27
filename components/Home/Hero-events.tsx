"use client";

import React, { useEffect, useRef } from "react";

import Image from "next/image";
import { motion } from "framer-motion";

import Link from "next/link";

const Hero = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const scrolled = window.scrollY;
        videoRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3D effect for logo
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!logo) return;

      const { left, top, width, height } = logo.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      const rotateX = (y - 0.5) * 20; // Increased to 20 degrees for more noticeable effect
      const rotateY = (x - 0.5) * 20;

      logo.style.transform = `
        perspective(1000px)
        rotateX(${-rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.1, 1.1, 1.1)
      `;
    };

    const handleMouseLeave = () => {
      logo.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;
    };

    logo.addEventListener("mousemove", handleMouseMove);
    logo.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      logo.removeEventListener("mousemove", handleMouseMove);
      logo.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="w-full relative bg-black h-screen overflow-hidden">
      {/* Video Background */}
      <div
        ref={videoRef}
        className="absolute inset-0 z-10 w-full h-full"
        style={{ willChange: "transform" }}
      >
        <Image
          src={"/assets/hero-bg.webp"}
          alt="Texus26 Hero Background"
          width={1920}
          height={1080}
          quality={100}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Animated Logo */}
      {/* Main Content Container */}
      <div className="absolute inset-0 z-30 flex flex-col justify-center items-center w-full px-4 mt-16 sm:mt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="flex flex-col items-center gap-4 lg:gap-6"
        >
          {/* Logo Section */}
          <div
            ref={logoRef}
            className="transition-transform duration-200 ease-out cursor-pointer relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Image
              src={"/assets/logo-hero-nobg.png"}
              alt="srm-logo"
              width={800}
              height={267}
              className="w-[280px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[650px] scale-110 sm:scale-100"
              priority
            />
          </div>

          {/* Event Phases */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch justify-center w-full max-w-5xl px-2">
            
            {/* Phase 1 */}
            <Link href="/nilgiris" className="group relative w-full md:w-[320px] cursor-pointer block">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-40 group-hover:opacity-80 transition duration-500" />
              <div className="relative flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 p-5 rounded-lg w-full h-full transform transition-transform hover:-translate-y-1 duration-300">
                <span className="text-pink-400 font-montserrat font-bold tracking-[0.2em] text-xs sm:text-sm mb-2 uppercase">Phase 1</span>
                <h3 className="text-2xl sm:text-3xl font-thuast text-white mb-2 text-center tracking-wide">GLOBAL SUMMIT</h3>
                <div className="w-12 h-0.5 bg-pink-500/50 mb-3"></div>
                <div className="flex items-center gap-2 text-white/90 font-montserrat">
                  <span className="text-lg font-medium">FEB 14 & 15</span>
                </div>
              </div>
            </Link>

            {/* Divider (Desktop) */}
            <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/20 to-transparent self-stretch my-2" />

            {/* Phase 2 */}
            <Link href="/events/#events" className="group relative w-full md:w-[320px] cursor-pointer block">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-40 group-hover:opacity-80 transition duration-500" />
              <div className="relative flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 p-5 rounded-lg w-full h-full transform transition-transform hover:-translate-y-1 duration-300">
                <span className="text-purple-400 font-montserrat font-bold tracking-[0.2em] text-xs sm:text-sm mb-2 uppercase">Phase 2</span>
                <h3 className="text-2xl sm:text-3xl font-thuast text-white mb-2 text-center tracking-wide">TEXUS'26</h3>
                 <div className="w-12 h-0.5 bg-purple-500/50 mb-3"></div>
                 <div className="flex items-center gap-2 text-white/90 font-montserrat">
                  <span className="text-lg font-medium">FEB 27 & 28</span>
                </div>
              </div>
            </Link>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
