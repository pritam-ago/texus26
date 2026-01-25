"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  PAPER,
  headingFont,
  bodyFont,
  Tape,
  DoodleLine,
  PaperBase,
  Vignette,
} from "@/components/PaperComponents";

// Updated PaperPanel to match Hero section style (simple border)
const PaperPanel = ({
  children,
  className = "",
  hover = true,
  tint,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  tint?: string;
}) => (
  <motion.div
    whileHover={
      hover
        ? {
            scale: 1.02,
            rotateZ: 1,
            boxShadow: `12px 12px 0 ${PAPER.shadow}`,
          }
        : undefined
    }
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={cn("relative p-6 sm:p-8 rounded-2xl", className)}
    style={{
      background: tint || `${PAPER.bg} url("/textures/paper.png")`,
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `8px 8px 0 ${PAPER.shadow}`,
    }}
  >
    {children}
  </motion.div>
);

// Updated InkBadge to match Hero section style (simple border)
const InkBadge = ({ text, color }: { text: string; color: string }) => (
  <motion.span
    whileHover={{ y: -2, rotate: -1 }}
    transition={{ type: "spring", stiffness: 500, damping: 22 }}
    className="inline-flex items-center px-4 py-2 rounded-full text-sm md:text-base font-extrabold tracking-wide select-none"
    style={{
      background: color,
      border: `2px solid ${PAPER.ink}`,
      boxShadow: `3px 3px 0 ${PAPER.shadow}`,
      color: PAPER.ink,
      fontFamily: headingFont,
    }}
  >
    {text}
  </motion.span>
);

type Sponsor = {
  id: number;
  name: string;
  logo: string;
  description?: string;
  className?: string;
};

// Updated SponsorCard to match Hero section style (simple border)
const SponsorCard = ({
  sponsor,
  className,
  darkBg = false,
}: {
  sponsor: Sponsor;
  className?: string;
  darkBg?: boolean;
}) => (
  <motion.div
    whileHover={{
      y: -4,
      rotate: -0.5,
      boxShadow: `10px 10px 0 ${PAPER.shadow}`,
    }}
    transition={{ type: "spring", stiffness: 450, damping: 18 }}
    className="relative rounded-xl overflow-hidden"
    style={{
      background: darkBg ? "#1a1a1a" : PAPER.white,
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `6px 6px 0 ${PAPER.shadow}`,
      width: "160px",
      height: "140px",
    }}
  >
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <Image
        src={sponsor.logo}
        alt={sponsor.name}
        width={140}
        height={140}
        className={cn("object-contain max-w-full max-h-full", className)}
      />
    </div>
  </motion.div>
);

const TierSection = ({
  title,
  description,
  badgeColor,
  badgeText,
  sponsors,
  darkBg = false,
}: {
  title: string;
  description: string;
  badgeColor: string;
  badgeText: string;
  sponsors: Sponsor[];
  darkBg?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <PaperPanel className="p-6 md:p-10" hover={false}>
        <Tape
          className="-top-4 left-10"
          rotate={-2}
        />
        <Tape
          className="-top-4 right-10"
          rotate={2}
        />

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <InkBadge text={badgeText} color={badgeColor} />
          </div>

          <h2
            className="text-3xl md:text-4xl font-extrabold mb-3"
            style={{
              fontFamily: headingFont,
              color: PAPER.ink,
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </h2>

          <div className="flex justify-center mb-4">
            <DoodleLine />
          </div>

          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: bodyFont,
              color: "rgba(18,56,89,0.85)",
            }}
          >
            {description}
          </p>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {sponsors.map((sponsor) => (
            <motion.div key={sponsor.id} variants={itemVariants}>
              <SponsorCard
                sponsor={sponsor}
                className={sponsor.className}
                darkBg={darkBg}
              />
            </motion.div>
          ))}
        </motion.div>
      </PaperPanel>
    </motion.div>
  );
};

export default function CurrentSponsor() {
  const platinumSponsors2025: Sponsor[] = [
    {
      id: 1,
      name: "SRM AXIS",
      logo: "/assets/sponsors205/platinum/SRM AXIS.png",
    },
    {
      id: 2,
      name: "CUB",
      logo: "/assets/sponsors205/platinum/cub logo.jpg",
    },
  ];

  const goldSponsors2025: Sponsor[] = [
    {
      id: 1,
      name: "2IIM",
      logo: "/assets/sponsors205/gold/2IIM.png",
    },
    {
      id: 2,
      name: "GLOBAL",
      logo: "/assets/sponsors205/gold/GLOBAL.png",
    },
  ];

  const silverSponsors2025: Sponsor[] = [
    {
      id: 1,
      name: "Codetantra",
      logo: "/assets/sponsors205/silver/codetantra_logo.png",
    },
    {
      id: 2,
      name: "Company",
      logo: "/assets/sponsors205/silver/Company logo.png",
    },
    {
      id: 3,
      name: "Johnson Lifts",
      logo: "/assets/sponsors205/silver/johnson lifts.png",
    },
    {
      id: 4,
      name: "Lotus Logistics",
      logo: "/assets/sponsors205/silver/Lotus Logistics .jpg",
    },
    {
      id: 5,
      name: "Prince Pictures",
      logo: "/assets/sponsors205/silver/Prince Pictures .png",
    },
    {
      id: 6,
      name: "DK Microgreens",
      logo: "/assets/sponsors205/stall/DKmicrogreens.PNG",
    },
    {
      id: 7,
      name: "Savorit",
      logo: "/assets/sponsors205/silver/savorit.png",
    },
  ];

  const hackathonSponsors2025: Sponsor[] = [
    {
      id: 1,
      name: "CoinEx Wallet",
      logo: "/assets/sponsors205/hackathon/Coinex-wallet.webp",
      className: "invert",
    },
    {
      id: 2,
      name: "Kanini",
      logo: "/assets/sponsors205/hackathon/kan-logo.webp",
    },
    {
      id: 3,
      name: "Risein",
      logo: "/assets/sponsors205/hackathon/Risein.png",
    },
    {
      id: 4,
      name: "EduChain",
      logo: "/assets/sponsors205/hackathon/EduChain.png",
    },
    {
      id: 5,
      name: "Offblack",
      logo: "/assets/sponsors205/hackathon/Offblack.png",
    },
  ];

  const mobilitySponsors2025: Sponsor[] = [
    {
      id: 1,
      name: "Taxina",
      logo: "/assets/sponsors205/mobility/taxina.jpg",
    },
  ];

  const stallSponsors2025: Sponsor[] = [
    { id: 1, name: "JP Digital", logo: "/assets/sponsors205/stall/jpdigital.png" },
    { id: 2, name: "Aadhi", logo: "/assets/sponsors205/stall/Aadhi_logo.png" },
    { id: 3, name: "Aayna", logo: "/assets/sponsors205/stall/Aayna Logo.png" },
    { id: 4, name: "Bharath Steel", logo: "/assets/sponsors205/stall/Bharath Steel Industries -Logo.jpg" },
    { id: 5, name: "Chem Flow", logo: "/assets/sponsors205/stall/Chem Flow Tool and Tubes_Logo.jpg" },
    { id: 6, name: "Precision", logo: "/assets/sponsors205/stall/Precision instruments.png" },
    { id: 7, name: "TVS", logo: "/assets/sponsors205/stall/Tvs.jpeg" },
    { id: 8, name: "Genex India", logo: "/assets/sponsors205/stall/Genex India .jpg" },
    { id: 9, name: "Saranya", logo: "/assets/sponsors205/stall/Saranya Cakes and Bracelets .jpg" },
    { id: 10, name: "India Metal", logo: "/assets/sponsors205/stall/India Metal_Logo.jpg" },
    { id: 11, name: "Priyanka Granites", logo: "/assets/sponsors205/stall/Priyanka Granites and Marbles_Logo.jpg" },
    { id: 12, name: "India Labs", logo: "/assets/sponsors205/stall/India Labs Tec -Logo.jpg" },
    { id: 13, name: "Selva Balaji", logo: "/assets/sponsors205/stall/selva balaji.jpg" },
    { id: 14, name: "Daphene", logo: "/assets/sponsors205/stall/Daphene infotech.jpg" },
    { id: 15, name: "Shutter Scape", logo: "/assets/sponsors205/stall/SHUTTER SCAPE.jpg" },
    { id: 16, name: "Nimalan", logo: "/assets/sponsors205/stall/nimalan_logo.jpeg" },
    { id: 17, name: "Glowware", logo: "/assets/sponsors205/stall/GLowware_logo.jpeg" },
    { id: 18, name: "Sashtii", logo: "/assets/sponsors205/stall/Sashtii_stall.jpeg" },
    { id: 19, name: "V CAD", logo: "/assets/sponsors205/stall/v cad.jpg" },
    { id: 20, name: "Healthy Soul", logo: "/assets/sponsors205/stall/Healthy Soul Logo jpg.jpg" },
    { id: 21, name: "Narayana", logo: "/assets/sponsors205/stall/narayana schools.jpg" },
    { id: 22, name: "Second Derm", logo: "/assets/sponsors205/stall/second derm.jpg" },
    { id: 23, name: "MK", logo: "/assets/sponsors205/stall/mk.jpg" },
    { id: 24, name: "GSM", logo: "/assets/sponsors205/stall/GSM.jpeg" },
    { id: 25, name: "Teaching Academy", logo: "/assets/sponsors205/stall/The teaching Academy.jpeg" },
    { id: 26, name: "VITA AQUA", logo: "/assets/sponsors205/stall/vitaaqua.jpg" },
    { id: 27, name: "Sponsor K", logo: "/assets/sponsors205/stall/sponsork.png" },
    { id: 28, name: "Local Tiffin", logo: "/assets/sponsors205/stall/local-tiffin-service.jpg" },
    { id: 29, name: "Thirumalai", logo: "/assets/sponsors205/stall/thirumalai-chemicals.jpg" },
    { id: 30, name: "MJP", logo: "/assets/sponsors205/stall/mjp.jpg" },
    { id: 31, name: "C2 Chicken", logo: "/assets/sponsors205/stall/c2chicken.jpg" },
    { id: 32, name: "Crave Cave", logo: "/assets/sponsors205/stall/cravecave.jpg" },
    { id: 33, name: "Dumpling House", logo: "/assets/sponsors205/stall/dumpling-house.jpg" },
    { id: 34, name: "Kadambur", logo: "/assets/sponsors205/stall/kadambur.jpg" },
    { id: 35, name: "Madras Momos", logo: "/assets/sponsors205/stall/madras-momos.png" },
    { id: 36, name: "Pagee", logo: "/assets/sponsors205/stall/pagee.jpg" },
    { id: 37, name: "Pixo", logo: "/assets/sponsors205/stall/pixo.jpg" },
    { id: 38, name: "PKS Brownie", logo: "/assets/sponsors205/stall/pks-brownie.jpg" },
    { id: 39, name: "Safe", logo: "/assets/sponsors205/stall/safe.png" },
    { id: 40, name: "Sparkling Sky", logo: "/assets/sponsors205/stall/sparkling-sky.jpg" },
    { id: 41, name: "Uni-Brownies", logo: "/assets/sponsors205/stall/uni-brownies.jpg" },
    { id: 42, name: "Waffle Cart", logo: "/assets/sponsors205/stall/waffle-cart.jpg" },
    { id: 43, name: "Sri Aragiah", logo: "/assets/sponsors205/stall/sri-arangiah.png" },
    { id: 44, name: "Behalf", logo: "/assets/sponsors205/stall/behalf.jpg" },
    { id: 45, name: "EZEESHIPPING", logo: "/assets/sponsors205/stall/ EZEESHIPPING SOLUTIONS PVT LTD.jpg" },
    { id: 46, name: "Shringa", logo: "/assets/sponsors205/stall/shringa.png" },
    { id: 47, name: "Big Bird", logo: "/assets/sponsors205/stall/bigbird.jpg" },
    { id: 48, name: "Queen Of Grill", logo: "/assets/sponsors205/stall/queenofgrill.jpg" },
    { id: 49, name: "Checkpoint", logo: "/assets/sponsors205/stall/checkpoint.jpg" },
    { id: 50, name: "Pitfall", logo: "/assets/sponsors205/stall/pitfall.jpg" },
    { id: 51, name: "Linksus", logo: "/assets/sponsors205/stall/linksus.png" },
  ];

  return (
    <div className="relative min-h-screen">
      <PaperBase />
      <Vignette />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-120px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4"
            style={{
              fontFamily: headingFont,
              color: PAPER.ink,
              letterSpacing: "0.06em",
              textShadow: "2px 2px 0 rgba(14,42,68,0.15)",
            }}
          >
            Our 2025 Sponsors
          </h1>

          <div className="flex justify-center mb-6">
            <DoodleLine />
          </div>

          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: bodyFont,
              color: "rgba(18,56,89,0.85)",
            }}
          >
            We extend our deepest gratitude to all our sponsors who have made
            TEXUS possible through their generous support and partnership.
          </p>
        </motion.div>

        <TierSection
          title="Platinum Sponsors"
          description="Our exclusive premier partners making TEXUS 2025 possible"
          badgeText="PLATINUM"
          badgeColor={PAPER.accent}
          sponsors={platinumSponsors2025}
        />

        <TierSection
          title="Gold Sponsors"
          description="Our premium partners who make our event extraordinary"
          badgeText="GOLD"
          badgeColor={PAPER.accent}
          sponsors={goldSponsors2025}
        />

        <TierSection
          title="Silver Sponsors"
          description="Key supporters bringing excellence to our event"
          badgeText="SILVER"
          badgeColor={PAPER.accent}
          sponsors={silverSponsors2025}
        />

        <TierSection
          title="Hackathon Sponsors"
          description="Tech innovators powering our coding challenges and competition"
          badgeText="HACKATHON"
          badgeColor={PAPER.accent}
          sponsors={hackathonSponsors2025}
          darkBg={true}
        />

        <TierSection
          title="Mobility Partner"
          description="Keeping our event connected and accessible"
          badgeText="MOBILITY"
          badgeColor={PAPER.accent}
          sponsors={mobilitySponsors2025}
          darkBg={true}
        />

        <TierSection
          title="Stall Sponsors"
          description="Valued collaborators enriching the event experience"
          badgeText="STALLS"
          badgeColor={PAPER.accent}
          sponsors={stallSponsors2025}
        />
      </div>
    </div>
  );
}