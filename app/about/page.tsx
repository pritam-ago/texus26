"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AboutPage from "@/components/Home/AboutComponent";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const PAPER = {
  bg: "#F7F4EE",
  ink: "#123859",
  accent: "#419FD9",
  teal: "#03738C",
  olive: "#8C7503",
  sand: "#A68160",
  shadow: "#0E2A44",
  white: "#FFFFFF",
};

const headingFont =
  "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', 'Kalam', ui-rounded, system-ui)";
const bodyFont =
  "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)";

const PaperBase = ({ className = "" }: { className?: string }) => (
  <div
    className={cn("absolute inset-0", className)}
    style={{
      background: `${PAPER.bg} url('/textures/paper.png')`,
      backgroundRepeat: "repeat",
    }}
  />
);

const Vignette = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        "radial-gradient(circle at center, rgba(247,244,238,0) 0%, rgba(247,244,238,0.45) 62%, rgba(247,244,238,0.95) 100%)",
    }}
  />
);

const Tape = ({
  className = "",
  rotate = 0,
  tint = "rgba(166,129,96,0.35)",
}: {
  className?: string;
  rotate?: number;
  tint?: string;
}) => (
  <div
    className={cn("absolute rounded-md", className)}
    style={{
      background: tint,
      border: `2px solid ${PAPER.ink}`,
      transform: `rotate(${rotate}deg)`,
      boxShadow: `2px 2px 0 rgba(14,42,68,0.15)`,
    }}
  />
);

const DoodleLine = ({ className = "" }: { className?: string }) => (
  <div
    className={cn("h-[6px] w-28 sm:w-36 md:w-44 rounded-full", className)}
    style={{
      background: PAPER.accent,
      transform: "rotate(-2deg)",
      boxShadow: `3px 3px 0 ${PAPER.shadow}`,
      border: `2px solid ${PAPER.ink}`,
    }}
  />
);

const PaperPanel = ({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) => (
  <motion.div
    whileHover={hover ? { y: -6, rotate: -0.2 } : undefined}
    transition={{ type: "spring", stiffness: 420, damping: 22 }}
    className={cn("relative rounded-2xl", className)}
    style={{
      background: `${PAPER.bg} url('/textures/paper.png')`,
      border: `4px solid ${PAPER.ink}`,
      boxShadow: `10px 10px 0 ${PAPER.shadow}`,
    }}
  >
    <Tape className="-top-3 left-10 h-6 w-24" rotate={-2} />
    <Tape className="-top-3 right-10 h-6 w-24" rotate={2} />
    {children}
  </motion.div>
);

const Badge = ({
  text,
  tint = "rgba(65,159,217,0.14)",
}: {
  text: string;
  tint?: string;
}) => (
  <span
    className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold tracking-wide select-none"
    style={{
      fontFamily: headingFont,
      background: tint,
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `4px 4px 0 ${PAPER.shadow}`,
      color: PAPER.ink,
    }}
  >
    {text}
  </span>
);

function PolaroidCard({
  role,
  name,
  desc,
  img,
  tint,
}: {
  role: string;
  name: string;
  desc: React.ReactNode;
  img: string;
  tint: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -8, rotate: -0.6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="relative"
    >
      <Tape className="-top-2 left-7 h-5 w-16" rotate={-6} />
      <Tape className="-top-2 right-7 h-5 w-16" rotate={6} />

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: PAPER.white,
          border: `4px solid ${PAPER.ink}`,
          boxShadow: `12px 12px 0 ${PAPER.shadow}`,
        }}
      >
        <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
          <Image src={img} alt={name} fill className="object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(247,244,238,0.20)",
              mixBlendMode: "multiply",
            }}
          />
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            <Badge text={role} tint={tint} />
          </div>

          <h3
            className="mt-3 text-lg sm:text-xl font-extrabold"
            style={{ fontFamily: headingFont, color: PAPER.ink }}
          >
            {name}
          </h3>

          <div
            className="mt-2 text-sm sm:text-[15px] leading-relaxed"
            style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.86)" }}
          >
            {desc}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Page() {
  const departmentHeads = useMemo(
    () => [
      { name: "Dr. J. Sutha", department: "CSE" },
      { name: "Dr. Sankar Ram", department: "AIML & AI" },
      { name: "Dr. J. Shiny Duela", department: "CS & GT" },
      { name: "Dr. A. Umamageswari", department: "BDA & CC" },
      { name: "Dr. Usha Ruby", department: "IoT & CSBS" },
      { name: "Dr. Rajeswari Mukesh", department: "IT" },
      { name: "Dr. N. V. S. Sree Rathna Lakshmi", department: "ECE" },
      { name: "Dr. Srinivasan", department: "EEE" },
      { name: "Dr. Mathivanan", department: "MECH" },
      { name: "Dr. Senthil Velan", department: "Civil" },
      { name: "Dr. Archana Hari", department: "Biotechnology" },
      { name: "Dr. Ushus", department: "Bio Medical" },
      { name: "Dr. Rema", department: "EFL" },
      { name: "Dr. Balamurugan", department: "Physics" },
      { name: "Dr. Shakila Sathish", department: "Maths" },
      { name: "Dr. Helen P Kavitha", department: "Chemistry" },
    ],
    []
  );

  const leftColumnHeads = departmentHeads.slice(0, 8);
  const rightColumnHeads = departmentHeads.slice(8);

  return (
    <div className={cn("w-full", montserrat.variable)}>
      {/* Your paper-themed About component */}
      <div className="min-h-screen">
        <AboutPage />
      </div>

      {/* ORGANIZERS */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <PaperBase />
        <Vignette />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-120px" }}
            transition={{ duration: 0.55 }}
            className="text-center"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              style={{
                fontFamily: headingFont,
                color: PAPER.ink,
                letterSpacing: "0.06em",
                textShadow: "2px 2px 0 rgba(14,42,68,0.12)",
              }}
            >
              TEXUS ORGANIZERS
            </h2>
            <div className="mt-3 flex justify-center">
              <DoodleLine />
            </div>

            <p
              className="mt-4 max-w-3xl mx-auto text-sm sm:text-base"
              style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.82)" }}
            >
              The people who make the fest happen — planning, approvals, chaos
              control, and keeping the vibe alive.
            </p>
          </motion.div>

          {/* Layout: 1 big + 2 side */}
          <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-start">
            {/* Convener (big) */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <PolaroidCard
                role="Convener"
                name="Dr. M. Sakthi Ganesh"
                img="/assets/aboutImg/DeanET.webp"
                tint="rgba(65,159,217,0.16)"
                desc={
                  <>
                    Dean – Engineering and Technology
                    <br />
                    SRMIST, Ramapuram, Chennai
                  </>
                }
              />
            </div>

            {/* Co conveners */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              <PolaroidCard
                role="Co-Convener"
                name="Dr. Raja Kothandaraman"
                img="/assets/aboutImg/raja1.png"
                tint="rgba(3,115,140,0.14)"
                desc={
                  <>
                    Chairperson – School of Computer Science and Engineering
                    <br />
                    SRMIST, Ramapuram, Chennai
                  </>
                }
              />

              <PolaroidCard
                role="Co-Convener"
                name="Dr. Balika J. Chelliah"
                img="/assets/aboutImg/vp.webp"
                tint="rgba(140,117,3,0.14)"
                desc={
                  <>
                    Vice Principal – Admin
                    <br />
                    SRMIST, Ramapuram, Chennai
                  </>
                }
              />
            </div>
          </div>

         
        </div>
      </section>

      {/* HODS */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <PaperBase />
        <Vignette />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-120px" }}
            transition={{ duration: 0.55 }}
            className="text-center"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              style={{
                fontFamily: headingFont,
                color: PAPER.ink,
                letterSpacing: "0.06em",
              }}
            >
              HEADS OF DEPARTMENTS
            </h2>
            <div className="mt-3 flex justify-center">
              <DoodleLine />
            </div>
          </motion.div>

          <div className="mt-10">
            <PaperPanel className="p-6 md:p-10" hover={false}>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left */}
                <ul className="space-y-4">
                  {leftColumnHeads.map((head, idx) => (
                    <motion.li
                      key={`${head.name}-${idx}`}
                      whileHover={{ x: 6, rotate: -0.2 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                      className="p-4 rounded-2xl"
                      style={{
                        background: "rgba(255,255,255,0.45)",
                        border: `3px solid rgba(18,56,89,0.20)`,
                        boxShadow: `6px 6px 0 rgba(14,42,68,0.12)`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-1 h-6 w-2 rounded-full"
                          style={{
                            background: idx % 2 ? PAPER.teal : PAPER.accent,
                            border: `2px solid ${PAPER.ink}`,
                            boxShadow: `2px 2px 0 ${PAPER.shadow}`,
                          }}
                        />
                        <div>
                          <div
                            className="font-extrabold text-base sm:text-lg"
                            style={{ fontFamily: headingFont, color: PAPER.ink }}
                          >
                            {head.name}
                          </div>
                          <div
                            className="text-sm"
                            style={{
                              fontFamily: bodyFont,
                              color: "rgba(18,56,89,0.78)",
                            }}
                          >
                            {head.department}
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                {/* Right */}
                <ul className="space-y-4">
                  {rightColumnHeads.map((head, idx) => (
                    <motion.li
                      key={`${head.name}-${idx}`}
                      whileHover={{ x: 6, rotate: 0.2 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                      className="p-4 rounded-2xl"
                      style={{
                        background: "rgba(255,255,255,0.45)",
                        border: `3px solid rgba(18,56,89,0.20)`,
                        boxShadow: `6px 6px 0 rgba(14,42,68,0.12)`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-1 h-6 w-2 rounded-full"
                          style={{
                            background: idx % 2 ? PAPER.olive : PAPER.sand,
                            border: `2px solid ${PAPER.ink}`,
                            boxShadow: `2px 2px 0 ${PAPER.shadow}`,
                          }}
                        />
                        <div>
                          <div
                            className="font-extrabold text-base sm:text-lg"
                            style={{ fontFamily: headingFont, color: PAPER.ink }}
                          >
                            {head.name}
                          </div>
                          <div
                            className="text-sm"
                            style={{
                              fontFamily: bodyFont,
                              color: "rgba(18,56,89,0.78)",
                            }}
                          >
                            {head.department}
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </PaperPanel>
          </div>
        </div>
      </section>
    </div>
  );
}
