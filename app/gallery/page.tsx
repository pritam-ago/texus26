"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const PAPER = {
  bg: "#F7F4EE",
  ink: "#123859",
  accent: "#419FD9",
  teal: "#03738C",
  olive: "#8C7503",
  sand: "#A68160",
  shadow: "#0E2A44",
  white: "#FFFFFF",
  purple: "#8B5CF6",
  pink: "#EC4899",
  green: "#10B981",
};

const headingFont =
  "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', 'Kalam', ui-rounded, system-ui)";
const bodyFont =
  "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)";

const PaperBase = () => (
  <div
    className="fixed inset-0"
    style={{
      background: `${PAPER.bg} url('/textures/paper.png')`,
      backgroundRepeat: "repeat",
    }}
  />
);

const Vignette = () => (
  <div
    className="fixed inset-0 pointer-events-none"
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
    className={cn("absolute rounded-md z-10", className)}
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
    className={cn("h-[6px] w-28 sm:w-32 md:w-40 rounded-full", className)}
    style={{
      background: PAPER.accent,
      transform: "rotate(-2deg)",
      boxShadow: `3px 3px 0 ${PAPER.shadow}`,
      border: `2px solid ${PAPER.ink}`,
    }}
  />
);

const InkBadge = ({ text, color }: { text: string; color: string }) => (
  <motion.span
    whileHover={{ y: -2, rotate: -1 }}
    transition={{ type: "spring", stiffness: 500, damping: 22 }}
    className="inline-flex items-center px-4 py-2 rounded-full text-sm md:text-base font-extrabold tracking-wide select-none"
    style={{
      background: "rgba(247,244,238,0.9)",
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `4px 4px 0 ${PAPER.shadow}`,
      color: PAPER.ink,
      fontFamily: headingFont,
    }}
  >
    <span
      className="inline-block w-3 h-3 rounded-full mr-2"
      style={{
        background: color,
        border: `2px solid ${PAPER.ink}`,
        boxShadow: `1px 1px 0 ${PAPER.shadow}`,
      }}
    />
    {text}
  </motion.span>
);

const PolaroidCard = ({
  src,
  alt,
  rotate = 0,
}: {
  src: string;
  alt: string;
  rotate?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotate: rotate }
          : { opacity: 0, y: 30, rotate: 0 }
      }
      whileHover={{ y: -10, rotate: rotate + 2, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group"
      style={{ rotate: `${rotate}deg` }}
    >
      {/* Tape on top */}
      <Tape
        className="-top-3 left-1/4 h-5 w-16"
        rotate={-6}
        tint="rgba(166,129,96,0.4)"
      />

      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: PAPER.white,
          border: `4px solid ${PAPER.ink}`,
          boxShadow: `8px 8px 0 ${PAPER.shadow}`,
          padding: "12px",
        }}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "linear-gradient(180deg, rgba(247,244,238,0.1), rgba(247,244,238,0.3))",
            }}
          />
        </div>

        {/* Caption area */}
        <div
          className="mt-3 text-center"
          style={{
            fontFamily: bodyFont,
            color: PAPER.ink,
            fontSize: "0.75rem",
            opacity: 0.7,
          }}
        >
          TEXUS Memories
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({
  title,
  subtitle,
  badgeText,
  badgeColor,
}: {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeColor: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 px-4"
    >
      <div className="flex justify-center mb-4">
        <InkBadge text={badgeText} color={badgeColor} />
      </div>

      <h2
        className="text-3xl md:text-5xl font-extrabold mb-4"
        style={{
          fontFamily: headingFont,
          color: PAPER.ink,
          letterSpacing: "0.05em",
          textShadow: "2px 2px 0 rgba(14,42,68,0.1)",
        }}
      >
        {title}
      </h2>

      <div className="flex justify-center mb-4">
        <DoodleLine />
      </div>

      <p
        className="text-base md:text-lg max-w-2xl mx-auto italic"
        style={{
          fontFamily: bodyFont,
          color: "rgba(18,56,89,0.85)",
        }}
      >
        {subtitle}
      </p>
    </motion.div>
  );
};

// Random rotation generator
const getRandomRotation = (index: number) => {
  const rotations = [-4, -2, 0, 2, 4, -3, 3, -1, 1];
  return rotations[index % rotations.length];
};

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  const hackathon2025 = [
    { src: "/assets/gallery-hackathon/hackathon1.jpg", alt: "Hackathon 1" },
    { src: "/assets/gallery-hackathon/hackathon2.jpg", alt: "Hackathon 2" },
    { src: "/assets/gallery-hackathon/hackathon7.jpg", alt: "Hackathon 3" },
    { src: "/assets/gallery-hackathon/hackathon4.jpg", alt: "Hackathon 4" },
    { src: "/assets/gallery-hackathon/hackathon5.jpg", alt: "Hackathon 5" },
    { src: "/assets/gallery-hackathon/hackathon6.jpg", alt: "Hackathon 6" },
    { src: "/assets/gallery-hackathon/hackathon3.jpg", alt: "Hackathon 7" },
    { src: "/assets/gallery-hackathon/hackathon8.jpg", alt: "Hackathon 8" },
    { src: "/assets/gallery-hackathon/hackathon9.jpg", alt: "Hackathon 9" },
  ];

  const walkathon2025 = [
    { src: "/assets/gallery-assets/walkathon/walkathon1.jpg", alt: "Walkathon 1" },
    { src: "/assets/gallery-assets/walkathon/walkathon2.jpg", alt: "Walkathon 2" },
    { src: "/assets/gallery-assets/walkathon/walkathon3.jpg", alt: "Walkathon 3" },
    { src: "/assets/gallery-assets/walkathon/walkathon4.jpg", alt: "Walkathon 4" },
    { src: "/assets/gallery-assets/walkathon/walkathon5.jpg", alt: "Walkathon 5" },
    { src: "/assets/gallery-assets/walkathon/walkathon6.jpg", alt: "Walkathon 6" },
    { src: "/assets/gallery-assets/walkathon/walkathon7.jpg", alt: "Walkathon 7" },
    { src: "/assets/gallery-assets/walkathon/walkathon8.jpg", alt: "Walkathon 8" },
    { src: "/assets/gallery-assets/walkathon/walkathon9.jpg", alt: "Walkathon 9" },
  ];

  const bloodDonation2025 = [
    { src: "/assets/gallery-assets/blooddonation/BD1.jpg", alt: "Blood Donation 1" },
    { src: "/assets/gallery-assets/blooddonation/BD2.jpg", alt: "Blood Donation 2" },
    { src: "/assets/gallery-assets/blooddonation/BD3.jpg", alt: "Blood Donation 3" },
    { src: "/assets/gallery-assets/blooddonation/BD4.jpg", alt: "Blood Donation 4" },
    { src: "/assets/gallery-assets/blooddonation/BD5.jpg", alt: "Blood Donation 5" },
    { src: "/assets/gallery-assets/blooddonation/BD6.jpg", alt: "Blood Donation 6" },
    { src: "/assets/gallery-assets/blooddonation/BD7.jpg", alt: "Blood Donation 7" },
    { src: "/assets/gallery-assets/blooddonation/BD8.jpg", alt: "Blood Donation 8" },
    { src: "/assets/gallery-assets/blooddonation/BD9.jpg", alt: "Blood Donation 9" },
  ];

  const galaRemastered2025 = [
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-1.png", alt: "Gala 1" },
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-2.png", alt: "Gala 2" },
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-3.jpg", alt: "Gala 3" },
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-4.png", alt: "Gala 4" },
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-5.png", alt: "Gala 5" },
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-6.jpg", alt: "Gala 6" },
  ];

  const flashmob2025 = [
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(1).JPG", alt: "Flashmob 1" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(2).JPG", alt: "Flashmob 2" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(3).JPG", alt: "Flashmob 3" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(4).JPG", alt: "Flashmob 4" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(5).JPG", alt: "Flashmob 5" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(6).JPG", alt: "Flashmob 6" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(7).JPG", alt: "Flashmob 7" },
  ];

  const hackathonImages2024 = [
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (1).jpeg", alt: "2024 Hackathon 1" },
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (2).jpeg", alt: "2024 Hackathon 2" },
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (3).jpeg", alt: "2024 Hackathon 3" },
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (4).jpeg", alt: "2024 Hackathon 4" },
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (5).jpeg", alt: "2024 Hackathon 5" },
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (6).jpeg", alt: "2024 Hackathon 6" },
  ];

  const galaImages2024 = [
    { src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (1).jpeg", alt: "2024 Gala 1" },
    { src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (2).jpeg", alt: "2024 Gala 2" },
    { src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (3).jpeg", alt: "2024 Gala 3" },
    { src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (4).jpeg", alt: "2024 Gala 4" },
  ];

  // Generate 2023 images array
  const texus2023 = Array.from({ length: 20 }, (_, i) => ({
    src: `/assets/gallery-assets/texus-2k23/texus-2k23 (${i + 1}).jpg`,
    alt: `TEXUS 2023 ${i + 1}`,
  }));

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <PaperBase />
      <Vignette />

      {/* Floating doodles background */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full"
            style={{
              background: PAPER.accent,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              border: `2px solid ${PAPER.ink}`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6"
            style={{
              fontFamily: headingFont,
              color: PAPER.ink,
              letterSpacing: "0.06em",
              textShadow: "3px 3px 0 rgba(14,42,68,0.15)",
            }}
          >
            Memory Scrapbook
          </h1>
          <div className="flex justify-center mb-6">
            <DoodleLine />
          </div>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{
              fontFamily: bodyFont,
              color: "rgba(18,56,89,0.85)",
            }}
          >
            Moments captured, memories preserved—flipping through the pages of TEXUS history
          </p>
        </motion.div>

        {/* TEXUS 2025 HACKATHON */}
        <section className="mb-32">
          <SectionHeader
            title="TEXUS 2025 Hackathon"
            subtitle="Code your ideas, create the future, conquer challenges, and innovate endlessly!"
            badgeText="2025"
            badgeColor={PAPER.purple}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hackathon2025.map((image, index) => (
              <PolaroidCard
                key={index}
                src={image.src}
                alt={image.alt}
                rotate={getRandomRotation(index)}
              />
            ))}
          </div>
        </section>

        {/* TEXUS 2025 WALKATHON */}
        <section className="mb-32">
          <SectionHeader
            title="TEXUS 2025 Walkathon"
            subtitle="Steps of solidarity, miles of purpose—students walk together for a common cause"
            badgeText="2025"
            badgeColor={PAPER.green}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {walkathon2025.map((image, index) => (
              <PolaroidCard
                key={index}
                src={image.src}
                alt={image.alt}
                rotate={getRandomRotation(index)}
              />
            ))}
          </div>
        </section>

        {/* BLOOD DONATION */}
        <section className="mb-32">
          <SectionHeader
            title="Blood Donation Campaign"
            subtitle="A drop of blood, a moment of hope"
            badgeText="2025"
            badgeColor={PAPER.pink}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bloodDonation2025.map((image, index) => (
              <PolaroidCard
                key={index}
                src={image.src}
                alt={image.alt}
                rotate={getRandomRotation(index)}
              />
            ))}
          </div>
        </section>

        {/* GALA REMASTERED */}
        <section className="mb-32">
          <SectionHeader
            title="TEXUS 2025 Gala Remastered"
            subtitle="When students come together, magic happens"
            badgeText="2025"
            badgeColor={PAPER.accent}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galaRemastered2025.map((image, index) => (
              <PolaroidCard
                key={index}
                src={image.src}
                alt={image.alt}
                rotate={getRandomRotation(index)}
              />
            ))}
          </div>
        </section>

        {/* FLASHMOB / LAUNCH */}
        <section className="mb-32">
          <SectionHeader
            title="TEXUS 2025 Launch"
            subtitle="Where rhythm meets unity—students come together to create unforgettable moments"
            badgeText="2025"
            badgeColor={PAPER.olive}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flashmob2025.map((image, index) => (
              <PolaroidCard
                key={index}
                src={image.src}
                alt={image.alt}
                rotate={getRandomRotation(index)}
              />
            ))}
          </div>
        </section>

        {/* 2024 HACKATHON */}
        <section className="mb-32">
          <SectionHeader
            title="TEXUS 2K24 Hackathon"
            subtitle="Where innovation meets code—teams collaborate, compete, and create solutions that shape the future"
            badgeText="2024"
            badgeColor={PAPER.teal}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hackathonImages2024.map((image, index) => (
              <PolaroidCard
                key={index}
                src={image.src}
                alt={image.alt}
                rotate={getRandomRotation(index)}
              />
            ))}
          </div>
        </section>

        {/* 2024 GALA */}
        <section className="mb-32">
          <SectionHeader
            title="TEXUS 2K24 Gala"
            subtitle="A night of celebration, connection, and unforgettable memories"
            badgeText="2024"
            badgeColor={PAPER.sand}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {galaImages2024.map((image, index) => (
              <PolaroidCard
                key={index}
                src={image.src}
                alt={image.alt}
                rotate={getRandomRotation(index)}
              />
            ))}
          </div>
        </section>

        {/* 2023 */}
        <section className="mb-20">
          <SectionHeader
            title="TEXUS 2K23"
            subtitle="Where it all began—celebrating the legacy of innovation and community"
            badgeText="2023"
            badgeColor={PAPER.accent}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {texus2023.map((image, index) => (
              <PolaroidCard
                key={index}
                src={image.src}
                alt={image.alt}
                rotate={getRandomRotation(index)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}