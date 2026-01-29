"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ChevronDown, Search } from "lucide-react";
import { createClient } from "@/supabase/client";
import { Montserrat } from "next/font/google";
import { Badge } from "@/components/ui/badge";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

// Paper theme colors
const PAPER = {
  bg: "#F2F2F2",
  ink: "#12590F",
  accent: "#79A677",
  lightAccent: "#ABBFA8",
  shadow: "#12590F",
  white: "#FFFFFF",
};

// Define types for props and events
interface Event {
  id: number;
  name: string;
  department: string;
  banner: string;
  hidden?: boolean;
  event_type: string;
}

interface WorkshopClientProps {
  initialEvents: Event[];
  initialDepartments: string[];
}

const useScrollAnimation = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      setHasAnimated(true);
    }
  }, [isInView]);

  return { ref, hasAnimated };
};

export default function WorkshopClient({
  initialEvents,
  initialDepartments,
}: WorkshopClientProps) {
  const supabase = createClient();
  const ref = useRef(null);
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const { ref: scrollRef, hasAnimated } = useScrollAnimation();

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    "all",
  ]);
  const [departments, setDepartments] = useState<string[]>(initialDepartments);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial zoom animation
    gsap.fromTo(
      imageRef.current,
      {
        scale: 1.2,
      },
      {
        scale: 1,
        duration: 5,
        ease: "power2.out",
      }
    );
  }, []);

  useEffect(() => {
    // Set up real-time subscription
    const eventsSubscription = supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: "event_type=eq.workshop",
        },
        (payload) => {
          console.log("Real-time event update received:", payload);

          // Handle different types of changes efficiently
          if (payload.eventType === "INSERT") {
            // Add new event to state
            setEvents((currentEvents) => [
              ...currentEvents,
              payload.new as Event,
            ]);

            // Update departments if needed
            if (!departments.includes(payload.new.department)) {
              setDepartments((prev) => [...prev, payload.new.department]);
            }
          } else if (payload.eventType === "UPDATE") {
            // Update existing event in state
            setEvents((currentEvents) =>
              currentEvents.map((event) =>
                event.id === payload.new.id ? (payload.new as Event) : event
              )
            );
          } else if (payload.eventType === "DELETE") {
            // Remove deleted event from state
            setEvents((currentEvents) =>
              currentEvents.filter((event) => event.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      eventsSubscription.unsubscribe();
    };
  }, [supabase, departments]);

  // Filter events based on selected department and search query
  const filteredEvents = events
    .filter(
      (event) =>
        selectedDepartments.includes("all") ||
        selectedDepartments.includes(event.department)
    )
    .filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Modified containerVariants to remove staggered effect for simultaneous fade-in
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5, // Single duration for the whole container
      },
    },
  };

  // Modified itemVariants to have consistent animation
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.4,
      },
    },
  };

  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartments((prev) => {
      // If selecting "all", clear other selections
      if (dept === "all") {
        return ["all"];
      }

      // If currently "all" is selected and selecting another department,
      // switch to only that department
      if (prev.includes("all")) {
        return [dept];
      }

      // Toggle the selected department
      const newSelection = prev.includes(dept)
        ? prev.filter((d) => d !== dept)
        : [...prev, dept];

      // If no departments selected, default to "all"
      return newSelection.length === 0 ? ["all"] : newSelection;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
  };

  return (
    <div className="overflow-x-hidden relative min-h-screen">
      {/* Background with hero image and paper texture */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `${PAPER.bg} url('/assets/hero-bg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `url('/textures/paper.png')`,
            backgroundRepeat: "repeat",
            opacity: 0.5,
          }}
        />
      </div>

      <motion.div
        className="w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div ref={ref} className="relative w-full overflow-hidden pt-20 sm:pt-24 md:pt-28">
          <div className="container mx-auto px-4">
            <motion.h1
              className="text-4xl sm:text-6xl font-extrabold text-center mb-4"
              style={{ 
                color: PAPER.ink,
                fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', 'Kalam', ui-rounded, system-ui)",
              }}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Workshops
            </motion.h1>

            <motion.p
              className="text-center mb-12 max-w-2xl mx-auto px-4"
              style={{ 
                color: PAPER.ink, 
                opacity: 0.8,
                fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
              }}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Experience 20+ exhilarating tech events at Texus Fest! From
              workshops to coding challenges
            </motion.p>
          </div>
        </div>
        <div className="relative overflow-hidden pb-10">
          <div className="relative z-10 max-w-[95%] mx-auto px-4 py-12">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start mb-8 gap-4">
              {/* Department dropdown */}
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full sm:w-64"
              >
                <div className="relative">
                  <div 
                    className="relative rounded-xl"
                    style={{
                      background: `${PAPER.bg} url('/textures/paper.png')`,
                      border: `3px solid ${PAPER.ink}`,
                      boxShadow: `4px 4px 0 ${PAPER.shadow}`,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                      className="w-full px-4 py-3 rounded-xl flex items-center justify-between transition-colors duration-200"
                      style={{ color: PAPER.ink }}
                    >
                      <span className="font-bold truncate">
                        {selectedDepartments.includes("all")
                          ? "All Departments"
                          : `${selectedDepartments.length} Selected`}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      height: "auto",
                    }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="absolute top-full left-0 w-full mt-2 rounded-xl shadow-lg overflow-hidden z-50"
                    style={{
                      background: `${PAPER.bg} url('/textures/paper.png')`,
                      border: `3px solid ${PAPER.ink}`,
                      boxShadow: `4px 4px 0 ${PAPER.shadow}`,
                    }}
                  >
                    {["all", ...departments].map((dept, index) => (
                      <motion.label
                        key={dept}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{
                          x: 0,
                          opacity: 1,
                          transition: { delay: index * 0.05 },
                        }}
                        className="flex items-center px-4 py-3 transition-colors cursor-pointer relative group hover:bg-white/30"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(
                            dept === "all" ? "all" : dept
                          )}
                          onChange={() => handleDepartmentChange(dept)}
                          className="mr-3 h-4 w-4 rounded"
                          style={{
                            accentColor: PAPER.accent,
                          }}
                        />
                        <span
                          className={`transition-all duration-200 font-bold ${
                            selectedDepartments.includes(dept)
                              ? "font-extrabold"
                              : ""
                          }`}
                          style={{ 
                            color: selectedDepartments.includes(dept) ? PAPER.accent : PAPER.ink,
                          }}
                        >
                          {dept === "all" ? "All Departments" : dept}
                        </span>
                      </motion.label>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full"
              >
                <div className="relative">
                  <div 
                    className="relative rounded-xl"
                    style={{
                      background: `${PAPER.bg} url('/textures/paper.png')`,
                      border: `3px solid ${PAPER.ink}`,
                      boxShadow: `4px 4px 0 ${PAPER.shadow}`,
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent px-4 py-3 outline-none rounded-xl font-bold"
                      style={{ 
                        color: PAPER.ink,
                      }}
                    />
                    <Search 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                      style={{ color: PAPER.ink }}
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: searchQuery ? 1 : 0,
                    y: searchQuery ? 0 : 10,
                  }}
                  className="absolute -bottom-8 left-0 text-sm font-bold"
                  style={{ color: PAPER.ink, opacity: 0.7 }}
                >
                  {searchQuery &&
                    `Found ${filteredEvents.length} event${
                      filteredEvents.length !== 1 ? "s" : ""
                    }`}
                </motion.div>
              </motion.div>
            </div>

            {/* Events Grid */}
            <motion.div
              ref={scrollRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12"
              variants={containerVariants}
              initial="hidden"
              animate={hasAnimated ? "visible" : "hidden"}
            >
              {filteredEvents.length > 0 ? (
                filteredEvents
                  .filter((event) => !event.hidden)
                  .map((event, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      custom={index}
                      className="relative w-full"
                    >
                      <Link href={`/event/${event.id}`}>
                        <div 
                          className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 group relative"
                          style={{
                            background: `${PAPER.bg} url('/textures/paper.png')`,
                            border: `3px solid ${PAPER.ink}`,
                            boxShadow: `6px 6px 0 ${PAPER.shadow}`,
                          }}
                        >
                          {/* Tape decoration */}
                          <img 
                            src="/textures/tape.png" 
                            alt=""
                            className="absolute -top-4 left-8 w-16 h-auto z-10 opacity-80"
                          />
                          
                          <div className="p-4">
                            {/* Event banner */}
                            <div className="relative mb-4 rounded-lg overflow-hidden">
                              {event.banner && (
                                <Image
                                  src={event.banner}
                                  alt={event.name}
                                  width={1920}
                                  height={1080}
                                  className="object-cover w-full h-48 rounded-lg"
                                  priority
                                />
                              )}
                            </div>

                            {/* Event name */}
                            <h3
                              className="text-xl font-bold mb-3 line-clamp-2"
                              style={{ 
                                color: PAPER.ink,
                                fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', ui-rounded, system-ui)",
                              }}
                              title={event.name}
                            >
                              {event.name}
                            </h3>

                            {/* Button and badge row */}
                            <div className="flex flex-row justify-between items-center gap-2">
                              <button
                                className="px-4 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105"
                                style={{
                                  background: "linear-gradient(135deg, #D9695F 0%, #F27E7E 100%)",
                                  color: PAPER.white,
                                  border: `2px solid ${PAPER.ink}`,
                                  boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                                }}
                              >
                                View Details
                              </button>
                              
                              <Badge 
                                className="px-2 py-1 rounded-md font-bold border-2"
                                style={{ 
                                  background: PAPER.lightAccent,
                                  color: PAPER.ink,
                                  borderColor: PAPER.ink,
                                }}
                              >
                                {event.department}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
              ) : events.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center min-h-[200px] text-center"
                >
                  <h3 
                    className="text-2xl font-bold mb-2"
                    style={{ 
                      color: PAPER.accent,
                      fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', ui-rounded, system-ui)",
                    }}
                  >
                    No events found for this department
                  </h3>
                  <p 
                    style={{ 
                      color: PAPER.ink,
                      opacity: 0.8,
                      fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
                    }}
                  >
                    Please try selecting a different department
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center min-h-[400px] text-center"
                >
                  <motion.h3
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ 
                      color: PAPER.accent,
                      fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', ui-rounded, system-ui)",
                    }}
                  >
                    Events Will Be Announced Soon!
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl max-w-2xl"
                    style={{ 
                      color: PAPER.ink,
                      opacity: 0.8,
                      fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
                    }}
                  >
                    Stay tuned for exciting workshops. Follow us on social media
                    for updates!
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
