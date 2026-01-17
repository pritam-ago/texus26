"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { FaStar, FaMedal, FaStore, FaCar } from "react-icons/fa";
import { AiFillGold, AiFillTrophy } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { cn } from "@/lib/utils";

// Define TypeScript types
type SponsorTier = "gold" | "silver" | "stall" | "platinum" | "all" | "green";

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  description?: string;
  className?: string;
}

interface TierShowcaseProps {
  title: string;
  description: string;
  color: "gold" | "silver" | "blue" | "platinum" | "purple" | "green";
  sponsors: Sponsor[];
}

interface SponsorCardProps {
  sponsor: Sponsor;
  tier:
    | SponsorTier
    | "gold"
    | "silver"
    | "blue"
    | "platinum"
    | "purple"
    | "green";
  featured?: boolean;
  className?: string;
}

const CurrentSponsor: React.FC = () => {
  const pageRef = useRef(null);

  const platinumSponsors2025: Sponsor[] = [
    {
      id: 1,
      name: "SRM AXIS",
      logo: "/assets/sponsors205/platinum/SRM AXIS.png",
      description:
        "Premium educational partnership advancing technological excellence",
    },
    {
      id: 2,
      name: "CUB",
      logo: "/assets/sponsors205/platinum/cub logo.jpg",
      description:
        "Premium educational partnership advancing technological excellence",
    },
  ];

  // Sponsor data
  const goldSponsors2025: Sponsor[] = [
    {
      id: 1,
      name: "2IIM",
      logo: "/assets/sponsors205/gold/2IIM.png",
      description:
        "Leading educational institution with exceptional training programs",
    },
    {
      id: 2,
      name: "GLOBAL",
      logo: "/assets/sponsors205/gold/GLOBAL.png",
      description: "Worldwide innovation leader in technology solutions",
    },
  ];

  const silverSponsors2025: Sponsor[] = [
    {
      id: 1,
      name: "Codetantra",
      logo: "/assets/sponsors205/silver/codetantra_logo.png",
      description:
        "Interactive coding platform transforming technical education",
    },
    {
      id: 2,
      name: "Company",
      logo: "/assets/sponsors205/silver/Company logo.png",
      description: "Industry leader providing innovative solutions",
    },
    {
      id: 3,
      name: "Johnson Lifts",
      logo: "/assets/sponsors205/silver/johnson lifts.png",
      description: "Premier elevator and escalator manufacturer",
    },
    {
      id: 4,
      name: "Lotus Logistics",
      logo: "/assets/sponsors205/silver/Lotus Logistics .jpg",
      description: "Comprehensive logistics and supply chain solutions",
    },
    {
      id: 5,
      name: "Prince Pictures",
      logo: "/assets/sponsors205/silver/Prince Pictures .png",
      description: "Creative production house delivering visual excellence",
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

    // {
    //   id: 7,
    //   name: "Webcrafters",
    //   logo: "/assets/sponsors205/silver/webcrafters.jpeg",
    // },
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

    // {
    //   id: 3,
    //   name: "Devfolio",
    //   logo: "/assets/sponsors205/hackathon/devfolio.webp",
    // },
    // {
    //   id: 4,
    //   name: "EthIndia",
    //   logo: "/assets/sponsors205/hackathon/ethindiawhite.svg",
    // },
    // {
    //   id: 5,
    //   name: "Polygon",
    //   logo: "/assets/sponsors205/hackathon/polygon.webp",
    //   className: "invert",
    // },
  ];

  const mobilitySponsors2025: Sponsor[] = [
    {
      id: 1,
      name: "Taxina",
      logo: "/assets/sponsors205/mobility/taxina.jpg",
      className: "rounded-full",
    },
  ];

  const stallSponsors2025: Sponsor[] = [
    {
      id: 1,
      name: "JP Digital",
      logo: "/assets/sponsors205/stall/jpdigital.png",
    },
    { id: 2, name: "Aadhi", logo: "/assets/sponsors205/stall/Aadhi_logo.png" },
    { id: 3, name: "Aayna", logo: "/assets/sponsors205/stall/Aayna Logo.png" },
    {
      id: 4,
      name: "Bharath Steel Industries",
      logo: "/assets/sponsors205/stall/Bharath Steel Industries -Logo.jpg",
    },
    {
      id: 5,
      name: "Chem Flow Tool and Tubes",
      logo: "/assets/sponsors205/stall/Chem Flow Tool and Tubes_Logo.jpg",
    },
    {
      id: 6,
      name: "Precision Instruments",
      logo: "/assets/sponsors205/stall/Precision instruments.png",
    },
    {
      id: 7,
      name: "TVS",
      logo: "/assets/sponsors205/stall/Tvs.jpeg",
    },
    // {
    //   id: 8,
    //   name: "DK Microgreens",
    //   logo: "/assets/sponsors205/stall/DKmicrogreens.PNG",
    // },
    {
      id: 9,
      name: "Genex India",
      logo: "/assets/sponsors205/stall/Genex India .jpg",
    },
    {
      id: 10,
      name: "Saranya Cakes and Bracelets",
      logo: "/assets/sponsors205/stall/Saranya Cakes and Bracelets .jpg",
    },
    {
      id: 11,
      name: "India Metal",
      logo: "/assets/sponsors205/stall/India Metal_Logo.jpg",
    },
    {
      id: 12,
      name: "Priyanka Granites and Marbles",
      logo: "/assets/sponsors205/stall/Priyanka Granites and Marbles_Logo.jpg",
    },
    {
      id: 13,
      name: "India Labs Tec",
      logo: "/assets/sponsors205/stall/India Labs Tec -Logo.jpg",
    },
    {
      id: 14,
      name: "Selva Balaji",
      logo: "/assets/sponsors205/stall/selva balaji.jpg",
    },
    {
      id: 15,
      name: "Daphene Infotech",
      logo: "/assets/sponsors205/stall/Daphene infotech.jpg",
    },
    {
      id: 16,
      name: "Shutter Scape",
      logo: "/assets/sponsors205/stall/SHUTTER SCAPE.jpg",
    },
    {
      id: 17,
      name: "Nimalan",
      logo: "/assets/sponsors205/stall/nimalan_logo.jpeg",
    },
    {
      id: 18,
      name: "GLowware",
      logo: "/assets/sponsors205/stall/GLowware_logo.jpeg",
    },
    {
      id: 19,
      name: "Sashtii",
      logo: "/assets/sponsors205/stall/Sashtii_stall.jpeg",
    },
    {
      id: 20,
      name: "V CAD",
      logo: "/assets/sponsors205/stall/v cad.jpg",
    },
    {
      id: 21,
      name: "Healthy Soul",
      logo: "/assets/sponsors205/stall/Healthy Soul Logo jpg.jpg",
    },
    {
      id: 22,
      name: "Narayana Schools",
      logo: "/assets/sponsors205/stall/narayana schools.jpg",
    },
    {
      id: 23,
      name: "Second Derm",
      logo: "/assets/sponsors205/stall/second derm.jpg",
    },
    {
      id: 24,
      name: "MK",
      logo: "/assets/sponsors205/stall/mk.jpg",
    },
    {
      id: 25,
      name: "GSM",
      logo: "/assets/sponsors205/stall/GSM.jpeg",
    },
    {
      id: 26,
      name: "The Teaching Academy",
      logo: "/assets/sponsors205/stall/The teaching Academy.jpeg",
    },
    {
      id: 27,
      name: "VITA AQUA",
      logo: "/assets/sponsors205/stall/vitaaqua.jpg",
    },
    {
      id: 28,
      name: "Sponsor K",
      logo: "/assets/sponsors205/stall/sponsork.png",
    },
    {
      id: 29,
      name: "Local Tiffin Service",
      logo: "/assets/sponsors205/stall/local-tiffin-service.jpg",
    },
    {
      id: 30,
      name: "Thirumalai Chemicals Ltd",
      logo: "/assets/sponsors205/stall/thirumalai-chemicals.jpg",
    },
    {
      id: 31,
      name: "MJP Publishers",
      logo: "/assets/sponsors205/stall/mjp.jpg",
    },
    {
      id: 32,
      name: "C2 Chicken",
      logo: "/assets/sponsors205/stall/c2chicken.jpg",
    },
    {
      id: 33,
      name: "Crave Cave",
      logo: "/assets/sponsors205/stall/cravecave.jpg",
    },
    {
      id: 34,
      name: "Dumpling House",
      logo: "/assets/sponsors205/stall/dumpling-house.jpg",
    },
    {
      id: 35,
      name: "Kadambur",
      logo: "/assets/sponsors205/stall/kadambur.jpg",
    },
    {
      id: 36,
      name: "Madras Momos",
      logo: "/assets/sponsors205/stall/madras-momos.png",
    },
    {
      id: 37,
      name: "Pagee",
      logo: "/assets/sponsors205/stall/pagee.jpg",
    },
    {
      id: 38,
      name: "Pixo",
      logo: "/assets/sponsors205/stall/pixo.jpg",
    },
    {
      id: 39,
      name: "PKS Brownie",
      logo: "/assets/sponsors205/stall/pks-brownie.jpg",
    },
    {
      id: 40,
      name: "Safe",
      logo: "/assets/sponsors205/stall/safe.png",
    },
    {
      id: 41,
      name: "Sparkling Sky",
      logo: "/assets/sponsors205/stall/sparkling-sky.jpg",
    },
    {
      id: 42,
      name: "Uni-Brownies",
      logo: "/assets/sponsors205/stall/uni-brownies.jpg",
    },
    {
      id: 43,
      name: "Waffle Cart",
      logo: "/assets/sponsors205/stall/waffle-cart.jpg",
    },
    {
      id: 44,
      name: "Sri Aragiah",
      logo: "/assets/sponsors205/stall/sri-arangiah.png",
    },
    {
      id: 45,
      name: "Behalf",
      logo: "/assets/sponsors205/stall/behalf.jpg",
    },
    {
      id: 46,
      name: "EZEESHIPPING SOLUTIONS",
      logo: "/assets/sponsors205/stall/ EZEESHIPPING SOLUTIONS PVT LTD.jpg",
      description: "Innovative shipping and logistics solutions provider",
    },
    {
      id: 47,
      name: "Shringa",
      logo: "/assets/sponsors205/stall/shringa.png",
      description: "Innovative shipping and logistics solutions provider",
    },
    {
      id: 48,
      name: "big Bird",
      logo: "/assets/sponsors205/stall/bigbird.jpg",
      description: "Innovative shipping and logistics solutions provider",
    },
    {
      id: 49,
      name: "Queen Of Grill",
      logo: "/assets/sponsors205/stall/queenofgrill.jpg",
      description: "Innovative shipping and logistics solutions provider",
    },
    {
      id: 50,
      name: "Checkpoint",
      logo: "/assets/sponsors205/stall/checkpoint.jpg",
      description: "Innovative shipping and logistics solutions provider",
    },
    {
      id: 51,
      name: "Pitfall",
      logo: "/assets/sponsors205/stall/pitfall.jpg",
      description: "Innovative shipping and logistics solutions provider",
    },
    {
      id: 52,
      name: "linksus",
      logo: "/assets/sponsors205/stall/linksus.png",
      description: "Innovative shipping and logistics solutions provider",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto md:py-20 p-4">
      <div className="text-center mb-16 w-full">
        <h1 className="text-5xl md:text-6xl font-bangers text-white mb-6 tracking-tight leading-none">
          <span className="font-bangers tracking-wider">Our 2025</span>{" "}
          <span className="font-mont font-bold text-amber-500">Sponsors</span>
        </h1>

        <div className="w-40 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8"></div>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto font-montserrat font-light leading-relaxed">
          We extend our deepest gratitude to all our sponsors who have made
          TEXUS possible through their generous support and partnership.
        </p>
      </div>

      {/* Platinum Sponsors Section */}
      <TierShowcase
        title="Platinum Sponsors"
        description="Our exclusive premier partners making TEXUS 2025 possible"
        color="platinum"
        sponsors={platinumSponsors2025}
      />

      {/* Gold Sponsors Section */}
      <TierShowcase
        title="Gold Sponsors"
        description="Our premium partners who make our event extraordinary"
        color="gold"
        sponsors={goldSponsors2025}
      />

      {/* Silver Sponsors Section */}
      <TierShowcase
        title="Silver Sponsors"
        description="Key supporters bringing excellence to our event"
        color="silver"
        sponsors={silverSponsors2025}
      />

      {/* Hackathon Sponsors Section */}
      <TierShowcase
        title="Hackathon Sponsors"
        description="Tech innovators powering our coding challenges and competition"
        color="purple"
        sponsors={hackathonSponsors2025}
      />

      {/* Mobility Sponsors Section */}
      <TierShowcase
        title="Mobility Partner"
        description="Tech innovators powering our coding challenges and competition"
        color="green"
        sponsors={mobilitySponsors2025}
      />

      {/* Stall Sponsors Section */}
      <TierShowcase
        title="Stall Sponsors"
        description="Valued collaborators enriching the event experience"
        color="blue"
        sponsors={stallSponsors2025}
      />
    </div>
  );
};

// Tier showcase component
const TierShowcase: React.FC<TierShowcaseProps> = ({
  title,
  description,
  color,
  sponsors,
}) => {
  const tierColors = {
    platinum:
      "from-purple-700/30 via-slate-400/20 to-transparent border-slate-300/40 text-slate-100",
    gold: "from-amber-700/30 via-amber-600/20 to-transparent border-amber-600/30 text-amber-500",
    silver:
      "from-slate-600/30 via-slate-500/20 to-transparent border-slate-500/30 text-slate-300",
    blue: "from-indigo-700/30 via-indigo-600/20 to-transparent border-indigo-600/30 text-indigo-400",
    green:
      "from-green-700/30 via-green-600/20 to-transparent border-green-600/30 text-green-400",
    purple:
      "from-fuchsia-700/30 via-pink-600/20 to-transparent border-pink-600/30 text-pink-400",
  };

  const colorClass = tierColors[color];

  // Using React Icons instead of inline SVGs
  const iconMap = {
    platinum: <FaStar className="w-7 h-7 mr-2 text-slate-100" />,
    gold: <AiFillTrophy className="w-7 h-7 mr-2 text-amber-500" />,
    silver: <FaMedal className="w-7 h-7 mr-2 text-slate-300" />,
    blue: <FaStore className="w-7 h-7 mr-2 text-indigo-400" />,
    green: <FaCar className="w-7 h-7 mr-2 text-green-400" />,
    purple: <BsStars className="w-7 h-7 mr-2 text-pink-400" />,
  };

  return (
    <div
      className={`mb-24 rounded-2xl border bg-gradient-to-r ${colorClass} p-8 relative overflow-hidden shadow-lg`}
    >
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 w-64 h-64 opacity-10 blur-3xl rounded-full bg-white"></div>
      <div className="absolute -left-20 -bottom-20 w-48 h-48 opacity-5 blur-3xl rounded-full bg-white"></div>

      {/* Header - Centered */}
      <div className="text-center mb-10 relative">
        <div className="flex items-center justify-center mb-3">
          {iconMap[color]}
          <h2
            className={`text-3xl md:text-4xl font-bangers tracking-wide ${
              colorClass.split(" ").find((cls) => cls.startsWith("text-")) || ""
            }`}
          >
            {title}
          </h2>
        </div>

        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-4"></div>

        {/* Section description */}
        <p className="text-gray-300 max-w-2xl mx-auto font-montserrat font-light leading-relaxed">
          {description}
        </p>
      </div>

      {/* All sponsors in one centered flex container */}
      <div className="flex flex-wrap justify-center items-stretch gap-8 px-4">
        {sponsors.map((sponsor) => (
          <SponsorCard
            key={sponsor.id}
            sponsor={sponsor}
            tier={color as SponsorTier}
            className={sponsor.className}
          />
        ))}
      </div>
    </div>
  );
};

// Updated sponsor card component to match page.tsx styling
const SponsorCard: React.FC<SponsorCardProps> = ({
  sponsor,
  tier,
  className,
}) => {
  const tierStyles = {
    platinum: "border-slate-300/40",
    gold: "border-amber-600/40",
    silver: "border-slate-400/40",
    blue: "border-indigo-500/40",
    green: "border-green-600/40",
    stall: "border-indigo-500/40",
    purple: "border-pink-600/40",
  };

  return (
    <div
      className={`bg-black/50 backdrop-blur-sm rounded-xl border ${
        tierStyles[tier as keyof typeof tierStyles]
      } shadow-lg p-4 flex items-center justify-center w-48 transition-all duration-300`}
      style={{ height: 140 }}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <Image
          src={sponsor.logo}
          alt={sponsor.name || `Sponsor ${sponsor.id}`}
          width={160}
          height={160}
          loading="lazy"
          className={cn("object-contain max-w-full max-h-full", className)}
        />
      </div>
    </div>
  );
};

export default CurrentSponsor;
