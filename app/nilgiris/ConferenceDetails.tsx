"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sprout,
  HeartPulse,
  Zap,
  Globe,
  Calendar,
  MapPin,
  Video,
  Download,
  ExternalLink,
} from "lucide-react";

const ConferenceDetails = ({
  detailsRef,
}: {
  detailsRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <motion.div
      key="conference"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      ref={detailsRef}
      className="w-full"
    >
      <div className="w-full bg-gradient-to-b from-[#0f1c15] via-[#1a2e1f] to-[#0f1c15] rounded-[3rem] p-4 md:p-12 lg:p-20 shadow-2xl border border-white/5 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#76A665]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#1a2e1f]/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-24">
          {/* About / Hero */}
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="inline-block"
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-thuast tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] drop-shadow-sm">
                Rising with Nilgiris
              </h2>
              <p className="text-xl md:text-2xl text-[#76A665] font-montserrat mt-2 font-medium tracking-wide">
                Accelerating Sustainable Development Goals
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-[#FFD700]/20 rounded-full text-[#FFD700]">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-white/50 text-xs uppercase tracking-wider font-montserrat">
                    Dates
                  </p>
                  <p className="text-white font-bold text-lg font-montserrat">
                    Feb 14-15, 2026
                  </p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-[#76A665]/20 rounded-full text-[#76A665]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-white/50 text-xs uppercase tracking-wider font-montserrat">
                    Location
                  </p>
                  <p className="text-white font-bold text-lg font-montserrat">
                    Merlis Hotel Coimbatore
                  </p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors md:col-span-2 lg:col-span-1">
                <div className="p-3 bg-blue-400/20 rounded-full text-blue-400">
                  <Video className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-white/50 text-xs uppercase tracking-wider font-montserrat">
                    Mode
                  </p>
                  <p className="text-white font-bold text-lg font-montserrat">
                    Hybrid Presentation
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left space-y-6 max-w-5xl mx-auto bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 backdrop-blur-sm mt-12">
              <h3 className="text-3xl font-bold text-[#FFD700] font-thuast tracking-wide mb-2">
                About the Conference
              </h3>
              <div className="space-y-4 text-white/80 font-montserrat leading-relaxed text-justify">
                <p>
                  <span className="font-bold text-white">
                    Rising with the Nilgiris to Accelerate SDGs – International
                    Conference 2026
                  </span>{" "}
                  is a multidisciplinary global forum dedicated to advancing the
                  United Nations Sustainable Development Goals (SDGs) through
                  technology-driven innovation, inclusive development, and
                  international collaboration. Hosted in the ecologically
                  sensitive and culturally rich Nilgiris region, the conference
                  convenes researchers, technologists, policymakers, industry
                  leaders, educators, conservation experts, and community
                  stakeholders to address critical sustainability challenges at
                  global and regional levels.
                </p>
                <p>
                  The conference is organized around four integrated innovation
                  tracks covering Smart Agriculture and Food Systems;
                  Sustainable Health, Water and Sanitation Technologies; Clean
                  Energy, Industry 4.0 and Resilient Infrastructure; and Digital
                  Society, Governance and Future Learning. Emphasizing climate
                  resilience, low-carbon development, digital inclusion, and
                  community-centric solutions, the program highlights the
                  responsible application of emerging technologies including
                  artificial intelligence, Internet of Things (IoT),
                  biotechnology, renewable energy systems, digital twins, and
                  immersive learning platforms.
                </p>
                <p>
                  A distinctive focus is placed on tribal and forest-dependent
                  communities, eco-sensitive development, and
                  conservation-aligned technologies. Through technical sessions,
                  high-level panel discussions, and technology showcases, the
                  conference fosters knowledge exchange, policy dialogue, and
                  global partnerships aimed at delivering scalable and
                  sustainable impact toward achieving the SDGs by 2030.
                </p>
              </div>
            </div>

            {/* Organizers & Partners */}
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 py-10 border-y border-white/10 bg-white/5 rounded-3xl backdrop-blur-sm">
              {[
                {
                  src: "/assets/neelgiris/srm.png",
                  alt: "SRM Institute of Science & Technology",
                  height: 80,
                },
                {
                  src: "/assets/neelgiris/texus.png",
                  alt: "Texus",
                  height: 60,
                },
                {
                  src: "/assets/neelgiris/taf.png",
                  alt: "Taylor & Francis Group",
                  height: 70,
                },
                { src: "/assets/neelgiris/ieee.png", alt: "IEEE", height: 60 },
                {
                  src: "/assets/neelgiris/icc.png",
                  alt: "Institution's Innovation Council",
                  height: 70,
                },
                {
                  src: "/assets/neelgiris/mariboru.png",
                  alt: "University of Maribor",
                  height: 90,
                },
                // {
                //   src: "/assets/neelgiris/TUKE.jpg",
                //   alt: "Technical University of Košice",
                //   height: 70,
                // },
                {
                  src: "/assets/neelgiris/wiley.jpeg",
                  alt: "Wiley",
                  height: 70,
                },
                {
                  src: "/assets/neelgiris/kosice.png",
                  alt: "Technical University of Košice",
                  height: 70,
                },
              ].map((logo, idx) => (
                <div
                  key={idx}
                  className="relative duration-300 opacity-80 hover:opacity-100 hover:scale-110"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={200}
                    height={logo.height}
                    className="object-contain w-auto"
                    style={{ height: `${logo.height}px` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tracks Grid */}
          <div>
            <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white font-thuast tracking-wide">
                Innovation Tracks
              </h3>
              <p className="text-white/50 hidden md:block font-montserrat text-sm">
                4 Integrated Domains
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Smart Agriculture & Food Systems",
                  topics:
                    "AI/ML, IoT, Drones, Precision Farming, Tribal Livelihood",
                  sdgs: "1, 2, 5, 8, 12, 13",
                  image: "/assets/neelgiris/track1.png",
                  color: "#FFD700",
                },
                {
                  title: "Sustainable Health & Water",
                  topics: "Telemedicine, AI Diagnostics, Smart Water Systems",
                  sdgs: "3, 6, 9, 10, 14",
                  image: "/assets/neelgiris/track2.png",
                  color: "#76A665",
                },
                {
                  title: "Clean Energy & Industry 4.0",
                  topics: "Renewable Energy, Smart Grids, Resilient Infra",
                  sdgs: "7, 9, 11, 12, 15",
                  image: "/assets/neelgiris/track3.png",
                  color: "#4ADE80",
                },
                {
                  title: "Digital Society & Governance",
                  topics: "Cybersecurity, Blockchain, Future Learning, AR/VR",
                  sdgs: "4, 10, 15, 16, 17",
                  image: "/assets/neelgiris/track4.png",
                  color: "#60A5FA",
                },
              ].map((track, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="group relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                >
                  {/* Background Image */}
                  <Image
                    src={track.image}
                    alt={track.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c15] via-[#0f1c15]/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 w-full p-8 z-10 transform transition-transform duration-500">
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: track.color }}
                      />
                      <span className="text-xs font-bold text-white/90 tracking-widest font-montserrat uppercase">
                        Track 0{idx + 1}
                      </span>
                    </div>

                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-3 font-montserrat leading-tight group-hover:text-[#FFD700] transition-colors">
                      {track.title}
                    </h4>

                    <p className="text-white/70 text-sm md:text-base font-montserrat line-clamp-2 md:line-clamp-3 group-hover:line-clamp-none group-hover:text-white transition-all duration-300 mb-6">
                      {track.topics}
                    </p>

                    <div className="space-y-2 mt-6">
                      <span className="text-xs font-bold text-white/40 uppercase tracking-widest font-montserrat">
                        Target SDGs:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {track.sdgs.split(", ").map((num, i) => (
                          <div
                            key={i}
                            className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border border-white/10 bg-white/5 hover:scale-110 transition-transform shadow-lg"
                          >
                            <Image
                              src={`/assets/sdgs/sdg${num.trim()}.png`}
                              alt={`SDG ${num}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Important Dates & Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-8 font-thuast tracking-wide flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#FFD700]" />
                Important Dates
              </h3>
              <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                {[
                  { label: "Abstract Submission", date: "Jan 12, 2026" },
                  { label: "Full Paper Submission", date: "Jan 17, 2026" },
                  { label: "Acceptance Notification", date: "Jan 20, 2026" },
                  {
                    label: "Registration Deadline",
                    date: "Jan 23, 2026",
                    active: true,
                  },
                  { label: "Camera-Ready Paper", date: "Feb 03, 2026" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-[#1a2e1f] relative z-10 ${
                        item.active
                          ? "bg-[#FFD700] text-black"
                          : "bg-[#2F4F4F] text-white/50"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.active ? "bg-black" : "bg-white"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-bold font-montserrat ${
                          item.active ? "text-[#FFD700]" : "text-white"
                        }`}
                      >
                        {item.date}
                      </p>
                      <p className="text-sm text-white/50 font-montserrat">
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-[#FFD700] mb-6 font-thuast tracking-wide">
                  Registration
                </h3>
                <div className="mb-6">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] sm:text-xs font-bold text-[#FFD700] uppercase tracking-wider border-b border-[#FFD700]/20 pb-2 mb-2">
                    <div className="col-span-4">Category</div>
                    <div className="col-span-4 text-right">
                      Indian Participants (INR)
                    </div>
                    <div className="col-span-4 text-right">
                      Overseas Participants (USD)
                    </div>
                  </div>

                  {/* Rows */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-[#FFD700]/10">
                      <span className="text-white/80 text-sm font-montserrat col-span-4">
                        UG/PG Students
                      </span>
                      <span className="text-white font-bold font-mono text-right col-span-4">
                        ₹3000
                      </span>
                      <span className="text-white font-bold font-mono text-right col-span-4">
                        $75
                      </span>
                    </div>
                    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-[#FFD700]/10">
                      <span className="text-white/80 text-sm font-montserrat col-span-4">
                        Research Scholars
                      </span>
                      <span className="text-white font-bold font-mono text-right col-span-4">
                        ₹3500
                      </span>
                      <span className="text-white font-bold font-mono text-right col-span-4">
                        $75
                      </span>
                    </div>
                    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-[#FFD700]/10">
                      <span className="text-white/80 text-sm font-montserrat col-span-4">
                        Academicians
                      </span>
                      <span className="text-white font-bold font-mono text-right col-span-4">
                        ₹4000
                      </span>
                      <span className="text-white font-bold font-mono text-right col-span-4">
                        $120
                      </span>
                    </div>
                    <div className="grid grid-cols-12 gap-2 items-center py-2">
                      <span className="text-white/80 text-sm font-montserrat col-span-4">
                        Industry
                      </span>
                      <span className="text-white font-bold font-mono text-right col-span-4">
                        ₹5000
                      </span>
                      <span className="text-white font-bold font-mono text-right col-span-4">
                        $120
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-[#0f1c15]/50 rounded-xl p-4 mb-6 border border-[#FFD700]/10">
                  <p className="text-[#FFD700] text-sm font-bold mb-2 uppercase tracking-wide">
                    Bank Details
                  </p>
                  <div className="space-y-1 text-sm font-montserrat text-white/80">
                    <p>
                      <span className="text-white/40">Name:</span> SRMIST
                    </p>
                    <p>
                      <span className="text-white/40">Acc No:</span>{" "}
                      117109000032971
                    </p>
                    <p>
                      <span className="text-white/40">IFSC:</span> CIUB0000517
                    </p>
                    <p>
                      <span className="text-white/40">Bank:</span> City Union
                      Bank
                    </p>
                    <p>
                      <span className="text-white/40">Branch:</span> Ramapuram
                    </p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  <div className="p-2 bg-white rounded-xl">
                    <Image
                      src="/assets/qr.png"
                      alt="Registration QR"
                      width={120}
                      height={120}
                      className=""
                    />
                  </div>
                </div>

                <a
                  href="https://forms.gle/DrjxsFT1WQpa45sx5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block w-full py-4 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0f1c15] font-bold text-center font-montserrat hover:to-white hover:from-white transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center gap-2 text-lg">
                    Click Here To Register
                    <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h4 className="text-[#76A665] font-bold font-montserrat uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#76A665]" />
                  Publication Opportunity
                </h4>
                <ul className="space-y-3 text-white/80 text-sm font-montserrat leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-[#FFD700]">•</span>
                    <span>
                      Selected high-quality papers will be published in{" "}
                      <span className="text-white font-semibold">
                        Scopus-indexed journal special issues
                      </span>{" "}
                      (peer review and journal guidelines; APC payable by
                      authors).
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#FFD700]">•</span>
                    <span>
                      Best papers will be published as Book Chapters with{" "}
                      <span className="text-white font-semibold">
                        IEEE & Taylor & Francis
                      </span>
                      .
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#FFD700]">•</span>
                    <span>
                      All the accepted abstracts will be published in the{" "}
                      <span className="text-white font-semibold">
                        Conference Proceedings indexed with ISBN
                      </span>
                      .
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Conference Flyer */}
          <div className="flex flex-col items-center justify-center py-12 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-bold text-white font-thuast tracking-wide">
                Official Conference Flyer
              </h3>
              <p className="text-white/60 font-montserrat">
                Download the complete conference details
              </p>
            </div>

            <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 group hover:border-[#FFD700]/50 transition-colors">
              <Image
                src="/assets/neelgiris/nilgiris poster.jpeg"
                alt="Conference Flyer"
                width={800}
                height={1131}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a
                  href="/assets/neelgiris/conference-flyer.jpg"
                  download
                  className="px-8 py-3 bg-[#FFD700] text-black font-bold rounded-full hover:scale-105 transition-transform font-montserrat flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-lg">Download Flyer</span>
                </a>
              </div>
            </div>
          </div>

          {/* Committee */}
          <div className="space-y-12">
            <h3 className="text-3xl md:text-5xl font-normal text-white font-thuast tracking-wide text-center">
              Committee & Patrons
            </h3>

            {/* 1. Chief Patrons */}
            <div className="text-center">
              <h4 className="text-[#76A665] text-xl font-bold font-montserrat uppercase tracking-widest mb-6">
                Chief Patrons
              </h4>
              <div className="flex flex-col items-center gap-2 text-white">
                <p className="text-lg font-bold">
                  Dr. R. Shivakumar,{" "}
                  <span className="text-white/60 text-base font-normal">
                    Chairman
                  </span>
                </p>
                <p className="text-lg font-bold">
                  Mr. S. Niranjan,{" "}
                  <span className="text-white/60 text-base font-normal">
                    Co-Chairman
                  </span>
                </p>
                <p className="text-white/40 text-sm mt-2">
                  SRM Group of Institutions, Ramapuram, Trichy
                </p>
              </div>
            </div>

            <div className="h-px w-32 bg-white/10 mx-auto" />

            {/* 2. Convener & Co-Conveners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
              <div>
                <h4 className="text-[#76A665] text-xl font-bold font-montserrat uppercase tracking-widest mb-6">
                  Convener
                </h4>
                <p className="text-white text-lg font-bold">
                  Dr. M. Sakthi Ganesh
                </p>
                <p className="text-white/60">Dean (E&T)</p>
              </div>
              <div>
                <h4 className="text-[#76A665] text-xl font-bold font-montserrat uppercase tracking-widest mb-6">
                  Co-Conveners
                </h4>
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    Dr. Balika J Chelliah{" "}
                    <span className="text-white/40 text-sm">- VP (Admin)</span>
                  </p>
                  <p className="text-white font-medium">
                    Dr. Rama Chaithanya T{" "}
                    <span className="text-white/40 text-sm">
                      - VP (Academics)
                    </span>
                  </p>
                  <p className="text-white font-medium">
                    Dr. Roopa M{" "}
                    <span className="text-white/40 text-sm">
                      - VP (Research)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px w-32 bg-white/10 mx-auto" />

            {/* 3. Advisory Committee */}
            <div>
              <h4 className="text-[#76A665] text-xl font-bold font-montserrat uppercase tracking-widest mb-8 text-center">
                Advisory Committee
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Prof. C. Muthamizhchelvan, Vice Chancellor, SRMIST, India",
                  "Prof. S. Ponnusamy, Registrar, SRMIST, India",
                  "Dr.N.Sethuraman, Chief Director, SRM Group of Institutions, Ramapuram & Trichy",
                  "Dr. D.P. Kothari, Director Research, S.B Jain Institute of Technology, Nagpur",
                  "Dr. P. Senthilkumar, Pondicherry University, India",
                  "Dr. Meenalosini Vimal Cruz, Georgia Southern University, Savannah, GA",
                  "Dr. Nageswara Guptha M, Ramaiah University of Applied Sciences, Bangalore",
                  "Dr. S. Renganathan, Anna University, Chennai",
                  "Dr. Rangabhashiyam Selvasembian, Associate Dean-PhD Program, SRM University-AP",
                  "Dr. Shaligram Tiwari, IIT Madras, Chennai",
                  "Dr. Vijay Raghunathan, Brake India Pvt. Ltd., Padi, Chennai",
                  "Dr. Eldon R. Rene, IHE Delft Institute for Water Education, The Netherlands",
                  "Dr. Naveen Kumar R, University of Wisconsin-Madison, USA",
                  "Dr. Pranav Vasanthi, University of Birmingham, Birmingham, UK",
                  "Dr. Thilini U. Ariyadasa, University of Moratuwa, Moratuwa, Sri Lanka",
                  "Dr. Paripok Phitsuwan, King Mongkut’s University of Technology Thonburi, Thailand.",
                ].map((name, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5 transition-colors hover:bg-white/10"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#76A665] mt-2 shrink-0" />
                    <p className="text-white/80 text-sm font-montserrat leading-relaxed">
                      {name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Organizing Committee */}

            <div>
              <h4 className="text-[#76A665] text-xl font-bold font-montserrat uppercase tracking-widest mb-8 text-center">
                Organising Committee
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "Dr. K. Raja, Chairperson, SCSE",
                  "Dr. J. Sutha, HoD/CSE",
                  "Dr. Sankarram, HoD/AIML",
                  "Dr. A. Umamageswari, HoD/BDA & CC",
                  "Dr. Shiny Duela J, HoD/CS&GT",
                  "Dr. A. Usha Ruby, HoD/IoT & CSBS",
                  "Dr. Rajeswari Mukesh, HoD/IT",
                  "Dr. N.V.S. Sree Rathna Lakshmi, HoD/ECE",
                  "Dr. K.N. Srinivas, HoD/EEE",
                  "Dr. Divahar R, HoD/Civil",
                  "Dr. Mothilal Thulasiraman, HoD/Mechanical",
                  "Dr. Ushus S Kumar, HoD/BME",
                  "Dr. Hemavathy R V, HoD/BioTech",
                  "Dr. N. Balamurugan, HoD/Physics",
                  "Dr. Helen P. Kavitha, HoD/Chemistry",
                  "Dr. K G Nagaradhika, HoD/LCS",
                  "Dr. R. Srinivasan, HoD/Maths",
                  "Dr. M S Antony Vigil, AP/CSE",
                  "Dr. C. Ashwini, AP/CSE",
                  "Dr. V. Aravindhan, AP/ECE",
                  "Dr. Vijayan, AP/Civil",
                ].map((name, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-[#76A665]/50 transition-colors text-center flex items-center justify-center min-h-[80px]"
                  >
                    <p className="text-white/90 text-sm font-montserrat font-medium">
                      {name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Editorial Advisory members */}
            <div>
              <h4 className="text-[#76A665] text-xl font-bold font-montserrat uppercase tracking-widest mb-8 text-center">
                Editorial Advisory Members
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Member 1 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-[#76A665]/50 transition-colors">
                  <h5 className="text-white font-bold text-lg mb-2">
                    Prof Dr Vijayakumar Varadarajan
                  </h5>
                  <p className="text-[#FFD700] text-sm font-medium mb-4">
                    EAI FELLOW
                  </p>
                  <div className="space-y-1 text-white/70 text-sm font-montserrat mb-4">
                    <p>Visiting Professor, School of Engineering</p>
                    <p>UNIVERSITY OF Diponegoro, Indonesia</p>
                    <a
                      href="mailto:vijayakumar.varadarajan@elektro.undip.ac.id"
                      className="text-[#76A665] hover:underline block mt-1"
                    >
                      vijayakumar.varadarajan@elektro.undip.ac.id
                    </a>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
                      Editor of
                    </p>
                    <ul className="space-y-2 text-white/80 text-sm">
                      <li>
                        • International Journal of Advances in Signal and Image
                        Sciences
                      </li>
                      <li>
                        • International Journal of Reconfigurable and Embedded
                        Systems
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Member 2 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-[#76A665]/50 transition-colors">
                  <h5 className="text-white font-bold text-lg mb-2">
                    Prof Dr M Roopa
                  </h5>
                  <p className="text-[#FFD700] text-sm font-medium mb-4">
                    Vice Principal – Research
                  </p>
                  <div className="space-y-1 text-white/70 text-sm font-montserrat">
                    <p>SRM Institute of Science and Technology</p>
                    <p>Ramapuram Campus, Chennai</p>
                    <div className="flex flex-col gap-1 mt-2">
                      <a
                        href="mailto:vp.research.rmp@srmist.edu.in"
                        className="text-[#76A665] hover:underline"
                      >
                        vp.research.rmp@srmist.edu.in
                      </a>
                      <a
                        href="mailto:roopam@srmist.edu.in"
                        className="text-[#76A665] hover:underline"
                      >
                        roopam@srmist.edu.in
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConferenceDetails;
