import React, { useState } from "react";
import { Button } from "./ui/button";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Image from "next/image";

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
  color: string;
  bg: string;
  pointer: string;
  description: React.ReactNode;
  content: React.ReactNode;
}

// Card component without animations
const EventCard = ({ event, index }: { event: EventProps; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`${event.bg} p-5 rounded-xl shadow-lg relative overflow-hidden 
        backdrop-blur-sm bg-opacity-90 border border-white/10 flex flex-col
        h-full transition-all hover:scale-[1.02]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10 h-full flex flex-col">
        <div className="absolute top-3 right-3 text-2xl z-20">
          {event.pointer}
        </div>

        <div className="flex justify-center items-center mb-3">
          <div className="relative">{event.content}</div>
        </div>

        <h2
          className="text-xl md:text-2xl font-bold font-montserrat text-white py-2 
          tracking-tight relative border-b border-white/20 mb-2"
        >
          {event.title}
        </h2>

        <div
          className="flex-grow text-white text-justify font-montserrat text-sm md:text-base 
          leading-relaxed mb-3"
        >
          {event.description}
        </div>

        <div className="mt-auto">
          <Button
            className="bg-white/20 hover:bg-white/30 
            text-white font-medium rounded-full px-4 py-2 w-full"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

const Eventspage = () => {
  const content = [
    {
      title: "TECHNICAL EVENTS",
      color: "text-white",
      bg: "bg-gradient-to-b from-[#FF104C] to-[#122D99]",
      pointer: "💻",
      description: (
        <span className="text-sm md:text-base text-justify font-montserrat">
          <span>
            Experience 40+ exhilarating tech events at Texus Fest! From
            workshops to coding challenges, and AI showcases, join us for a
            dynamic celebration of innovation and learning.
          </span>
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/laptop.png"}
          alt="laptop"
          width={1920}
          height={1080}
          className="h-64 w-64"
        />
      ),
    },
    {
      title: "NON TECHNICAL EVENTS",
      color: "text-[#E1DB90]",
      pointer: "🎮",
      bg: "bg-gradient-to-b from-[#FFF710] to-[#122D99]",
      description: (
        <span className="text-sm md:text-base text-justify font-montserrat">
          <span>
            Embark on a journey of creativity and inspiration with our lineup of
            15+ non-technical events at Texus Fest! Join us for an unforgettable
            experience filled with exploration, connection, and celebration of
            the arts!
          </span>
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/joystick.png"}
          alt="laptop"
          width={1920}
          height={1080}
          className="h-64 w-64"
        />
      ),
    },
    {
      title: "BLOOD DONATION CAMP",
      color: "text-red-600",
      pointer: "💉",
      bg: "bg-gradient-to-b from-[#FF0000] to-[#252525]",
      description: (
        <span className="text-sm md:text-base text-justify font-montserrat">
          <span>
            Save lives and make a difference at our Blood Donation Camp during
            Texus Fest! Join us in giving the gift of life by donating blood.
            Together, let&apos;s support a noble cause and spread hope and
            compassion.
          </span>
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/blooddonation.png"}
          alt="laptop"
          width={1920}
          height={1080}
          className="h-64 w-64"
        />
      ),
    },
    {
      title: "WORKSHOPS",
      color: "text-emerald-500",
      pointer: "🎤",
      bg: "bg-gradient-to-b from-[#00FFAE] to-[#0022A7]",
      description: (
        <span className="text-sm md:text-base text-justify font-montserrat">
          <span>
            Enhance your skills at TEXUS &apos;25 with 7+ expert-led workshops
            designed to provide hands-on learning and industry insights.
            Don&apos;t miss this chance to upskill and explore new
            possibilities!
          </span>
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/podium.png"}
          alt="laptop"
          width={1920}
          height={1080}
          className="h-64 w-64"
        />
      ),
    },
    {
      title: "HACKATHON",
      color: "text-orange-500",
      pointer: "👾",
      bg: "bg-gradient-to-b from-[#FF4800] to-[#FF0000]",
      description: (
        <span className="text-sm md:text-base text-justify font-montserrat">
          <span>
            Join HackVerse, empowering tech-savvy youth in India with
            problem-solving skills and global connections. Attend our hybrid
            event for a 24-hour in-person hackathon, embracing Web3 with leading
            tech companies.Sign up now for a promising future.
          </span>
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/hackathon.png"}
          alt="laptop"
          width={1920}
          height={1080}
          className="h-64 w-64"
        />
      ),
    },
    {
      title: "Souvenir",
      color: "text-pink-500",
      pointer: "📗",
      bg: "bg-gradient-to-b from-[#FF104C] to-[#4f003d]",
      description: (
        <span className="text-sm md:text-base text-justify font-montserrat">
          <span>
            Celebrate the spirit of TEXUS &apos;25 with Souvenir, a collection
            of memories, creativity, and achievements from the fest. Featuring
            student-written essays, event highlights, and cherished moments,
            Souvenir preserves the essence of this grand celebration.
          </span>
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/sov.png"}
          alt="laptop"
          width={1920}
          height={1080}
          className="h-64 w-64"
        />
      ),
    },
    {
      title: "WALKATHON",
      color: "text-green-500",
      pointer: "🚶🏻",
      bg: "bg-gradient-to-b from-[#09FF00] to-[#AE8A1C]",
      description: (
        <span className="text-sm md:text-base text-justify font-montserrat">
          <span>
            Join us for the Walkathon at TEXUS &apos;25, a powerful step towards
            a drug-free society. This event is more than just a walk it&apos;s a
            movement to raise awareness about the dangers of substance abuse and
            promote a healthier, addiction-free future.
          </span>
        </span>
      ),
      content: (
        <Image
          src={"/assets/events/gogreen.png"}
          alt="laptop"
          width={1920}
          height={1080}
          className="h-64 w-64"
        />
      ),
    },
  ];

  return (
    <div className="py-12 w-full bg-black relative overflow-hidden">
      <div className="flex flex-col w-full mx-auto max-w-6xl px-4 md:px-6 mb-8">
        <div className="relative inline-block mb-2">
          <h1 className="md:text-5xl text-3xl font-thuast text-white">
            Events
          </h1>
          <div className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 w-full rounded-full" />
        </div>

        <p className="text-md md:text-lg font-montserrat font-light text-gray-300 mb-6 max-w-2xl">
          <span className="text-purple-400 font-medium">TEXUS &apos;25</span> -
          EXPLORE THE EXCITING EVENTS OF THE LARGEST TECH FEST
        </p>

        <div className="mb-8">
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full 
            font-medium tracking-wide hover:opacity-90 transition duration-300"
          >
            Register Now
          </Button>
        </div>
      </div>

      <div className="w-full mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {content.map((event, index) => (
            <EventCard key={index} event={event} index={index} />
          ))}
        </div>
      </div>

      <div className="mt-12 text-center max-w-3xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-thuast text-white mb-3">
          Ready to be part of{" "}
          <span className="text-purple-400">TEXUS &apos;25</span>?
        </h2>
        <p className="text-gray-300 mb-6 font-montserrat">
          Don&apos;t miss out on the most anticipated tech fest of the year.
          Register now to participate in events, workshops, and more!
        </p>
        <Button className="bg-white text-purple-800 hover:bg-purple-100 font-bold py-2 px-6 rounded-full transition duration-300">
          JOIN THE EXCITEMENT
        </Button>
      </div>
    </div>
  );
};

export default Eventspage;
