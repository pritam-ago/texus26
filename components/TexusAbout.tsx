"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EVENTS_THEME = {
  bg: "bg-black",
  cardBg: "bg-black/40",
  border: "border-gray-800",
  text: "text-white",
  textSecondary: "text-white/80",
  accent: "text-purple-500",
  gradient: "from-purple-500 via-pink-500 to-red-500",
};

const Badge = ({
  text,
  tint = "rgba(168,85,247,0.2)",
}: {
  text: string;
  tint?: string;
}) => (
  <motion.span
    whileHover={{ y: -2, rotate: -1 }}
    transition={{ type: "spring", stiffness: 500, damping: 22 }}
    className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-thuast tracking-wide select-none"
    style={{
      background: tint,
      border: "1px solid rgba(168,85,247,0.5)",
      color: "white",
    }}
  >
    {text}
  </motion.span>
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
      className="relative rounded-xl overflow-hidden border backdrop-blur-sm"
      style={{
        background: "rgba(0,0,0,0.6)",
        borderColor: "rgba(168,85,247,0.3)",
      }}
    >
      <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
        <Image src={img} alt={name} fill className="object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(0,0,0,0.2)",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <Badge text={role} tint={tint} />
        </div>

        <h3 className="mt-3 text-lg sm:text-xl font-thuast text-white">
          {name}
        </h3>

        <div className="mt-2 text-sm sm:text-[15px] leading-relaxed text-white/80 font-montserrat">
          {desc}
        </div>
      </div>
    </motion.div>
  );
}

export default function TexusAbout() {
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
    <div className={cn("w-full bg-black")}>
      {/* Main About Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-black" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(168,85,247,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168,85,247,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-120px" }}
            transition={{ duration: 0.55 }}
            className="text-center mb-16"
          >
            <h1 className="text-white text-center font-thuast text-4xl md:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              TEXUS '26
            </h1>
            <div className="flex justify-center mb-6">
              <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
            <p className="text-white/80 text-sm md:text-lg font-montserrat text-center max-w-2xl mx-auto">
              Experience 60+ exhilarating events at Texus Fest! From workshops to coding challenges and much more
            </p>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-120px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl p-6 md:p-10 border backdrop-blur-xl mb-16"
            style={{
              background: "rgba(0,0,0,0.6)",
              borderColor: "rgba(168,85,247,0.3)",
            }}
          >
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-thuast mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                About TEXUS
              </h2>
              <div className="flex justify-center mb-6">
                <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
              <p className="text-white/80 font-montserrat text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
                TEXUS is SRM Institute of Science and Technology's premier technical festival, bringing together
                innovation, creativity, and technology. With over 60 events spanning technical competitions,
                workshops, hackathons, and cultural celebrations, TEXUS provides a platform for students to
                showcase their talents and push the boundaries of what's possible.
              </p>
            </div>
          </motion.div>

          {/* Stats or Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-120px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {[
              { number: "60+", label: "Events", color: "text-purple-400" },
              { number: "1000+", label: "Participants", color: "text-pink-400" },
              { number: "24hrs", label: "Hackathon", color: "text-blue-400" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="rounded-xl p-6 text-center border backdrop-blur-sm"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  borderColor: "rgba(168,85,247,0.2)",
                }}
              >
                <div className={`text-3xl md:text-4xl font-thuast mb-2 ${stat.color}`}>
                  {stat.number}
                </div>
                <div className="text-white/80 font-montserrat text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ORGANIZERS */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-black/50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-120px" }}
            transition={{ duration: 0.55 }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-center font-thuast text-3xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              TEXUS ORGANIZERS
            </h2>
            <div className="flex justify-center mb-4">
              <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>

            <p className="text-white/80 text-sm md:text-base font-montserrat text-center max-w-2xl mx-auto">
              The people who make the fest happen — planning, approvals, chaos
              control, and keeping the vibe alive.
            </p>
          </motion.div>

          {/* Layout: 1 big + 2 side */}
          <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
            {/* Convener (big) */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <PolaroidCard
                role="Convener"
                name="Dr. M. Sakthi Ganesh"
                img="/assets/aboutImg/DeanET.webp"
                tint="rgba(65,159,217,0.2)"
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
                tint="rgba(3,115,140,0.2)"
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
                tint="rgba(140,117,3,0.2)"
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-purple-900/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-120px" }}
            transition={{ duration: 0.55 }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-center font-thuast text-3xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              HEADS OF DEPARTMENTS
            </h2>
            <div className="flex justify-center mb-4">
              <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </motion.div>

          <div className="rounded-xl overflow-hidden border backdrop-blur-xl p-6 md:p-10"
               style={{
                 background: "rgba(0,0,0,0.6)",
                 borderColor: "rgba(168,85,247,0.3)",
               }}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left */}
              <ul className="space-y-4">
                {leftColumnHeads.map((head, idx) => (
                  <motion.li
                    key={`${head.name}-${idx}`}
                    whileHover={{ x: 6, rotate: -0.2 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    className="p-4 rounded-xl border backdrop-blur-sm"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(168,85,247,0.2)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 h-6 w-2 rounded-full"
                        style={{
                          background: idx % 2 ? "#03738C" : "#419FD9",
                        }}
                      />
                      <div>
                        <div className="font-thuast text-base sm:text-lg text-white">
                          {head.name}
                        </div>
                        <div className="text-sm text-white/70 font-montserrat">
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
                    className="p-4 rounded-xl border backdrop-blur-sm"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(168,85,247,0.2)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 h-6 w-2 rounded-full"
                        style={{
                          background: idx % 2 ? "#8C7503" : "#A68160",
                        }}
                      />
                      <div>
                        <div className="font-thuast text-base sm:text-lg text-white">
                          {head.name}
                        </div>
                        <div className="text-sm text-white/70 font-montserrat">
                          {head.department}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}