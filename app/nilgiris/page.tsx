"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Sprout,
  HeartPulse,
  Zap,
  Cpu,
  Users,
  Globe,
  Target,
  Leaf,
  Droplets,
  Wind,
  Calendar,
  MapPin,
  Video,
} from "lucide-react";
import ConferenceDetails from "./ConferenceDetails";
import DelegateSpeakersPaper from "./DelegateSpeakersPaper";

const NilgirisPage = () => {
  const { scrollYProgress } = useScroll();
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    "Conference"
  );
  const detailsRef = React.useRef<HTMLDivElement>(null);

  // Custom Color Palette
  const colors = {
    bg: "#F2E8CF", // Beige/Cream
    text: "#382E1E", // Dark Earthy Brown
    primary: "#556B2F", // Agriculture Green
    secondary: "#8B4513", // Health Brown
    accent: "#DAA520", // Energy Yellow
    darkGreen: "#2F4F4F", // Digital Society Dark Green
    cardBg: "rgba(56, 46, 30, 0.05)",
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Small timeout to allow state update and DOM render
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div
      className="min-h-screen w-full overflow-hidden font-montserrat"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#556B2F] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#DAA520] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col justify-center items-center px-4 md:px-20 pt-28 sm:pt-32 md:pt-36">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-6xl mx-auto text-center z-10"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-6 flex flex-col items-center gap-4"
          >
            <span className="px-6 py-2 rounded-full border border-[#382E1E]/20 text-sm font-semibold tracking-wider uppercase bg-[#382E1E]/5">
              Global Summit 2026
            </span>
            <div className="flex items-center gap-2 text-lg font-medium opacity-80">
              <Calendar className="w-5 h-5" />
              <span>February 14-15, 2026</span>
            </div>
            <div className="flex items-center gap-2 text-lg font-medium opacity-80">
              <MapPin className="w-5 h-5" />
              <span>Nilgiris, Coimbatore</span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight"
            style={{ color: colors.darkGreen }}
          >
            Rising with <span style={{ color: colors.primary }}>Nilgiris</span>{" "}
            to <br />
            Accelerate <span style={{ color: colors.secondary }}>SDGs</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl max-w-3xl mx-auto opacity-80 mb-12 leading-relaxed"
          >
            Driving Innovation for Global SDG Goals through technology,
            inclusion, and collaborative action.
          </motion.p>
        </motion.div>
      </section>

      {/* Summit Agenda / Event Highlights */}
      <section
        className="py-10 px-4 md:px-20 relative bg-white/40 backdrop-blur-sm"
        id="agenda"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Summit Agenda
            </h2>
            <p className="text-xl opacity-70">
              Select an event below to explore detailed schedules and tracks
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: "Conference",
                desc: "Global Academic Forum on Sustainability",
                image: "/assets/neelgiris/conference.png",
                color: colors.primary,
              },
              {
                title: "Hackathon",
                desc: "Building Solutions for the Future",
                image: "/assets/neelgiris/hackathon.png",
                color: colors.secondary,
              },
              {
                title: "Panel Discussion",
                desc: "Future of Sustainability Forum",
                image: "/assets/neelgiris/panel.png",
                color: colors.accent,
              },
            ].map((event, idx) => {
              const isActive = activeCategory === event.title;
              return (
                <motion.div
                  key={idx}
                  onClick={() => {
                    if (event.title === "Hackathon") {
                      window.open("https://zyph26.texus.io", "_blank");
                    } else {
                      handleCategoryClick(event.title);
                    }
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className={`group relative overflow-hidden rounded-3xl h-[400px] shadow-lg cursor-pointer transition-all duration-500 border-4 ${
                    isActive
                      ? "ring-4 ring-offset-4 ring-[#382E1E]/20 scale-105"
                      : "hover:scale-105"
                  }`}
                  style={{
                    borderColor: isActive ? event.color : "transparent",
                  }}
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${
                      isActive
                        ? "from-black/90 via-black/40"
                        : "from-black/80 via-black/20"
                    } to-transparent`}
                  />

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute top-4 right-4 bg-white text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Viewing Details
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                    <h3 className="text-3xl font-bold mb-2">{event.title}</h3>
                    <p className="text-white/80 font-medium text-lg mb-4">
                      {event.desc}
                    </p>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isActive ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-white/60 text-sm">
                        ↓ Scroll down to see details
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* International Speaker Section */}
      <section className="relative py-20 px-4 md:px-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              International Speaker
            </h2>
            <p className="text-xl opacity-70">
              Distinguished legal expert joining us from the United States
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border-4 shadow-lg"
                   style={{
                     borderColor: colors.primary,
                     boxShadow: `12px 12px 0 ${colors.primary}`,
                   }}>
                <div className="relative w-full aspect-[5.7/6]">
                  <Image
                    src="/guests/Joshua.jpg"
                    alt="Dr. Joshua Ryan Dalrymple"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right - Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-3xl border-4 shadow-lg"
              style={{
                background: "rgba(242, 232, 207, 0.9)",
                borderColor: colors.primary,
                boxShadow: `8px 8px 0 ${colors.primary}`,
              }}
            >
              <h3
                className="text-2xl md:text-3xl font-bold mb-3"
                style={{ color: colors.darkGreen }}
              >
                Dr. Joshua Ryan Dalrymple
              </h3>
              
              <div className="space-y-3 mb-6">
                <p className="text-lg font-semibold" style={{ color: colors.text }}>
                  Attorney and Lawyer
                </p>
                <p className="text-lg font-medium" style={{ color: colors.text }}>
                  Virginia, USA
                </p>
              </div>

              <div className="space-y-4 text-sm md:text-base leading-relaxed" style={{ color: colors.text }}>
                <p>
                  Dr. Joshua Ryan Dalrymple is an attorney and Executive Director of SRL Professional Services Pvt. Ltd., Hyderabad, and an Adjunct Professor of Law at Purdue University Global.
                </p>
                <p>
                  A former Dean of School of Law at Woxsen University and faculty member at Liberty University School of Law, he brings nearly two decades of experience practicing and teaching law in United States and India.
                </p>
              </div>

              {/* Highlight badges */}
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-4 py-2 rounded-full text-sm font-semibold border-2 shadow-sm"
                      style={{
                        background: colors.primary,
                        color: "white",
                        borderColor: colors.darkGreen,
                        boxShadow: `3px 3px 0 ${colors.darkGreen}`,
                      }}>
                  Legal Expert
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-semibold border-2 shadow-sm"
                      style={{
                        background: colors.accent,
                        color: colors.text,
                        borderColor: colors.darkGreen,
                        boxShadow: `3px 3px 0 ${colors.darkGreen}`,
                      }}>
                  International Speaker
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-semibold border-2 shadow-sm"
                      style={{
                        background: colors.secondary,
                        color: "white",
                        borderColor: colors.darkGreen,
                        boxShadow: `3px 3px 0 ${colors.darkGreen}`,
                      }}>
                  Academic Leader
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Delegate Speakers Section */}
      <DelegateSpeakersPaper />

      {/* Dynamic Content Section */}
      <AnimatePresence mode="wait">
        {activeCategory === "Conference" && (
          <ConferenceDetails detailsRef={detailsRef} />
        )}

        {activeCategory === "Panel Discussion" && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <section className="py-20 px-4 md:px-20 bg-white/30 rounded-3xl my-10 mx-4 md:mx-0">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
                  Three Panel Discussions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Tribal Futures",
                      subtitle: "Technology, Inclusion & Forest Communities",
                      focus:
                        "Digital, IoT, and sustainable engineering enhancing livelihoods and rights of tribal communities.",
                      composition:
                        "Tribal welfare experts, technologists, policymakers, indigenous innovation professors.",
                      color: colors.primary,
                    },
                    {
                      title: "AI for Learning Societies",
                      subtitle: "Education, Empowerment & Next Gen",
                      focus:
                        "AI tools in schools/higher-ed for personalized learning, teacher support, and inclusion.",
                      composition:
                        "School principals, EdTech innovators, AI researchers, government representatives.",
                      color: colors.secondary,
                    },
                    {
                      title: "Digital Society & Trustworthy AI",
                      subtitle: "Governance, Ethics & Public Good",
                      focus:
                        "AI infrastructure for accountable governance, citizen services, and responsible AI.",
                      composition:
                        "Policymakers, e-governance experts, AI scientists, legal/ethics scholars.",
                      color: colors.accent,
                    },
                  ].map((panel, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2 }}
                      viewport={{ once: true }}
                      className="p-8 rounded-3xl bg-[#F2E8CF] border-2 shadow-sm flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
                      style={{ borderColor: panel.color }}
                    >
                      <div
                        className="w-12 h-12 rounded-full mb-6 flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: panel.color }}
                      >
                        {i + 1}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 leading-tight">
                        {panel.title}
                      </h3>
                      <h4 className="text-sm font-bold uppercase tracking-wider mb-6 opacity-70">
                        {panel.subtitle}
                      </h4>

                      <div className="mb-6 flex-grow">
                        <p className="text-sm font-bold mb-2 opacity-90">
                          Focus:
                        </p>
                        <p className="text-sm opacity-80 leading-relaxed">
                          {panel.focus}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-bold mb-2 opacity-90">
                          Composition:
                        </p>
                        <p className="text-sm opacity-80 leading-relaxed">
                          {panel.composition}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeCategory === "Hackathon" && (
          <motion.div
            key="hackathon"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-20 flex flex-col items-center justify-center min-h-[50vh]"
          >
            <div className="text-center max-w-2xl px-4">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Zap className="w-12 h-12 text-orange-600" />
              </div>
              <h2 className="text-4xl font-bold mb-4">
                Hackathon Details Coming Soon
              </h2>
              <p className="text-xl opacity-70">
                We are finalizing the problem statements and tracks for the
                hackathon. Stay tuned for updates!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voices of Impact */}
      <section className="py-20 px-4 md:px-20 mb-20">
        <div
          className="max-w-6xl mx-auto rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.darkGreen}, ${colors.primary})`,
          }}
        >
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <Globe size={400} />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Distinguished Voices
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
              <div>
                <h3 className="text-7xl font-bold mb-2">4</h3>
                <p className="text-xl font-medium opacity-90">
                  Padma Awardees honoring excellence in sustainability.
                </p>
              </div>
              <div>
                <h3 className="text-7xl font-bold mb-2">10+</h3>
                <p className="text-xl font-medium opacity-90">
                  Countries Represented in our international delegation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                <Target className="w-8 h-8 mb-4 opacity-80" />
                <h4 className="text-xl font-bold mb-2">Honoring Excellence</h4>
                <p className="text-sm opacity-80">
                  Recognizing visionary leaders whose work exemplifies
                  sustainable development.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                <Users className="w-8 h-8 mb-4 opacity-80" />
                <h4 className="text-xl font-bold mb-2">
                  Community Empowerment
                </h4>
                <p className="text-sm opacity-80">
                  Amplifying grassroots voices and celebrating local solutions.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                <Globe className="w-8 h-8 mb-4 opacity-80" />
                <h4 className="text-xl font-bold mb-2">Global Collaboration</h4>
                <p className="text-sm opacity-80">
                  Building bridges between traditional knowledge and modern
                  technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NilgirisPage;
