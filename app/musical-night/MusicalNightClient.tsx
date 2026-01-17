"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";
import { Music, UserIcon, Check, X } from "lucide-react";
import { redirect } from "next/navigation";
import { cn, departmentCodes, encrypt, getDepartmentInfo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { FaGoogle } from "react-icons/fa";
import { signInWithGoogle } from "@/lib/auth";

const MusicalNightClient = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [merchCollected, setMerchCollected] = useState(false);
  const [ticketCollected, setTicketCollected] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState<any | null>(
    null
  );
  const [qrFullscreen, setQrFullscreen] = useState(false);
  const [totalRegistrationCount, setTotalRegistrationCount] = useState(0);
  const supabase = createClient();
  const router = useRouter();

  // Fetch the authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user details");
      }
    };

    fetchUser();
  }, []);

  // Fetch user details and check registration status
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const { data: userDetailsData, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_auth_id", user.id)
          .single();

        if (error) throw error;
        setUserDetails(userDetailsData);

        // Check if user is already registered for musical night and get collection status
        const { data: registrationData, error: registrationError } =
          await supabase
            .from("musical_night")
            .select("*")
            .eq("user_texus_id", userDetailsData.texus_id)
            .single();

        if (!registrationError && registrationData) {
          setIsRegistered(true);
          setRegistrationDetails(registrationData);
          // Set merch and ticket status if these fields exist
          setMerchCollected(registrationData.merch_collected || false);
          setTicketCollected(registrationData.ticket_collected || false);
        }

        // Get total registration count for Musical Night
        const { count, error: countError } = await supabase
          .from("musical_night")
          .select("*", { count: "exact", head: true });

        if (!countError) {
          setTotalRegistrationCount(count || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();

    // Set up real-time subscription for musical night registration updates
    const registerChannel = supabase
      .channel("musical-night-updates")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "musical_night",
          filter: `user_texus_id=eq.${userDetails?.texus_id}`,
        },
        (payload) => {
          console.log("Musical night registration update:", payload);

          if (payload.eventType === "INSERT") {
            setIsRegistered(true);
            setRegistrationDetails(payload.new);
            setMerchCollected(payload.new.merch_collected || false);
            setTicketCollected(payload.new.ticket_collected || false);
            toast.success("You are now registered for Musical Night!");
          } else if (payload.eventType === "UPDATE") {
            setRegistrationDetails(payload.new);

            // Check if merchandise status changed
            if (payload.new.merch_collected !== merchCollected) {
              setMerchCollected(payload.new.merch_collected || false);
              if (payload.new.merch_collected) {
                toast.success("Your merchandise has been marked as collected!");
              }
            }

            // Check if ticket status changed
            if (payload.new.ticket_collected !== ticketCollected) {
              setTicketCollected(payload.new.ticket_collected || false);
              if (payload.new.ticket_collected) {
                toast.success("Your ticket has been marked as collected!");
              }
            }
          } else if (payload.eventType === "DELETE") {
            setIsRegistered(false);
            setRegistrationDetails(null);
            setMerchCollected(false);
            setTicketCollected(false);
            toast.error(
              "Your registration for Musical Night has been removed."
            );
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(registerChannel);
    };
  }, [user, userDetails?.texus_id]);

  const handleRegister = async () => {
    if (!user || !userDetails) return;

    setRegistering(true);

    const { data: existingRegistration, error: existingRegistrationError } =
      await supabase
        .from("musical_night")
        .select("*")
        .eq("user_texus_id", userDetails.texus_id)
        .single();

    if (existingRegistration) {
      setIsRegistered(true);
      setRegistrationDetails(existingRegistration);
      setMerchCollected(existingRegistration.merch_collected || false);
      setTicketCollected(existingRegistration.ticket_collected || false);
      toast.success("You are already registered for Musical Night!");
      setRegistering(false);
      return;
    } else {
      const registrationData = {
        texus_id: userDetails.texus_id,
        amount: 699,
        musical_night: true,
        phase: 1,
      };

      const encryptedRegistrationData = encrypt(
        JSON.stringify(registrationData, null, 2),
        user.id
      );

      setRegistering(false);

      const url = new URL("/payment_portal", window.location.origin);
      url.searchParams.set("registrationData", encryptedRegistrationData);

      router.push(url.toString());
    }
  };

  // Create QR code data for registered users
  const getQrCodeData = () => {
    if (!userDetails || !registrationDetails) return "";

    const qrData = {
      texus_id: userDetails.texus_id,
      name: userDetails.name,
      email: user?.email,
      phone: userDetails.phone,
      department: userDetails.department,
      college: userDetails.college,
      register_number: userDetails.register_number,
      merch_collected: merchCollected,
      ticket_collected: ticketCollected,
      phase: registrationDetails.phase,
      order_id: registrationDetails.order_id,
      amount: registrationDetails.amount,
      payment_status: registrationDetails.payment_status,
      event: "Musical Night",
    };

    return encrypt(JSON.stringify(qrData), "musicalnight");
  };

  // Toggle QR fullscreen mode
  const toggleQrFullscreen = () => {
    setQrFullscreen(!qrFullscreen);
  };

  return (
    <div
      className={cn(
        "font-montserrat py-12 px-4  bg-gradient-to-br to-black via-purple-950/30 from-black text-white relative overflow-hidden"
      )}
    >
      <Toaster position="top-center" />

      {/* QR Code Fullscreen Modal */}
      {qrFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={toggleQrFullscreen}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] bg-white p-8 rounded-xl shadow-2xl shadow-purple-500/20">
            <button
              className="absolute -top-4 -right-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors border border-gray-600 shadow-lg z-10"
              onClick={(e) => {
                e.stopPropagation();
                toggleQrFullscreen();
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <QRCodeSVG
              value={getQrCodeData()}
              size={Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8)}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl pt-16 relative z-10">
        <div className=" text-center relative">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] animate-pulse"></div>
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold text-center text-white mb-4 relative drop-shadow-[0_0_25px_rgba(200,100,255,0.3)]">
            Musical Night
          </h1>
          <div className="h-0.5 w-40 md:w-60 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-6"></div>
          <p className="text-center text-gray-300 max-w-2xl mx-auto mb-6 font-light text-lg md:text-xl leading-relaxed">
            Get ready for two unforgettable evenings filled with music, rhythm,
            and fun! Grab your two-day pass plus exclusive merchandise now!
          </p>

          {/* Event Schedule Button */}
          <a
            href="#proshow"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 mb-12"
          >
            <span className="flex items-center gap-2">
              <Music size={18} />
              View Event Schedule
            </span>
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-full max-w-md p-6 animate-pulse">
              <div className="h-32 bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-10 bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        ) : !user ? (
          <Button
            onClick={signInWithGoogle}
            className="bg-gradient-to-r mx-auto from-purple-600 to-blue-600 border-none shadow-lg hover:shadow-purple-500/30 transition-all duration-300 text-white flex items-center gap-2"
          >
            <FaGoogle />
            Login with Google to Book Your Ticket
          </Button>
        ) : !user.email?.endsWith("@srmist.edu.in") ? (
          <div className="text-center p-8 bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-red-500/70 max-w-[66%] mx-auto shadow-xl">
            <h2 className="text-xl font-semibold text-red-400 mb-4">
              Access Restricted
            </h2>
            <p className="mb-6 text-gray-300">
              You don&apos;t have permission to register for the Musical Night
              event. This event is exclusively for SRM Institute students.
            </p>
            <p className="mb-6 text-yellow-400 font-medium">
              Please sign in using your SRM Institute email ID (@srmist.edu.in).
            </p>
            <Button
              variant="destructive"
              className="mt-2 shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              onClick={async () => {
                await supabase.auth.signOut();
                redirect("/");
              }}
            >
              Sign Out & Switch Account
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <Card className="w-full md:max-w-[66%] bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-purple-900/50 shadow-xl hover:shadow-purple-900/40 rounded-xl overflow-hidden mb-12 transition-all duration-500 transform hover:-translate-y-1">
              <CardHeader className="pb-2 border-b border-gray-700">
                <CardTitle className="text-xl md:text-2xl font-mont text-white flex items-center gap-2">
                  <UserIcon size={20} className="text-purple-400" />
                  User Profile
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your registration information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 p-2">
                  <Avatar className="h-24 w-24 border-2 border-purple-500 shadow-lg ring-2 ring-purple-500/20 ring-offset-2 ring-offset-black">
                    <AvatarImage
                      src={userDetails?.profile_pic}
                      alt={userDetails?.full_name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-2xl font-medium">
                      {userDetails?.full_name?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-4 flex-1 w-full text-center lg:text-left">
                    <h3 className="text-xl md:text-2xl font-semibold text-white border-b border-gray-700 pb-2 mb-2 font-sans">
                      {userDetails?.name || "User"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <p className="text-sm text-gray-300 flex items-center">
                        <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                        <span className="truncate">{user.email}</span>
                      </p>
                      {userDetails?.phone && (
                        <p className="text-sm text-gray-300 flex items-center">
                          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                          <span className="truncate">{userDetails.phone}</span>
                        </p>
                      )}
                      {userDetails?.texus_id && (
                        <p className="text-sm text-gray-300 flex items-center">
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          <span className="truncate">
                            Texus ID: {userDetails.texus_id}
                          </span>
                        </p>
                      )}
                      {userDetails?.department && (
                        <p className="text-sm text-gray-300 flex items-center">
                          <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                          <span className="truncate">
                            {userDetails?.name && userDetails.name.includes("(")
                              ? getDepartmentInfo(
                                  userDetails.name.split("(")[1]?.split(")")[0]
                                ).department
                              : userDetails.department}
                          </span>
                        </p>
                      )}
                      {userDetails?.name && userDetails.name.includes("(") && (
                        <p className="text-sm text-gray-300 flex items-center">
                          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                          <span className="truncate text-xs">
                            Reg No:{" "}
                            {userDetails.name.split("(")[1]?.split(")")[0]}
                          </span>
                        </p>
                      )}
                      {userDetails?.name && userDetails.name.includes("(") && (
                        <p className="text-sm text-gray-300 flex items-center">
                          <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                          <span className="truncate">
                            Year:{" "}
                            {getDepartmentInfo(
                              userDetails.name.split("(")[1]?.split(")")[0]
                            ).yearOfStudy || userDetails.year}
                          </span>
                        </p>
                      )}
                      {userDetails?.college && (
                        <p className="text-sm text-gray-300 flex items-center">
                          <span className="inline-block w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                          <span className="truncate">
                            {userDetails.college}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(() => {
              // Get department info from register number in name
              const registerNumber =
                userDetails?.name && userDetails.name.includes("(")
                  ? userDetails.name.split("(")[1]?.split(")")[0]
                  : null;

              const departmentInfo = registerNumber
                ? getDepartmentInfo(registerNumber)
                : null;

              const department =
                departmentInfo?.department || userDetails?.department || "";
              const isTechStudent = department.split(".")[1]?.trim() === "Tech";

              if (
                !isRegistered &&
                !Object.keys(departmentCodes).includes(
                  String(registerNumber?.slice(6, 10))
                )
              ) {
                return (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 max-w-2xl mb-6 text-center">
                    <h3 className="text-red-300 text-lg font-semibold mb-2">
                      Registration Restricted
                    </h3>
                    <p className="text-gray-200 mb-4">
                      We&apos;re sorry, but Musical Night tickets are only
                      available for Engineering and Technology students.
                    </p>
                    <p className="text-yellow-300 text-sm">
                      Your department:{" "}
                      <span className="font-semibold">{department}</span>
                    </p>
                  </div>
                );
              }

              return !isRegistered ? (
                <>
                  {totalRegistrationCount >= 100000 && (
                    <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 max-w-2xl mb-6 text-center">
                      <h3 className="text-yellow-300 text-lg font-semibold mb-2">
                        Phase I Slots Are Filled Up
                      </h3>
                      <p className="text-gray-200 mb-2">
                        All tickets for Phase I of Musical Night have been
                        allocated.
                      </p>
                      <p className="text-emerald-300 font-medium">
                        Phase II registration will be opened up soon. Stay
                        tuned!
                      </p>
                    </div>
                  )}

                  {!Object.keys(departmentCodes).includes(
                    String(registerNumber?.slice(6, 10))
                  ) ? (
                    <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 max-w-2xl mb-6 text-center">
                      <h3 className="text-red-300 text-lg font-semibold mb-2">
                        Registration Restricted
                      </h3>
                      <p className="text-gray-200 mb-4">
                        We&apos;re sorry, but Musical Night tickets are only
                        available for Engineering and Technology students.
                      </p>
                      <p className="text-yellow-300 text-sm">
                        Your department:{" "}
                        <span className="font-semibold">{department}</span>
                      </p>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="flex items-center gap-2 text-white hover:text-black bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg font-montserrat font-semibold hover:shadow-purple-800/40 transition-all duration-300 text-lg py-6 px-8 rounded-xl group relative overflow-hidden"
                      disabled
                      onClick={handleRegister}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                        {registering
                          ? "Redirecting to Payment Portal..."
                          : totalRegistrationCount >= 1000
                          ? "Phase I Slots Filled"
                          : "Grab Your Ticket"}
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center w-full max-w-2xl">
                  <Card className="w-full bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-purple-900/50 shadow-xl rounded-xl overflow-hidden mb-12">
                    <CardHeader className="pb-2 border-b border-gray-700">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl md:text-2xl font-mont text-white flex items-center gap-2">
                          <Music size={20} className="text-purple-400" />
                          Registration Status
                        </CardTitle>
                        {registrationDetails?.id && (
                          <Badge
                            variant="outline"
                            className="bg-purple-900/30 text-purple-200 border-purple-500"
                          >
                            Ref: #{registrationDetails.id}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-gray-400">
                        Your Musical Night registration details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="mb-8 p-4 border border-yellow-600/40 rounded-lg bg-yellow-900/20 shadow-inner">
                        <p className="text-sm font-medium text-yellow-300 mb-2 flex items-center">
                          <span className="mr-2">⚠️</span> Important Note
                        </p>
                        <p className="text-sm text-gray-300">
                          This digital QR code is{" "}
                          <span className="font-semibold text-yellow-200">
                            not
                          </span>{" "}
                          your official ticket or entry pass to the event. You
                          will need to collect your physical ticket prior to the
                          event by presenting either this QR code or your
                          reference number
                          <span className="font-medium text-purple-300">
                            {" "}
                            (#{registrationDetails?.id})
                          </span>{" "}
                          at the designated collection point.
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div
                          className="bg-white p-5 rounded-lg cursor-pointer hover:shadow-lg shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02]"
                          onClick={toggleQrFullscreen}
                        >
                          <QRCodeSVG
                            value={getQrCodeData()}
                            size={200}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            level="H"
                            includeMargin={false}
                          />
                        </div>

                        <div className="space-y-4 flex-1">
                          <h3 className="text-lg md:text-xl font-semibold text-green-400 mb-4">
                            You&apos;re registered for Musical Night!
                          </h3>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-700/50">
                              <div
                                className={`p-1 rounded-full ${
                                  merchCollected ? "bg-green-500" : "bg-red-500"
                                }`}
                              >
                                {merchCollected ? (
                                  <Check size={16} />
                                ) : (
                                  <X size={16} />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">Merchandise</p>
                                <p className="text-sm text-gray-400">
                                  {merchCollected
                                    ? "Collected"
                                    : "Not yet collected"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-700/50">
                              <div
                                className={`p-1 rounded-full ${
                                  ticketCollected
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              >
                                {ticketCollected ? (
                                  <Check size={16} />
                                ) : (
                                  <X size={16} />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">Physical Ticket</p>
                                <p className="text-sm text-gray-400">
                                  {ticketCollected
                                    ? "Collected"
                                    : "Not yet collected"}
                                </p>
                              </div>
                            </div>

                            <p className="text-sm text-gray-300 mt-4">
                              Show this QR code at the event to collect your
                              merchandise and ticket.{" "}
                              <span className="text-blue-400">
                                Click on the QR code to enlarge.
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicalNightClient;
