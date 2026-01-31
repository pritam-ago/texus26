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
        "radial-gradient(circle at center, rgba(242,242,242,0) 0%, rgba(242,242,242,0.45) 62%, rgba(242,242,242,0.95) 100%)",
    }}
  />
);

const Tape = ({
  className = "",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) => (
  <img
    src="/textures/tape.png"
    alt="tape"
    className={cn("absolute w-20 h-auto", className)}
    style={{
      transform: `rotate(${rotate}deg) ${rotate > 0 ? 'scaleX(-1)' : ''}`,
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
    <Tape className="-top-4 left-10" rotate={-2} />
    <Tape className="-top-4 right-10" rotate={2} />
    {children}
  </motion.div>
);

const Badge = ({
  text,
  tint = "rgba(121,166,119,0.3)",
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
      <Tape className="-top-4 left-7" rotate={-6} />
      <Tape className="-top-4 right-7" rotate={6} />

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
       {
    name: "Dr. K. Raja",
    designation: "Professor & Chairperson",
    department: "SCSE",
  },
  {
    name: "Dr. J. Sutha",
    designation: "HoD",
    department: "CSE",
  },
  {
    name: "Dr. N. Sankar Ram",
    designation: "HoD",
    department: "AIML & AI",
  },
  {
    name: "Dr. A. Umamageswari",
    designation: "HoD",
    department: "BDA & CC",
  },
  {
    name: "Dr. J. Shiny Duela",
    designation: "HoD",
    department: "CS & GT",
  },
  {
    name: "Dr. A. Usha Ruby",
    designation: "HoD",
    department: "CSBS & IoT",
  },
  {
    name: "Dr. Rajeswari Mukesh",
    designation: "HoD",
    department: "IT",
  },
  {
    name: "Dr. N. V. S. Sree Rathna Lakshmi",
    designation: "HoD",
    department: "ECE",
  },
  {
    name: "Dr. K. N. Srinivas",
    designation: "HoD",
    department: "EEE",
  },
  {
    name: "Dr. T. Mothilal",
    designation: "HoD",
    department: "Mechanical Engineering",
  },
  {
    name: "Dr. R. Divahar",
    designation: "HoD",
    department: "Civil Engineering",
  },
  {
    name: "Dr. R. V. Hemavathy",
    designation: "HoD",
    department: "Biotechnology",
  },
  {
    name: "Dr. Ushus S. Kumar",
    designation: "HoD",
    department: "Biomedical Engineering",
  },
  {
    name: "Dr. N. Balamurugan",
    designation: "HoD",
    department: "Physics",
  },
  {
    name: "Dr. Helen P. Kavitha",
    designation: "HoD",
    department: "Chemistry",
  },
  {
    name: "Dr. K. G. Nagaradhika",
    designation: "HoD",
    department: "LCS",
  },
  {
    name: "Dr. R. Srinivasan",
    designation: "HoD",
    department: "Mathematics",
  },
    ],
    []
  );

  const leftColumnHeads = departmentHeads.slice(0, 8);
  const rightColumnHeads = departmentHeads.slice(8, 16);
  const lastHead = departmentHeads[16];

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

{/* Convenor Section */}
          <div className="mt-10 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-120px" }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8"
            >
              <h3
                className="text-2xl sm:text-3xl font-extrabold mb-3"
                style={{
                  fontFamily: headingFont,
                  color: PAPER.ink,
                  letterSpacing: "0.04em",
                }}
              >
                CONVENOR
              </h3>
              <div className="flex justify-center">
                <DoodleLine />
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div></div> {/* Empty space for centering */}
              <PolaroidCard
                role="Convenor"
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
              <div></div> {/* Empty space for centering */}
            </div>
          </div>

          {/* Co-Convenor Section */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-120px" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h3
                className="text-2xl sm:text-3xl font-extrabold mb-3"
                style={{
                  fontFamily: headingFont,
                  color: PAPER.ink,
                  letterSpacing: "0.04em",
                }}
              >
                CO-CONVENOR
              </h3>
              <div className="flex justify-center">
                <DoodleLine />
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <PolaroidCard
                role="Co-Convenor"
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
              <PolaroidCard
                role="Co-Convenor"
                name="Dr. K. Raja"
                img="/assets/aboutImg/raja.png"
                tint="rgba(3,115,140,0.14)"
                desc={
                  <>
                    Chair Person
                    <br />
                    SRMIST, Ramapuram, Chennai
                  </>
                }
              />
              <PolaroidCard
                role="Co-Convenor"
                name="Dr. Rama Chaithanya T"
                img="/assets/aboutImg/Rama.jpeg"
                tint="rgba(3,115,140,0.14)"
                desc={
                  <>
                    Vice Principal - Academics
                    <br />
                    SRMIST, Ramapuram, Chennai
                  </>
                }
              />
            </div>
            <div className="flex justify-center mt-6 max-w-5xl mx-auto">
              <div className="w-full sm:w-1/2 lg:w-1/3">
                <PolaroidCard
                  role="Co-Convenor"
                  name="Dr. Roopa M"
                  img="/assets/aboutImg/Roopa.jpeg"
                  tint="rgba(3,115,140,0.14)"
                  desc={
                    <>
                      Vice Principal - Research
                      <br />
                      SRMIST, Ramapuram, Chennai
                    </>
                  }
                />
              </div>
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
             ORGANISING COMMITTEE
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
                            background: idx % 2 ? PAPER.lightAccent : PAPER.accent,
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
                            background: idx % 2 ? PAPER.accent : PAPER.lightAccent,
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

              {/* Centered last item - Dr. R. Srinivasan */}
              <div className="flex justify-center mt-4">
                <motion.li
                  whileHover={{ x: 6, rotate: 0.2 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  className="p-4 rounded-2xl w-full md:w-1/2"
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
                        background: PAPER.accent,
                        border: `2px solid ${PAPER.ink}`,
                        boxShadow: `2px 2px 0 ${PAPER.shadow}`,
                      }}
                    />
                    <div>
                      <div
                        className="font-extrabold text-base sm:text-lg"
                        style={{ fontFamily: headingFont, color: PAPER.ink }}
                      >
                        {lastHead.name}
                      </div>
                      <div
                        className="text-sm"
                        style={{
                          fontFamily: bodyFont,
                          color: "rgba(18,56,89,0.78)",
                        }}
                      >
                        {lastHead.department}
                      </div>
                    </div>
                  </div>
                </motion.li>
              </div>
            </PaperPanel>
          </div>
        </div>
      </section>
    </div>
  );
}