"use client";

import Image from "next/image";
// import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  IndianRupee,
  CalendarClock,
  MapPin,
  Users,
  TriangleAlert,
  TriangleAlertIcon,
  X,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

import { createClient } from "@/supabase/client";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

import { Badge } from "./ui/badge";
import { cn, encrypt } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  UserIcon,
  PlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/auth";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";
import { toast } from "sonner";

type UserProfile = {
  texus_id: string;
  name: string;
  email: string;
  contact_number: string;
  profile_pic?: string;
  user_auth_id: string;
};

type Event = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  rules: string[];
  venue: string;
  datetime: string;
  fee: number;
  prizes: Prize[];
  max_participants: number;
  min_participants: number;
  slots: number;
  student_coordinators: Studentcoordinator[];
  faculty_coordinators: Studentcoordinator[];
  department: string;
  banner: string;
  event_type: string;
  organized_by: string;
  site_url?: string;
};

type Prize = {
  title: string;
  description: string;
};

type Studentcoordinator = {
  name: string;
  contact: string;
};

type TeamMember = {
  texusId: string;
  name: string;
  email: string;
  phone: string;
  profile_pic?: string;
  user_auth_id: string;
};

type Registration = {
  id: number;
  event_id: number;
  team: string[];
  amount: number;
  payment_status: string;
  attended: boolean;
};

const getColorScheme = (eventType: string) => {
  return eventType === "workshop"
    ? {
        bg: "bg-emerald-500 hover:bg-emerald-600 text-white",
        border: "border-emerald-500",
        borderHover: "hover:border-emerald-600",
        shadow: "hover:shadow-emerald-500/40",
        text: "text-emerald-500",
        gradient: "from-emerald-500 to-emerald-600",
      }
    : eventType === "non_technical_event"
    ? {
        bg: "bg-[#FF4500] hover:bg-[#FF8C00] text-white",
        border: "border-[#FF4500]",
        borderHover: "hover:border-[#FF8C00]",
        shadow: "hover:shadow-[#FF4500]/40",
        text: "text-[#FF4500]",
        gradient: "from-[#FF4500] to-[#FF8C00]",
      }
    : {
        bg: "bg-purple-500 hover:bg-purple-700 text-white",
        border: "border-purple-500",
        borderHover: "hover:border-purple-500",
        shadow: "hover:shadow-purple-500/40",
        text: "text-purple-400",
        gradient: "from-purple-600 to-pink-600",
      };
};

export default function EventDescriptionPageClient({
  event,
  initialUser,
  initialUserData,
}: {
  event: Event;
  initialUser: User | null;
  initialUserData: UserProfile | null;
}) {
  const [eventData, setEventData] = useState<Event>(event);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentTexusId, setCurrentTexusId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!initialUser);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(
    initialUserData
      ? {
          texusId: initialUserData.texus_id,
          name: initialUserData.name,
          email: initialUserData.email,
          phone: initialUserData.contact_number.toString(),
          profile_pic: initialUserData.profile_pic,
          user_auth_id: initialUserData.user_auth_id,
        }
      : null
  );
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [referralCode, setReferralCode] = useState("");
  const expectedReferralCode = useMemo(() => {
    if (
      eventData?.event_type === "workshop" &&
      eventData?.rules &&
      eventData?.rules[0]
    ) {
      const parts = eventData.rules[0].split(":");
      return parts.length > 1 ? parts[1].trim() : "";
    }
    return "";
  }, [eventData]);

  const router = useRouter();

  // Memoize color scheme calculation
  const colorScheme = useMemo(
    () => getColorScheme(eventData.event_type),
    [eventData.event_type]
  );

  // Fetch registration count with useCallback
  const fetchRegistrationCount = useCallback(async () => {
    try {
      const supabase = createClient();
      const { count, error } = await supabase
        .from("registrations")
        .select("*", { count: "exact" })
        .eq("event_id", event.id);

      if (error) throw error;
      setRegistrationCount(count || 0);
    } catch (err) {
      console.error("Error fetching registration count:", err);
    }
  }, [event.id]);

  useEffect(() => {
    const checkUserRegistration = async () => {
      // Skip if we don't have a user
      if (!currentUser) return;

      const supabase = createClient();
      // Check if user is registered for this event
      const { data: registrationData } = await supabase
        .from("registrations")
        .select("*")
        .eq("event_id", event.id)
        .contains("team", [currentUser.texusId]);

      if (registrationData && registrationData.length > 0) {
        setIsAlreadyRegistered(true);
      } else {
        setIsAlreadyRegistered(false);
      }

      // Fetch initial registration count
      await fetchRegistrationCount();
    };

    // If we already have user data from the server, just check registration
    if (initialUserData) {
      checkUserRegistration();
    } else {
      // Otherwise do the full auth check
      const checkUserAuth = async () => {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setIsUserLoggedIn(!!user);

        if (user) {
          // Get current user's details
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("user_auth_id", user.id)
            .single();

          if (userData) {
            const currentUserData: TeamMember = {
              texusId: userData.texus_id,
              name: userData.name,
              email: userData.email,
              phone: userData.contact_number,
              profile_pic: userData.profile_pic,
              user_auth_id: userData.user_auth_id,
            };
            setCurrentUser(currentUserData);

            // Then check registration status
            const { data: registrationData } = await supabase
              .from("registrations")
              .select("*")
              .eq("event_id", event.id)
              .contains("team", [userData.texus_id]);

            if (registrationData && registrationData.length > 0) {
              setIsAlreadyRegistered(true);
            } else {
              setIsAlreadyRegistered(false);
            }
          }
        }

        // Fetch initial registration count
        await fetchRegistrationCount();
      };

      checkUserAuth();
    }

    // Set up real-time subscription for event updates and registrations
    const supabase = createClient();

    // Event updates subscription
    const eventSubscription = supabase
      .channel("event-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `id=eq.${event.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Event>) => {
          console.log("Real-time event update:", payload);
          if (payload.new) {
            setEventData(payload.new as Event);
          }
        }
      )
      .subscribe();

    // Registration updates subscription
    const registrationSubscription = supabase
      .channel("registration-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
          filter: `event_id=eq.${event.id}`,
        },
        async (payload: RealtimePostgresChangesPayload<Registration>) => {
          console.log("Real-time registration update:", payload);

          // Update registration count
          await fetchRegistrationCount();

          // If current user exists, check if they're part of any registration for this event
          if (currentUser) {
            const { data: registrationData } = await supabase
              .from("registrations")
              .select("*")
              .eq("event_id", event.id)
              .contains("team", [currentUser.texusId]);

            setIsAlreadyRegistered(
              !!registrationData && registrationData.length > 0
            );
          }

          // Update the list of registered users for search filtering
          const { data: registeredUsers } = await supabase
            .from("registrations")
            .select("team")
            .eq("event_id", event.id);

          const registeredTexusIds = new Set(
            registeredUsers?.flatMap((registration) => registration.team) || []
          );

          // Update search results to exclude newly registered users
          setSearchResults((prevResults) =>
            prevResults.filter((user) => !registeredTexusIds.has(user.texusId))
          );
        }
      )
      .subscribe();

    // Add a specific subscription for the current user's registration status
    let userRegistrationSubscription: RealtimeChannel | null = null;

    if (currentUser) {
      userRegistrationSubscription = supabase
        .channel("user-registration-status")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
            table: "registrations",
            // We don't filter by event_id here to catch any registration change that might include this user
          },
          async () => {
            // When any registration changes, check if the current user is registered for this event
            if (currentUser) {
              const { data: userRegistrations } = await supabase
                .from("registrations")
                .select("*")
                .eq("event_id", event.id)
                .contains("team", [currentUser.texusId]);

              setIsAlreadyRegistered(
                !!userRegistrations && userRegistrations.length > 0
              );
            }
          }
        )
        .subscribe();
    }

    // Cleanup subscriptions
    return () => {
      eventSubscription.unsubscribe();
      registrationSubscription.unsubscribe();
      if (userRegistrationSubscription) {
        userRegistrationSubscription.unsubscribe();
      }
    };
  }, [event.id, fetchRegistrationCount, currentUser, initialUserData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // const { toast } = useToast();

  // Optimize user search with useCallback
  const searchUser = useCallback(
    async (texusId: string) => {
      if (texusId.length < 2) return;

      setIsSearching(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .ilike("texus_id", `%${texusId}%`)
          .limit(5);

        if (error) throw error;

        const formattedResults = data?.map(
          (user: {
            texus_id: string;
            name: string;
            email: string;
            phone: string;
            contact_number: string;
            profile_pic?: string;
            user_auth_id: string;
          }) => ({
            texusId: user.texus_id,
            name: user.name,
            email: user.email,
            phone: user.contact_number,
            profile_pic: user.profile_pic,
            user_auth_id: user.user_auth_id,
          })
        );

        // Filter out users that are already in the team
        const filteredResults = formattedResults?.filter(
          (user) =>
            !teamMembers.some((member) => member.texusId === user.texusId)
        );

        setSearchResults(filteredResults || []);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error("Error searching for user:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [teamMembers]
  );

  // Optimize handlers with useCallback
  const handleSelectUser = useCallback(
    (user: TeamMember) => {
      setTeamMembers((prev) => {
        if (prev.length < eventData?.max_participants) {
          return [...prev, user];
        }
        return prev;
      });
      setCurrentTexusId("");
      setSearchResults([]);
      setIsDropdownOpen(false);
    },
    [eventData?.max_participants]
  );

  const handleRemoveTeamMember = useCallback((texusId: string) => {
    setTeamMembers((prev) =>
      prev.filter((member) => member.texusId !== texusId)
    );
  }, []);

  const handleSubmitTeam = async () => {
    // Check if event is full
    if (registrationCount >= eventData.slots) {
      toast.error(
        "This event is already at full capacity. No more slots available."
      );
      return;
    }

    if (teamMembers.length < eventData?.min_participants) return;

    // No validation for referral code, just proceed with whatever was entered

    // Create a new registration object
    const newRegistration = {
      event_id: eventData.id,
      team: teamMembers.map((member) => member.texusId),
      amount: eventData.fee,
      payment_status: "pending",
      attended: false,
      referral: referralCode === "" ? false : referralCode,
    };

    const encryptedRegistration = encrypt(
      JSON.stringify(newRegistration),
      currentUser?.user_auth_id || ""
    );

    const url = new URL("/payment_portal", window.location.origin);
    url.searchParams.set("registrationData", encryptedRegistration);

    router.push(url.toString());
  };

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsModalOpen(open);
      if (open && currentUser && teamMembers.length === 0) {
        setTeamMembers([currentUser]);
      }
    },
    [currentUser, teamMembers.length]
  );

  const [showWarningPopup, setShowWarningPopup] = useState(true);

  if (!eventData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-white text-2xl">event not found</h1>
      </div>
    );
  }

  // Enhanced and simplified motion animations
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  // const staggerContainer = {
  //   animate: {
  //     transition:
  //       staggerChildren: 0.1,
  //     },
  //   },
  // };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black"
    >
      {/* Fixed Warning Popup */}
      {eventData.event_type !== "hackathon" && showWarningPopup && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
          className="fixed right-0 top-1/3 z-50 max-w-xs w-full transform -translate-y-1/2 pr-4 md:pr-6"
        >
          <div
            className={`bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl 
            p-4 rounded-lg border-l-4 ${colorScheme.border} shadow-lg relative`}
          >
            <button
              onClick={() => setShowWarningPopup(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`${colorScheme.text} h-5 w-5 flex-shrink-0 mt-0.5`}
              />
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">
                  Participation Eligibility
                </h4>
                <p className="text-xs text-gray-300 font-montserrat">
                  Students from other institutions and colleges are allowed to
                  register for this event.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <main className="container max-w-7xl mx-auto px-4 py-16 md:py-24 space-y-6 md:space-y-8">
        {/* Warning banner for SRMIST Ramapuram students */}
        {/* {eventData.event_type !== "workshop" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full bg-gradient-to-r from-amber-500/20 to-yellow-600/30 border border-amber-500/40 rounded-lg p-4 mt-6 mb-2 backdrop-blur-sm shadow-inner"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-400 h-6 w-6 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-amber-200 font-montserrat font-medium text-lg">
                  Important Notice for SRMIST Ramapuram Students
                </p>
                <p className="text-gray-300 font-montserrat text-sm">
                  Students from SRMIST Ramapuram campus are not permitted to
                  participate in this event. Please note that if you have
                  already purchased tickets, they are non-refundable.
                </p>
              </div>
            </div>
          </motion.div>
        )} */}
        {/* Hero Section with improved styling */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-xl overflow-hidden shadow-xl"
          whileHover={{ scale: 1.01 }}
        >
          <Image
            src={eventData!.banner}
            alt={eventData!.name}
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            priority
          />

          {/* Always visible gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
            <div className="absolute bottom-0 p-6 md:p-8 w-full">
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 font-mont">
                {eventData?.name}
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="w-full px-4">
          {event.event_type !== "workshop" && (
            <h1 className="text-xl md:text-3xl font-thuast">
              Organised By {event.organized_by}
            </h1>
          )}
          <Badge>
            <h1 className="font-montserrat">{event.department}</h1>
          </Badge>
        </div>

        {/* <div className="flex flex-row gap-x-2 w-full h-full justify-center items-center">
          <Progress value={0} />
          <div className="justify-center items-center">
            <h1 className="font-montserrat"> 0/{event.slots}</h1>
          </div>
        </div> */}

        {/* Slot information with improved styling */}
        <div className="flex flex-col gap-3 w-full bg-black/30 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="font-montserrat font-bold text-xl md:text-2xl">
              {Number(event.slots) - Number(registrationCount) > 0 ? (
                <>
                  <span className={`${colorScheme.text}`}>
                    {Number(event.slots) - Number(registrationCount)}
                  </span>{" "}
                  Slots left
                </>
              ) : (
                <span className="text-rose-500">No Slots Available</span>
              )}
            </h1>
            <Badge
              variant="outline"
              className={`${colorScheme.bg} border-none`}
            >
              {registrationCount} registered
            </Badge>
          </div>
          {Number(event.slots) - Number(registrationCount) <= 0 && (
            <div className="flex items-center mt-1">
              <AlertTriangle className="text-rose-500" size={20} />
              <h1 className="font-montserrat text-sm md:text-base ml-2 text-rose-300">
                This event is at full capacity
              </h1>
            </div>
          )}
          {eventData.event_type !== "hackathon" && (
            <div className="flex items-center">
              <TriangleAlertIcon className="text-amber-500" size={20} />
              <h1 className="font-montserrat text-sm md:text-base ml-2">
                Venue is subject to change
              </h1>
            </div>
          )}
        </div>

        <motion.div
          // variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {/* Left Column - Event details */}
          <motion.div variants={fadeInUp} className="space-y-6 md:space-y-8">
            {/* Event Details Card with improved styling */}
            <Card
              className={`bg-black/60 backdrop-blur-sm ${colorScheme.border} ${colorScheme.borderHover} hover:shadow-lg ${colorScheme.shadow} transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className="text-white font-thuast font-thin">
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Venue",
                    value: event.venue,
                    icon: <MapPin size={28} className={colorScheme.text} />,
                  },
                  {
                    label: "Date & Time",
                    value: eventData?.datetime
                      ? new Date(eventData.datetime).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "",
                    icon: (
                      <CalendarClock size={28} className={colorScheme.text} />
                    ),
                  },
                  {
                    label: "Entry Fee",
                    value: event.fee,
                    icon: (
                      <IndianRupee size={28} className={colorScheme.text} />
                    ),
                  },
                  {
                    label: "Team Size",
                    value:
                      event.min_participants === event.max_participants
                        ? event.min_participants === 1
                          ? "Solo"
                          : `${event.max_participants}`
                        : event.max_participants === 1
                        ? "Solo"
                        : `${event.min_participants} - ${event.max_participants}`,
                    icon: <Users size={28} className={colorScheme.text} />,
                  },
                ].map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex flex-col gap-2 justify-center items-start bg-black/50 p-4 rounded-lg border ${colorScheme.border}`}
                  >
                    <div className="flex flex-row items-center gap-2">
                      {detail.icon && (
                        <div className={colorScheme.text}>{detail.icon}</div>
                      )}
                      <span
                        className={cn(
                          "uppercase text-sm font-bold",
                          colorScheme.text
                        )}
                      >
                        {detail.label}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm font-medium font-montserrat ">
                      {detail.label === "Entry Fee" && event.id === 2599
                        ? "Free"
                        : detail.value}
                    </span>
                  </motion.div>
                ))}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {eventData.event_type === "hackathon" &&
                  eventData?.site_url && (
                    <Button
                      asChild
                      className={`w-full group overflow-hidden relative rounded-xl ${colorScheme.bg} font-thuast transition-all duration-300 hover:shadow-lg ${colorScheme.shadow}  flex items-center justify-center gap-2`}
                    >
                      <Link href={eventData?.site_url} target="_blank">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex justify-center items-center"
                        >
                          <span className="text-white group-hover:text-white text-md font-medium">
                            Visit Hackathon Website
                          </span>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                          </div>
                        </motion.div>
                      </Link>
                    </Button>
                  )}
                {!isUserLoggedIn &&
                teamMembers.length === 0 &&
                event.id !== 2599 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full space-y-4"
                  >
                    <div
                      className={`p-4 rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/20 to-yellow-600/30 backdrop-blur-sm shadow-inner flex flex-col space-y-1 relative overflow-hidden`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle
                          className={`text-amber-500/40 h-5 w-5`}
                        />
                        <p className="text-gray-200 font-montserrat font-medium">
                          You need to log in to register for this event
                        </p>
                      </div>
                      <p className="text-sm text-gray-400 pl-8 font-montserrat">
                        Please log in to continue with event registration
                      </p>
                    </div>

                    <Button
                      onClick={() => signInWithGoogle()}
                      className={`w-full group overflow-hidden relative rounded-xl ${colorScheme.bg} font-thuast transition-all duration-300 hover:shadow-lg ${colorScheme.shadow}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-3 flex justify-center items-center"
                      >
                        <div className="text-white group-hover:text-white text-lg font-medium">
                          Register Now
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                        </div>
                      </motion.div>
                    </Button>
                  </motion.div>
                ) : isAlreadyRegistered && event.id !== 2599 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full space-y-4"
                  >
                    <div
                      className={`p-4 rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/20 to-yellow-600/30 backdrop-blur-sm shadow-inner flex flex-col space-y-1 relative overflow-hidden`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className={`text-amber-500/40 h-5 w-5`} />
                        <p className="text-gray-200 font-montserrat font-medium">
                          You have already registered for this event
                        </p>
                      </div>
                      <p className="text-sm text-gray-400 pl-8 font-montserrat">
                        Check your registration details in your profile
                      </p>
                    </div>
                  </motion.div>
                ) : event.id !== 2599 ? (
                  <Dialog
                    open={isModalOpen}
                    onOpenChange={handleDialogOpenChange}
                  >
                    {/* <p></p> */}
                    <DialogTrigger
                      suppressHydrationWarning
                      className={`w-full group overflow-hidden relative rounded-xl ${colorScheme.bg} font-thuast transition-all duration-300 hover:shadow-lg ${colorScheme.shadow}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-3 flex justify-center items-center"
                      >
                        <div className="text-white group-hover:text-white text-lg font-medium">
                          Register Now
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                        </div>
                      </motion.div>
                    </DialogTrigger>

                    <DialogContent className="border-0  overflow-y-auto p-4 overflow-hidden max-w-2xl text-white bg-transparent shadow-2xl">
                      <DialogTitle
                        hidden
                        className="text-white font-thuast font-thin"
                      >
                        Register for {eventData.name}
                      </DialogTitle>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl overflow-hidden"
                      >
                        {/* Modern Banner & Header */}
                        <div className="relative h-32 overflow-hidden">
                          <Image
                            src={eventData.banner}
                            alt={eventData.name}
                            layout="fill"
                            objectFit="cover"
                            className="opacity-30"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-gray-900"></div>
                          <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium w-fit mb-2 ${colorScheme.bg}`}
                            >
                              {eventData.event_type.charAt(0).toUpperCase() +
                                eventData.event_type
                                  .slice(1)
                                  .split("_")
                                  .join(" ")}
                            </div>
                            <h3
                              className={`text-2xl font-bold font-montserrat ${colorScheme.text}`}
                            >
                              {eventData.name}
                            </h3>
                          </div>
                        </div>

                        <div className="p-6 space-y-6">
                          {/* Event Details Summary */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center p-4 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-800">
                              <CalendarIcon
                                className={`${colorScheme.text} mb-2`}
                                size={18}
                              />
                              <span className="text-xs text-gray-400">
                                Date
                              </span>
                              <span className="text-sm font-medium">
                                {new Date(
                                  eventData.datetime
                                ).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>

                            <div className="flex flex-col items-center p-4 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-800">
                              <MapPinIcon
                                className={`${colorScheme.text} mb-2`}
                                size={18}
                              />
                              <span className="text-xs text-gray-400">
                                Venue
                              </span>
                              <span className="text-sm font-medium truncate max-w-full">
                                {eventData.venue}
                              </span>
                            </div>

                            <div className="flex flex-col items-center p-4 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-800">
                              <CreditCardIcon
                                className={`${colorScheme.text} mb-2`}
                                size={18}
                              />
                              <span className="text-xs text-gray-400">Fee</span>
                              <span className="text-sm font-medium">
                                {eventData.fee > 0
                                  ? `₹${eventData.fee}`
                                  : "Free"}
                              </span>
                            </div>
                          </div>

                          {/* Team Members Section */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="space-y-1">
                                <h4 className="font-medium">Team Members</h4>
                                <p className="text-xs text-gray-400">
                                  {teamMembers.length > 0
                                    ? `${teamMembers.length} of ${eventData.max_participants} members added`
                                    : "Add your team members"}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 bg-gray-800/30 rounded-full px-3 py-1">
                                <Users size={14} className={colorScheme.text} />
                                <span className="text-xs font-medium">
                                  {teamMembers.length}/
                                  {eventData.max_participants}
                                </span>
                              </div>
                            </div>

                            {/* Team Members List with modern styling */}
                            {teamMembers.length > 0 ? (
                              <div className="space-y-2 mb-4">
                                {teamMembers.map((member) => (
                                  <motion.div
                                    key={member.texusId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-200"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Avatar
                                        className={`h-9 w-9 border ${colorScheme.border} shadow-sm`}
                                      >
                                        {member.profile_pic ? (
                                          <AvatarImage
                                            src={member.profile_pic}
                                            alt={member.name}
                                          />
                                        ) : (
                                          <AvatarFallback
                                            className={`${colorScheme.bg} text-xs font-medium`}
                                          >
                                            {member.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        )}
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-medium tracking-tight">
                                          {member.name}
                                        </p>
                                        <div className="flex items-center">
                                          <UserIcon
                                            size={10}
                                            className="text-gray-500 mr-1"
                                          />
                                          <p className="text-xs text-gray-400">
                                            {member.texusId}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    {member.texusId !==
                                      currentUser?.texusId && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-400"
                                        onClick={() =>
                                          handleRemoveTeamMember(member.texusId)
                                        }
                                      >
                                        <X
                                          size={16}
                                          className="text-gray-400 group-hover:text-red-400"
                                        />
                                      </Button>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center p-6 rounded-xl bg-gray-900/40 border border-dashed border-gray-800 mb-4">
                                <div className="text-center">
                                  <Users
                                    size={24}
                                    className="mx-auto mb-2 text-gray-600"
                                  />
                                  <p className="text-sm text-gray-400">
                                    No team members added yet
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Modern Search Input */}
                            {teamMembers.length <
                              eventData.max_participants && (
                              <div className="relative" ref={searchRef}>
                                <div className="flex items-center px-4 py-3 rounded-xl bg-gray-900/60 border border-gray-800 focus-within:border-gray-700 focus-within:ring-1 focus-within:ring-gray-700 transition-all duration-200">
                                  <Search
                                    size={18}
                                    className={`text-gray-500 mr-3 ${
                                      isSearching ? "hidden" : "block"
                                    }`}
                                  />
                                  {isSearching && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="mr-3"
                                    >
                                      <Loader2
                                        className={`animate-spin w-[18px] h-[18px] ${colorScheme.text}`}
                                      />
                                    </motion.div>
                                  )}
                                  <Input
                                    type="text"
                                    value={currentTexusId}
                                    onChange={(e) => {
                                      setCurrentTexusId(e.target.value);
                                      if (e.target.value.length >= 2) {
                                        searchUser(e.target.value);
                                      } else {
                                        setIsDropdownOpen(false);
                                      }
                                    }}
                                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 h-10 text-sm"
                                    placeholder="Search participants by TEXUS ID"
                                  />
                                </div>

                                {/* Modern Search Results Dropdown */}
                                {isDropdownOpen && searchResults.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute z-10 mt-2 w-full rounded-xl bg-gray-900/95 backdrop-blur-xl border border-gray-800 shadow-2xl overflow-hidden"
                                  >
                                    <div className="p-1 max-h-60 overflow-auto">
                                      {searchResults.map((user) => (
                                        <motion.div
                                          key={user.texusId}
                                          whileHover={{
                                            backgroundColor:
                                              "rgba(75, 85, 99, 0.3)",
                                          }}
                                          className="cursor-pointer rounded-lg p-3 transition-colors flex items-center justify-between"
                                          onClick={() => handleSelectUser(user)}
                                        >
                                          <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                              <AvatarImage
                                                src={user.profile_pic}
                                                alt={user.name}
                                              />
                                              <AvatarFallback
                                                className={`${colorScheme.bg} text-xs`}
                                              >
                                                {user.name.split(" ")[0][0]}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <p className="text-sm font-medium">
                                                {user.name}
                                              </p>
                                              <p className="text-xs text-gray-400">
                                                {user.texusId}
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            className={`h-6 w-6 rounded-full flex items-center justify-center ${colorScheme.bg}`}
                                          >
                                            <PlusIcon size={14} />
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Registration Requirements */}
                          <div
                            className={`p-4 rounded-xl bg-gray-900/40 border ${
                              teamMembers.length >= eventData.min_participants
                                ? "border-green-800/40"
                                : "border-amber-800/40"
                            }`}
                          >
                            <div className="flex items-start">
                              {teamMembers.length >=
                              eventData.min_participants ? (
                                <CheckCircle2
                                  className="text-green-500 mt-0.5 mr-3 flex-shrink-0"
                                  size={18}
                                />
                              ) : (
                                <AlertCircle
                                  className="text-amber-500 mt-0.5 mr-3 flex-shrink-0"
                                  size={18}
                                />
                              )}
                              <div>
                                <p className="text-sm font-medium">
                                  {teamMembers.length >=
                                  eventData.min_participants
                                    ? "Your team meets the requirements!"
                                    : `Requires at least ${eventData.min_participants} team members`}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {teamMembers.length >=
                                  eventData.min_participants
                                    ? "You can now confirm your registration"
                                    : `Please add ${
                                        eventData.min_participants -
                                        teamMembers.length
                                      } more ${
                                        eventData.min_participants -
                                          teamMembers.length ===
                                        1
                                          ? "member"
                                          : "members"
                                      } to continue`}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Referral Code Input */}
                          {eventData?.event_type === "workshop" &&
                            eventData?.id === 2534 && (
                              <div className="px-6 pb-4">
                                <div className="flex flex-col space-y-2">
                                  <Label
                                    htmlFor="referralCode"
                                    className="text-sm font-medium"
                                  >
                                    Referral Code
                                  </Label>
                                  <div className="relative">
                                    <Input
                                      id="referralCode"
                                      type="text"
                                      value={referralCode}
                                      onChange={(e) =>
                                        setReferralCode(e.target.value)
                                      }
                                      className="bg-gray-900/60 border border-gray-800 focus-visible:border-gray-700 focus-visible:ring-1 focus-visible:ring-gray-700 rounded-xl"
                                      placeholder="Enter workshop referral code (optional)"
                                    />
                                    {referralCode && (
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {referralCode ? (
                                          <CheckCircle2 className="text-green-500 h-5 w-5" />
                                        ) : (
                                          <XCircle className="text-red-500 h-5 w-5" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    The referral code is optional. If you have
                                    one, it can be found in the event rules.
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>

                        {/* Modern Footer */}
                        <div className="px-6 py-4 border-t border-gray-800/50 bg-gray-900/30 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              {`${registrationCount} of ${eventData.slots} slots filled`}
                            </p>
                            <Button
                              onClick={handleSubmitTeam}
                              disabled={
                                teamMembers.length <
                                  eventData.min_participants ||
                                isLoading ||
                                registrationCount >= eventData.slots
                              }
                              className={`${colorScheme.bg} hover:opacity-90 transition-all px-6 rounded-xl font-medium shadow-lg disabled:opacity-50`}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : registrationCount >= eventData.slots ? (
                                <>
                                  Event Full
                                  <AlertTriangle className="ml-2 h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  Confirm Registration
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </DialogContent>
                  </Dialog>
                ) : null}
              </CardFooter>
            </Card>

            {/* Prizes Card */}
            {event.event_type !== "workshop" && (
              <Card
                className={`bg-black/50 ${colorScheme.border} ${colorScheme.borderHover} hover:shadow-md ${colorScheme.shadow} transition-colors`}
              >
                <CardHeader>
                  <CardTitle className="text-white font-thuast font-thin">
                    Prizes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event?.prizes
                      ? event?.prizes?.map((prize: Prize, index: number) => (
                          <div key={index} className="space-y-1">
                            <Card className={`bg-black/50 border-0`}>
                              <h4 className={`px-2 ${colorScheme.text}`}>
                                {prize.title ? prize.title : "TBA"}
                              </h4>
                            </Card>
                            <p className="text-gray-300 font-montserrat">
                              {prize.description}
                            </p>
                            {index < event?.prizes.length - 1 && (
                              <Separator className="my-2 bg-purple-500/20" />
                            )}
                          </div>
                        ))
                      : "TBA"}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Right Column - Description, Rules, Contacts */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-2 space-y-6 md:space-y-8"
          >
            {/* Description Card with improved styling */}
            <Card
              className={`bg-black/60 backdrop-blur-sm ${colorScheme.border} ${colorScheme.borderHover} hover:shadow-lg ${colorScheme.shadow} transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className="text-white font-thuast font-thin">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-300 flex gap-2 font-montserrat text-justify"
                >
                  {eventData.description}
                </motion.div>
              </CardContent>
            </Card>

            {/* Rules Card with improved styling */}
            <Card
              hidden={event.event_type === "workshop"}
              className={`bg-black/60 backdrop-blur-sm ${colorScheme.border} ${colorScheme.borderHover} hover:shadow-lg ${colorScheme.shadow} transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className="text-white font-thuast font-thin">
                  {event.event_type === "workshop" ? "Referral Code" : "Rules"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.ul className="space-y-2">
                  {eventData?.rules?.map((rule: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-gray-300 flex gap-2 text-justify"
                    >
                      <span className={colorScheme.text}>•</span>
                      <h1 className="font-montserrat">{rule}</h1>
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </Card>

            {/* Contact Details Card with improved styling */}
            <Card
              className={`bg-black/60 backdrop-blur-sm ${colorScheme.border} ${colorScheme.borderHover} hover:shadow-lg ${colorScheme.shadow} transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className="text-white font-thuast font-thin">
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`${colorScheme.text} font-montserrat mb-3`}>
                      Student Coordinators
                    </h4>
                    {eventData?.student_coordinators?.map(
                      (coordinator: Studentcoordinator, index: number) => (
                        <div key={index} className="text-gray-300 mb-2">
                          <p className="font-montserrat">{coordinator.name}</p>
                          <p className="text-sm font-montserrat">
                            {coordinator.contact}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                  <div>
                    <h4 className={`${colorScheme.text} font-montserrat mb-3`}>
                      Faculty Coordinators
                    </h4>
                    {eventData?.faculty_coordinators?.map(
                      (coordinator: Studentcoordinator, index: number) => (
                        <div key={index} className="text-gray-300 mb-2">
                          <p className="font-montserrat">{coordinator.name}</p>
                          <p className="text-sm font-montserrat">
                            {coordinator.contact}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
