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
import { Button } from "@/components/ui/button";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

// Define types for props and events
interface Event {
  id: number;
  name: string;
  department: string;
  banner: string;
  hidden?: boolean;
  event_type: string;
}

interface NonTechnicalEventsClientProps {
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

export default function NonTechnicalEventsClient({
  initialEvents,
  initialDepartments,
}: NonTechnicalEventsClientProps) {
  const supabase = createClient();
  const ref = useRef(null);
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [userRegistrations, setUserRegistrations] = useState<number[]>([]);

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
          filter: "event_type=eq.non_technical_event",
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

    // Setup user registrations
    const setupRegistrations = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch user's texus_id
        const { data: userData } = await supabase
          .from("users")
          .select("texus_id")
          .eq("user_auth_id", user.id)
          .single();

        if (userData) {
          // Fetch user's registrations
          const { data: registrations } = await supabase
            .from("registrations")
            .select("event_id")
            .contains("team", [userData.texus_id]);

          if (registrations && registrations.length > 0) {
            const registeredEventIds = registrations.map((reg) => reg.event_id);
            setUserRegistrations(registeredEventIds);
          } else {
            setUserRegistrations([]);
          }

          // Set up real-time subscription for registrations
          const registrationsSubscription = supabase
            .channel("registrations-changes")
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "registrations",
              },
              async () => {
                // When registrations change, refetch user's registrations
                const { data: registrations } = await supabase
                  .from("registrations")
                  .select("event_id")
                  .contains("team", [userData.texus_id]);

                if (registrations && registrations.length > 0) {
                  const registeredEventIds = registrations.map(
                    (reg) => reg.event_id
                  );
                  setUserRegistrations(registeredEventIds);
                } else {
                  setUserRegistrations([]);
                }
              }
            )
            .subscribe();

          return registrationsSubscription;
        }
      }

      return null;
    };

    const registrationsSubscription = setupRegistrations();

    // Cleanup subscriptions
    return () => {
      eventsSubscription.unsubscribe();
      registrationsSubscription.then((sub) => {
        if (sub) {
          sub.unsubscribe();
        }
      });
    };
  }, [supabase, departments]);

  // Rest of your component code...

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

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
    <div className="overflow-x-hidden">
      <motion.div
        className="w-full bg-gradient-to-b from-black to-gray-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Your existing JSX here */}
        {/* ... */}

        {/* The entire UI remains the same, just moved to this client component */}
        <div ref={ref} className="relative w-full overflow-hidden">
          <motion.div style={{ y }} className="h-full">
            <div ref={imageRef} className="h-full">
              <Image
                src="/assets/bgnontech.png"
                alt="Technical Background"
                width={1920}
                height={1080}
                className="w-full h-full object-cover sm:object-contain scale-110"
                priority
              />
            </div>
          </motion.div>

          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <motion.h1
              className="text-3xl mt-28 sm:mt-28 sm:text-5xl font-thuast text-white text-center mb-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Non Technical Events
            </motion.h1>

            <motion.p
              className="text-gray-300 text-center mb-12 max-w-2xl mx-auto px-4"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Experience 15+ exhilarating non-technical events at Texus Fest!
              From workshops to coding challenges,
            </motion.p>
          </div>
        </div>

        <div className="relative overflow-hidden pb-10">
          <Image
            src="/assets/nontecheventsgrid.png"
            alt="Technical Background Lines"
            width={1920}
            height={1080}
            className="absolute inset-0 w-full min-h-full mix-blend-multiply opacity-50"
            priority
          />

          <div className="relative z-10 max-w-[95%] mx-auto px-4 py-12">
            {/* Department and search filters */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start mb-8 gap-4">
              {/* Department dropdown */}
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full sm:w-64"
              >
                {/* Your existing dropdown component */}
                {/* ... */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-black rounded-lg border-2 border-[#FF4500]/50 group-hover:border-[#FF8C00] transition-colors duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-transparent text-gray-300 hover:bg-gray-900/50 flex items-center justify-between transition-colors duration-200"
                    >
                      <span className="font-medium truncate">
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
                    className="absolute top-full left-0 w-full mt-2 bg-transparent backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50 border-2 border-[#FF4500]/30"
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
                        whileHover={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          x: 0,
                        }}
                        className="flex items-center px-4 py-3 transition-colors cursor-pointer relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF4500]/0 to-[#FF8C00]/0 group-hover:from-[#FF4500]/10 group-hover:to-[#FF8C00]/10 transition-all duration-300" />
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(
                            dept === "all" ? "all" : dept
                          )}
                          onChange={() => handleDepartmentChange(dept)}
                          className="mr-3 h-4 w-4 rounded border-gray-300 text-white focus:ring-[#FF4500]"
                        />
                        <span
                          className={`text-gray-300 transition-all duration-200 ${
                            selectedDepartments.includes(dept)
                              ? "text-white font-medium"
                              : ""
                          }`}
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
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-black rounded-lg border-2 border-[#FF4500]/50 group-hover:border-[#FF8C00] transition-colors duration-200">
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent px-4 py-3 text-gray-300 placeholder-gray-500 outline-none rounded-lg"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: searchQuery ? 1 : 0,
                    y: searchQuery ? 0 : 10,
                  }}
                  className="absolute -bottom-8 left-0 text-sm text-gray-400"
                >
                  {searchQuery &&
                    `Found ${filteredEvents.length} event${
                      filteredEvents.length !== 1 ? "s" : ""
                    }`}
                </motion.div>
              </motion.div>
            </div>

            {/* Event grid */}
            <motion.div
              ref={scrollRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12"
              variants={containerVariants}
              initial="hidden"
              animate={hasAnimated ? "visible" : "hidden"}
            >
              {filteredEvents.length !== 0 ? (
                filteredEvents
                  .filter((event) => !event.hidden)
                  .map((event, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      custom={index}
                      className="relative w-full aspect-[16/9] min-h-[200px] mb-28 sm:min-h-fit p-[4px] group"
                    >
                      {/* Event card */}
                      <Link href={`/event/${event.id}`}>
                        <div
                          rel="noopener noreferrer"
                          className="cursor-pointer relative bg-black block p-[2px] rounded-xl group transition-all duration-300"
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div
                            className="absolute inset-0 bg-black rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                            style={{
                              background: mousePosition
                                ? `radial-gradient(150px circle at ${mousePosition.x}px ${mousePosition.y}px,rgb( 239, 50, 4), transparent 70%)`
                                : "none",
                              maskImage: "linear-gradient(#000 0 0)",
                              maskComposite: "exclude",
                              WebkitMaskComposite: "xor",
                            }}
                          />
                          <div className="hover:shadow-md bg-black transition-shadow rounded-xl p-4 shadow-sm relative overflow-hidden h-full border-2 border-[rgb(229,231,235)] hover:border-[rgb(255,255,255,0.5)]">
                            <Image
                              src={event.banner}
                              alt={event.name}
                              width={1920}
                              height={1080}
                              className="object-cover rounded-lg"
                              priority
                            />
                            <div
                              className="pointer-events-none bg-black absolute -inset-px opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                              style={{
                                background: mousePosition
                                  ? `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba( 239, 50, 4, 0.3), transparent 40%)`
                                  : "none",
                              }}
                            />

                            <div className="inline-block bg-black border-2 border-black text-black text-xs px-2 py-1 rounded-lg"></div>

                            <h3
                              className={`${montserrat.className} text-xl text-white font-medium mt-3 mb-2 line-clamp-2 group-hover:line-clamp-none transition-all duration-300`}
                              title={event.name}
                            >
                              {event.name}
                            </h3>
                            <div className="flex flex-row justify-between">
                              <Button
                                className={`${montserrat.className} text-black font-medium mt-3 mb-2 line-clamp-2 group-hover:line-clamp-none transition-all duration-300`}
                                title={event.name}
                              >
                                View Details
                              </Button>
                              <div className="pt-3 flex items-center gap-2 font-montserrat">
                                {userRegistrations.includes(event.id) && (
                                  <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 px-2 py-1">
                                    Registered
                                  </Badge>
                                )}
                                <Badge>
                                  <h3>{event.department}</h3>
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
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
                    className="text-3xl md:text-4xl font-bold text-[#EEE500] mb-4 font-thuast"
                  >
                    Events Will Be Announced Soon!
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-300 text-lg md:text-xl max-w-2xl font-thuast"
                  >
                    Stay tuned for exciting Non-technical events. Follow us on
                    social media for updates!
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
