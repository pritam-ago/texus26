"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  PAPER,
  headingFont,
  bodyFont,
  Tape,
  CardTree,
  DoodleLine,
  PaperBase,
} from "@/components/PaperComponents";

/* ---------------- Polaroid Card ---------------- */
const SpeakerCard = ({
  src,
  name,
  designation,
}: {
  src: string;
  name: string;
  designation: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -8, rotate: 2, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="relative mx-4 flex-shrink-0 w-56"
    >
      <Tape className="-top-4 left-1/4 z-20" rotate={-6} />

      <div
        className="p-3 rounded-xl"
        style={{
          background: PAPER.white,
          border: `3px solid ${PAPER.ink}`,
          boxShadow: `8px 8px 0 ${PAPER.shadow}`,
        }}
      >
        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
          <Image src={src} alt={name} fill className="object-cover" />
        </div>

        <div className="mt-3 text-center">
          <h3
            className="text-sm font-extrabold"
            style={{ fontFamily: headingFont, color: PAPER.ink }}
          >
            {name}
          </h3>
          <p
            className="text-xs mt-1 leading-snug"
            style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.8)" }}
          >
            {designation}
          </p>
        </div>

        <CardTree className="absolute bottom-1 left-1" side="left" size={34} />
        <CardTree className="absolute bottom-1 right-1" side="right" size={34} />
      </div>
    </motion.div>
  );
};

/* ---------------- Auto Scroll Row ---------------- */
const ScrollRow = ({
  items,
  reverse = false,
}: {
  items: any[];
  reverse?: boolean;
}) => {
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden w-full py-10">
      <div
        className={`flex w-max ${
          reverse ? "animate-scroll-reverse" : "animate-scroll"
        } hover:[animation-play-state:paused]`}
      >
        {loop.map((s, i) => (
          <SpeakerCard key={i} {...s} />
        ))}
      </div>

      <style jsx>{`
        .animate-scroll {
          animation: scrollX 28s linear infinite;
        }
        .animate-scroll-reverse {
          animation: scrollX 28s linear infinite reverse;
        }
        @keyframes scrollX {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

/* ---------------- Main Section ---------------- */
export default function DelegateSpeakersPaper() {
  const speakers = [
    {
      src: "/guests/Shakthivel.png",
      name: "Padma Shri Dr. A. Sakthivel",
      designation: "Founder, Poppys Group",
    },
    {
      src: "/guests/Pavankumar.png",
      name: "Thiru. Pavankumar G Giriyappanavar, IAS",
      designation: "District Collector, Coimbatore",
    },
    {
      src: "/guests/Muruganathan.png",
      name: "Dr. A. Muruganathan",
      designation: "President, TN Medical Council",
    },
    {
      src: "/guests/Madhura.png",
      name: "R. Madhura",
      designation: "District Project Director, TNSRLM",
    },
    {
      src: "/guests/Balaji.png",
      name: "Dr. B. Balaji, IFS",
      designation: "Secretary, NBA",
    },
    {
      src: "/guests/Soundrapandi.png",
      name: "Dr. J. Soundrapandi",
      designation: "National Biodiversity Authority",
    },
    {
      src: "/guests/Annadurai.png",
      name: "Thiru. S. Annadurai, C.L.S.",
      designation: "Director, Tribal Welfare Dept",
    },
    {
      src: "/guests/Komahan.png",
      name: "Thiru. R. Komahan",
      designation: "Joint Director, Tamil Virtual Academy",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-white/40 backdrop-blur-sm">
      {/* Background */}
      <PaperBase />

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4">
        
        {/* TITLE – TOP */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-6xl font-extrabold"
            style={{
              fontFamily: headingFont,
              color: PAPER.ink,
              letterSpacing: "0.06em",
            }}
          >
            DELEGATE SPEAKERS
          </h2>
          <div className="flex justify-center mt-4">
            <DoodleLine />
          </div>
        </div>

        {/* LEFT SCROLL */}
        <ScrollRow items={speakers.slice(0, 4)} />

        {/* RIGHT SCROLL */}
        <ScrollRow items={speakers.slice(4)} reverse />
      </div>
    </section>
  );
}