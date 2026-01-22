"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
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

const EVENTS_THEME = {
  bg: "bg-black/90",
  cardBg: "bg-black/40",
  border: "border-gray-800",
  text: "text-white",
  textSecondary: "text-white/80",
  accent: "text-purple-500",
  gradient: "from-purple-500 via-pink-500 to-red-500",
};

type Sponsor = {
  id: number;
  name?: string;
  logo: string;
  description?: string;
  className?: string;
  link?: string;
};

// Card component for sponsors with events theme
const SponsorCard = ({
  sponsor,
  className,
}: {
  sponsor: Sponsor;
  className?: string;
}) => (
  <motion.div
    whileHover={{ y: -4, rotate: -0.5, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 450, damping: 18 }}
    className="relative rounded-xl overflow-hidden border backdrop-blur-sm w-[160px] h-[140px]"
    style={{
      background: "rgba(0,0,0,0.4)",
      borderColor: "rgba(168,85,247,0.3)",
      boxShadow: "0 0 20px rgba(168,85,247,0.1)",
    }}
  >
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <Image
        src={sponsor.logo}
        alt={sponsor.name || `Sponsor ${sponsor.id}`}
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
}: {
  title: string;
  description: string;
  badgeColor: string;
  badgeText: string;
  sponsors: Sponsor[];
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
      <div className="rounded-xl overflow-hidden border backdrop-blur-sm p-6 md:p-10"
           style={{
             background: "rgba(0,0,0,0.6)",
             borderColor: "rgba(168,85,247,0.3)",
           }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <motion.span
              whileHover={{ y: -2, rotate: -1 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm md:text-base font-thuast tracking-wider"
              style={{
                background: "rgba(168,85,247,0.2)",
                border: "1px solid rgba(168,85,247,0.5)",
                color: "white",
              }}
            >
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{
                  background: badgeColor,
                }}
              />
              {badgeText}
            </motion.span>
          </div>

          <h2
            className="text-3xl md:text-4xl font-thuast mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
          >
            {title}
          </h2>

          <div className="flex justify-center mb-4">
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          <p className="text-base md:text-lg max-w-2xl mx-auto text-white/80 font-montserrat">
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
            <motion.div key={sponsor.id} variants={itemVariants} className="w-[160px] h-[140px]">
              <SponsorCard
                sponsor={sponsor}
                className={sponsor.className}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Current Sponsors Component (2025)
function CurrentSponsors() {
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-120px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-white text-center font-thuast text-4xl md:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          OUR 2025 SPONSORS
        </h1>

        <div className="flex justify-center mb-6">
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>

        <p className="text-white/80 text-sm md:text-lg font-montserrat text-center max-w-2xl mx-auto">
          We extend our deepest gratitude to all our sponsors who have made
          TEXUS possible through their generous support and partnership.
        </p>
      </motion.div>

      <TierSection
        title="Platinum Sponsors"
        description="Our exclusive premier partners making TEXUS 2025 possible"
        badgeText="PLATINUM"
        badgeColor={PAPER.ink}
        sponsors={platinumSponsors2025}
      />

      <TierSection
        title="Gold Sponsors"
        description="Our premium partners who make our event extraordinary"
        badgeText="GOLD"
        badgeColor={PAPER.ink}
        sponsors={goldSponsors2025}
      />

      <TierSection
        title="Silver Sponsors"
        description="Key supporters bringing excellence to our event"
        badgeText="SILVER"
        badgeColor={PAPER.ink}
        sponsors={silverSponsors2025}
      />

      <TierSection
        title="Hackathon Sponsors"
        description="Tech innovators powering our coding challenges and competition"
        badgeText="HACKATHON"
        badgeColor={PAPER.ink}
        sponsors={hackathonSponsors2025}
      />

      <TierSection
        title="Mobility Partner"
        description="Keeping our event connected and accessible"
        badgeText="MOBILITY"
        badgeColor={PAPER.ink}
        sponsors={mobilitySponsors2025}
      />

      <TierSection
        title="Stall Sponsors"
        description="Valued collaborators enriching the event experience"
        badgeText="STALLS"
        badgeColor={PAPER.ink}
        sponsors={stallSponsors2025}
      />

      <TierSection
        title="Gold Sponsors"
        description="Our premium partners who make our event extraordinary"
        badgeText="GOLD"
        badgeColor="#FFD700"
        sponsors={goldSponsors2025}
      />

      <TierSection
        title="Silver Sponsors"
        description="Key supporters bringing excellence to our event"
        badgeText="SILVER"
        badgeColor="#C0C0C0"
        sponsors={silverSponsors2025}
      />

      <TierSection
        title="Hackathon Sponsors"
        description="Tech innovators powering our coding challenges and competition"
        badgeText="HACKATHON"
        badgeColor="#EC4899"
        sponsors={hackathonSponsors2025}
      />

      <TierSection
        title="Mobility Partner"
        description="Keeping our event connected and accessible"
        badgeText="MOBILITY"
        badgeColor="#10B981"
        sponsors={mobilitySponsors2025}
      />

      <TierSection
        title="Stall Sponsors"
        description="Valued collaborators enriching the event experience"
        badgeText="STALLS"
        badgeColor="#03738C"
        sponsors={stallSponsors2025}
      />
    </>
  );
}

// Main TexusSponsors Page Component
export default function TexusSponsors() {
  const pageRef = useRef(null);

  const sponsor2019: Sponsor[] = [
    { id: 1, logo: "/assets/sponsor/image8.png", link: "#" },
    { id: 2, logo: "/assets/sponsor/image7.png", link: "#" },
    { id: 3, logo: "/assets/sponsor/image6.png", link: "#" },
    { id: 4, logo: "/assets/sponsor/image5.png", link: "#" },
    { id: 5, logo: "/assets/sponsor/image4.png", link: "#" },
    { id: 6, logo: "/assets/sponsor/image2.png", link: "#" },
    { id: 7, logo: "/assets/sponsor/image3.png", link: "#" },
  ];



  const sponsor2023: Sponsor[] = [
    { id: 2, logo: "/assets/sponsor/image24.png", link: "#" },
    { id: 3, logo: "/assets/sponsor/image22.png", link: "#" },
    { id: 4, logo: "/assets/sponsor/image23.png", link: "#" },
    { id: 5, logo: "/assets/sponsor/image13.png", link: "#" },
    { id: 6, logo: "/assets/sponsor/image12.png", link: "#" },
    { id: 7, logo: "/assets/sponsor/image11.png", link: "#" },
    { id: 8, logo: "/assets/sponsor/image10.png", link: "#" },
    { id: 9, logo: "/assets/sponsor/image9.png", link: "#" },
  ];

  const sponsor2024: Sponsor[] = [
    { id: 1, logo: "/assets/sponsor/gsl1.jpg", link: "#" },
    { id: 2, logo: "/assets/sponsor/gsl01.png", link: "#" },
    { id: 3, logo: "/assets/sponsor/gsl02.png", link: "#" },
    { id: 4, logo: "/assets/sponsor/gsl03.png", link: "#" },
    { id: 5, logo: "/assets/sponsor/gsl04.png", link: "#" },
    { id: 6, logo: "/assets/sponsor/gsl05.svg", link: "#" },
    { id: 7, logo: "/assets/sponsor/gsl06.png", link: "#" },
    { id: 8, logo: "/assets/sponsor/gsl07.jpg", link: "#" },
    { id: 9, logo: "/assets/sponsor/gsl08.png", link: "#" },
    { id: 10, logo: "/assets/sponsor/gsl09.jpg", link: "#" },
    { id: 11, logo: "/assets/sponsor/gsl10.png", link: "#" },
    { id: 12, logo: "/assets/sponsor/gsl11.jpg", link: "#" },
    { id: 13, logo: "/assets/sponsor/gsl12.png", link: "#" },
    { id: 14, logo: "/assets/sponsor/gsl13.svg", link: "#" },
    { id: 15, logo: "/assets/sponsor/gsl14.png", link: "#" },
    { id: 16, logo: "/assets/sponsor/gsl15.png", link: "#" },
    { id: 17, logo: "/assets/sponsor/gsl16.png", link: "#" },
    { id: 18, logo: "/assets/sponsor/gsl17.png", link: "#" },
    { id: 19, logo: "/assets/sponsor/gsl18.png", link: "#" },
  ];

  return (
    <div ref={pageRef} className="relative min-h-screen bg-black">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Current Sponsors Section */}
        <CurrentSponsors />

        {/* Previous Sponsors Divider */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-120px" }}
          transition={{ duration: 0.6 }}
          className="text-center my-20"
        >
          <h1 className="text-white text-center font-thuast text-4xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            PREVIOUS SPONSORS
          </h1>

          <div className="flex justify-center">
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </motion.div>

        {/* 2024 Sponsors */}
        <TierSection
          title="2024 Sponsors"
          description="Our valued partners who made TEXUS 2024 an incredible success"
          badgeText="2024"
          badgeColor={PAPER.ink}
          sponsors={sponsor2024}
        />

        {/* 2023 Sponsors */}
        <TierSection
          title="2023 Sponsors"
          description="Key supporters who brought excellence to TEXUS 2023"
          badgeText="2023"
          badgeColor={PAPER.ink}
          sponsors={sponsor2023}
        />

        {/* 2019 Sponsors */}
        <TierSection
          title="2019 Sponsors"
          description="Valued collaborators who made TEXUS 2019 possible"
          badgeText="2019"
          badgeColor={PAPER.ink}
          sponsors={sponsor2019}
        />

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-120px" }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="rounded-xl overflow-hidden border backdrop-blur-sm p-8 md:p-12 text-center"
               style={{
                 background: "rgba(0,0,0,0.6)",
                 borderColor: "rgba(168,85,247,0.3)",
               }}>
            <h3 className="text-3xl md:text-4xl font-thuast mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Become a Sponsor
            </h3>

            <div className="flex justify-center mb-6">
              <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>

            <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 text-white/80 font-montserrat">
              Join our community of supporters and gain visibility for your
              brand at one of the most anticipated technical events.
            </p>

            <motion.a
              href="mailto:srmtexus24@gmail.com"
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl font-thuast text-white border border-purple-500/50 bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-300 inline-block text-center"
            >
              Contact Us
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}