import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  PAPER, 
  PaperHeading, 
  PaperText, 
  Tape,
  headingFont,
  bodyFont 
} from "@/components/PaperComponents";

const ModelWrapper = ({
  children,
  activeCard,
}: {
  children: React.ReactNode;
  activeCard: number;
}) => {
  const [fov, setFov] = React.useState(45);

  React.useEffect(() => {
    const handleResize = () => {
      setFov(window.innerWidth < 768 ? 60 : 45);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: fov,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          {children}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Define an interface for your event props
interface EventProps {
  title: string;
  pointer: string;
  description: React.ReactNode;
  content: React.ReactNode;
  tintColor: string; // for subtle colored tint
}

// Card component with paper theme
const EventCard = ({ event, index }: { event: EventProps; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        y: -6, 
        scale: 1.02,
        boxShadow: `12px 12px 0 ${PAPER.shadow}` 
      }}
      className="relative p-5 rounded-2xl flex flex-col h-full"
      style={{
        background: `${PAPER.bg} url("/textures/paper.png")`,
        border: `3px solid ${PAPER.ink}`,
        boxShadow: `8px 8px 0 ${PAPER.shadow}`,
      }}
    >
      <Tape className="-top-4 left-6" rotate={-4} />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="absolute top-0 right-0 text-3xl z-20">
          {event.pointer}
        </div>

        <div className="flex justify-center items-center mb-4">
          <div className="relative">{event.content}</div>
        </div>

        <h2
          className="text-xl md:text-2xl font-bold py-2 tracking-tight border-b-2 mb-3"
          style={{
            fontFamily: headingFont,
            color: PAPER.ink,
            borderColor: event.tintColor,
          }}
        >
          {event.title}
        </h2>

        <div
          className="flex-grow text-justify text-sm md:text-base leading-relaxed mb-4"
          style={{
            fontFamily: bodyFont,
            color: "rgba(18,56,89,0.86)",
          }}
        >
          {event.description}
        </div>

        <div className="mt-auto">
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-full px-4 py-2 rounded-xl font-bold"
            style={{
              fontFamily: bodyFont,
              background: event.tintColor,
              color: PAPER.ink,
              border: `2px solid ${PAPER.ink}`,
              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
            }}
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Eventspage = () => {
  const content: EventProps[] = [
    {
      title: "TECHNICAL EVENTS",
      pointer: "💻",
      tintColor: "rgba(255,16,76,0.15)",
      description: (
        <span>
          Experience 40+ exhilarating tech events at Texus Fest! From
          workshops to coding challenges, and AI showcases, join us for a
          dynamic celebration of innovation and learning.
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/laptop.png"}
          alt="laptop"
          width={1920}
          height={1080}
          className="h-48 w-48 md:h-56 md:w-56"
        />
      ),
    },
    {
      title: "NON TECHNICAL EVENTS",
      pointer: "🎮",
      tintColor: "rgba(255,247,16,0.2)",
      description: (
        <span>
          Embark on a journey of creativity and inspiration with our lineup of
          15+ non-technical events at Texus Fest! Join us for an unforgettable
          experience filled with exploration, connection, and celebration of
          the arts!
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/joystick.png"}
          alt="joystick"
          width={1920}
          height={1080}
          className="h-48 w-48 md:h-56 md:w-56"
        />
      ),
    },
    {
      title: "BLOOD DONATION CAMP",
      pointer: "💉",
      tintColor: "rgba(255,0,0,0.12)",
      description: (
        <span>
          Save lives and make a difference at our Blood Donation Camp during
          Texus Fest! Join us in giving the gift of life by donating blood.
          Together, let&apos;s support a noble cause and spread hope and
          compassion.
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/blooddonation.png"}
          alt="blood donation"
          width={1920}
          height={1080}
          className="h-48 w-48 md:h-56 md:w-56"
        />
      ),
    },
    {
      title: "WORKSHOPS",
      pointer: "🎤",
      tintColor: "rgba(0,255,174,0.15)",
      description: (
        <span>
          Enhance your skills at TEXUS &apos;26 with 7+ expert-led workshops
          designed to provide hands-on learning and industry insights.
          Don&apos;t miss this chance to upskill and explore new
          possibilities!
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/podium.png"}
          alt="podium"
          width={1920}
          height={1080}
          className="h-48 w-48 md:h-56 md:w-56"
        />
      ),
    },
    {
      title: "HACKATHON",
      pointer: "👾",
      tintColor: "rgba(255,72,0,0.15)",
      description: (
        <span>
          Join HackVerse, empowering tech-savvy youth in India with
          problem-solving skills and global connections. Attend our hybrid
          event for a 24-hour in-person hackathon, embracing Web3 with leading
          tech companies. Sign up now for a promising future.
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/hackathon.png"}
          alt="hackathon"
          width={1920}
          height={1080}
          className="h-48 w-48 md:h-56 md:w-56"
        />
      ),
    },
    {
      title: "Souvenir",
      pointer: "📗",
      tintColor: "rgba(255,16,76,0.15)",
      description: (
        <span>
          Celebrate the spirit of TEXUS &apos;26 with Souvenir, a collection
          of memories, creativity, and achievements from the fest. Featuring
          student-written essays, event highlights, and cherished moments,
          Souvenir preserves the essence of this grand celebration.
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/sov.png"}
          alt="souvenir"
          width={1920}
          height={1080}
          className="h-48 w-48 md:h-56 md:w-56"
        />
      ),
    },
  ];

  return (
    <div 
      className="py-12 w-full relative overflow-hidden"
      style={{
        background: `${PAPER.bg} url('/textures/paper.png')`,
      }}
    >
      <div className="flex flex-col w-full mx-auto max-w-6xl px-4 md:px-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative inline-block mb-4"
        >
          <PaperHeading size="4xl">Events</PaperHeading>
          <motion.div 
            className="h-1 rounded-full mt-2"
            style={{ 
              background: `linear-gradient(to right, ${PAPER.accent}, ${PAPER.lightAccent})`,
              width: "100%"
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
        </motion.div>

        <PaperText className="text-base md:text-lg mb-6 max-w-2xl" opacity={0.9}>
          <span style={{ color: PAPER.accent, fontWeight: "600" }}>TEXUS &apos;26</span> -
          EXPLORE THE EXCITING EVENTS OF THE LARGEST TECH FEST
        </PaperText>

        <div className="mb-8">
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="px-6 py-2.5 rounded-xl font-bold"
            style={{
              fontFamily: bodyFont,
              background: `linear-gradient(to right, ${PAPER.accent}, ${PAPER.lightAccent})`,
              color: PAPER.ink,
              border: `2px solid ${PAPER.ink}`,
              boxShadow: `4px 4px 0 ${PAPER.shadow}`,
            }}
          >
            Register Now
          </motion.button>
        </div>
      </div>

      <div className="w-full mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {content.map((event, index) => (
            <EventCard key={index} event={event} index={index} />
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-12 text-center max-w-3xl mx-auto px-4"
      >
        <h2 
          className="text-2xl md:text-3xl mb-4"
          style={{
            fontFamily: headingFont,
            color: PAPER.ink,
          }}
        >
          Ready to be part of{" "}
          <span style={{ color: PAPER.accent }}>TEXUS &apos;26</span>?
        </h2>
        <PaperText className="mb-6 text-base">
          Don&apos;t miss out on the most anticipated tech fest of the year.
          Register now to participate in events, workshops, and more!
        </PaperText>
        <motion.button
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="px-6 py-2.5 rounded-xl font-bold"
          style={{
            fontFamily: bodyFont,
            background: PAPER.white,
            color: PAPER.ink,
            border: `3px solid ${PAPER.ink}`,
            boxShadow: `5px 5px 0 ${PAPER.shadow}`,
          }}
        >
          JOIN THE EXCITEMENT
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Eventspage;
