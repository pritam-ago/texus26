"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  // AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import CircularGallery from "../ui/CircularGallery";

const departmentData = {
  title: "SRM IST",
  desc: "SRM Institute of Science and Technology, India's educational powerhouse with over 20,000+ students, offers diverse programs in engineering, management, medicine, and humanities. Its dynamic curriculum and global collaborations promise top-tier education. SRMIST's impressive placement record, featuring companies like Adobe, speaks to its excellence. Accredited with an 'A++' grade by NAAC, SRMIST fosters innovation and attracts students from across India.",
  image1: "/assets/deptpics/srmist1.webp",
  image2: "/assets/deptpics/srmist2.webp",
  image3: "/assets/deptpics/srmist3.webp",
};

// const hexagonStyles = `
//   .hexagon-group {
//     position: relative;
//     width: 300px;
//     height: 300px;
//     transition: all 0.3s ease;
//     padding: 30px;
//   }

//   .hexagon-container {
//     width: 200px;
//     height: 200px;
//     position: absolute;
//     transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
//     filter: drop-shadow(0 4px 10px rgba(147, 51, 234, 0.3));
//   }

//   @media (max-width: 1024px) {
//     .hexagon-group {
//       width: 250px;
//       height: 250px;
//       padding: 25px;
//     }
//     .hexagon-container {
//       width: 170px;
//       height: 170px;
//     }
//   }

//   @media (max-width: 640px) {
//     .hexagon-group {
//       width: 200px;
//       height: 200px;
//       padding: 20px;
//     }
//     .hexagon-container {
//       width: 140px;
//       height: 140px;
//     }
//     .hexagon-container.top-left,
//     .hexagon-container.top-right {
//       width: 110px !important;
//       height: 110px !important;
//     }
//   }

//   .hexagon-container.main {
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     z-index: 2;
//     animation: float 4s ease-in-out infinite;
//     filter: drop-shadow(0 8px 16px rgba(236, 72, 153, 0.4));
//   }

//   .hexagon-container.top-left {
//     top: 0;
//     left: -25%;
//     transform: translateY(-20%);
//     animation: floatTopLeft 4s ease-in-out infinite;
//   }

//   .hexagon-container.top-right {
//     top: 0;
//     right: -25%;
//     transform: translateY(-20%);
//     animation: floatTopRight 4s ease-in-out infinite;
//   }

//   .hexagon {
//     position: relative;
//     width: 100%;
//     height: 100%;
//     overflow: visible;
//   }

//   .hexagon::before {
//     content: '';
//     position: absolute;
//     inset: -2px;
//     clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
//     background: linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2));
//     filter: blur(8px);
//     z-index: -1;
//   }

//   .hexagon img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
//     transition: all 0.5s ease;
//     animation: pulse 2s ease-in-out infinite;
//     box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
//   }

//   @keyframes float {
//     0%, 100% {
//       transform: translate(-50%, -50%);
//     }
//     50% {
//       transform: translate(-50%, -60%);
//     }
//   }

//   @keyframes floatTopLeft {
//     0%, 100% {
//       transform: translate(0, -20%);
//     }
//     50% {
//       transform: translate(0, -30%);
//     }
//   }

//   @keyframes floatTopRight {
//     0%, 100% {
//       transform: translate(0, -20%);
//     }
//     50% {
//       transform: translate(0, -30%);
//     }
//   }

//   @keyframes pulse {
//     0%, 100% {
//       transform: scale(1);
//     }
//     50% {
//       transform: scale(1.05);
//     }
//   }
// `;

// Particle animation component
const Particles = ({ className = "" }) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: 0,
          }}
          animate={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const AboutPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLDivElement>(null);
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

  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.95, 0.9]);

  // const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
  //   ref.current?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div ref={containerRef} className="relative scroll-smooth">
      {/* Scroll Indicator */}

      {/* First Section - About TEXUS */}
      <motion.div
        ref={firstSectionRef}
        className="bg-black relative min-h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        style={{ scale }}
      >
        {/* Background Image with parallax */}
        <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
          <Image
            src="/assets/aboutbg.png"
            alt="About Background"
            width={1920}
            height={1080}
            className="object-cover w-screen h-screen opacity-40"
            priority
          />
        </motion.div>

        {/* Move CircularGallery here and adjust z-index */}
        <div className="absolute inset-0 z-10">
          <CircularGallery
            bend={0}
            textColor="#ffffff"
            borderRadius={0.05}
            items={[]}
          />
        </div>

        <Particles />

        <div className="relative z-20 max-w-7xl mx-auto px-0 pt-3 bg-black opacity-75 rounded-2xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, margin: "-100px" }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-thuast bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, margin: "-100px" }}
            >
              ABOUT TEXUS
            </motion.h1>
            <motion.div
              className="max-w-4xl mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, margin: "-100px" }}
            >
              {/* Background Effect */}
              <motion.div
                className="absolute inset-0 -z-10 overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Gradient Orbs */}
                <motion.div
                  className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <motion.div
                  className="absolute w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                {/* Glass Effect Background */}
              </motion.div>

              <p className="text-white/90 text-lg font-montserrat mt-16 md:text-xl leading-relaxed relative z-10 p-8 rounded-2xl">
                TEXUS &apos;26, is the Flagship, International-level tech fest
                organized by the Faculty of Engineering and Technology, SRM IST
                Ramapuram. It is a two-day celebration of innovation and talent,
                set to be held on FEB 27th and 28th, 2026. It features a
                24-hour international-level hackathon, 35+ technical events, 15+
                non-technical competitions, and 7 workshops. Beyond
                competitions, attendees can participate in a blood donation
                camp and an electrifying musical night. More than just a fest, TEXUS
                &apos;26 is a global platform for students to showcase their
                skills and drive innovation.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Gradient Transition Div */}
      <motion.div
        className="absolute left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black/90 -mt-48 z-10"
        style={{ opacity }}
      />

      {/* Second Section - About Department */}
      <motion.div
        ref={secondSectionRef}
        className="min-h-screen relative bg-gradient-to-b from-black/90 to-black overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, margin: "-100px" }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div
            className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: ["0%", "100%", "0%"],
              y: ["0%", "100%", "0%"],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              top: "-20%",
              left: "-20%",
            }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl"
            animate={{
              x: ["100%", "0%", "100%"],
              y: ["0%", "100%", "0%"],
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              bottom: "-20%",
              right: "-20%",
            }}
          />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        <Particles className="opacity-30" />

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
                  <h2 className="text-3xl md:text-4xl font-thuast bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    {departmentData.title}
                  </h2>
                  <p className="text-white/80 font-montserrat leading-relaxed">
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
                        src={departmentData.image1}
                        alt="SRM IST"
                        fill
                        className="object-cover"
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
                          fill
                          className="object-cover"
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
                          src={departmentData.image3}
                          alt="SRM IST"
                          fill
                          className="object-cover"
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

export default AboutPage;
