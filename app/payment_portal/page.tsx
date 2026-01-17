"use server";

import CCAvenue from "@/lib/CCAvenue";
import { decrypt } from "@/lib/utils";
import { createClient } from "@/supabase/server";
import Link from "next/link";
import { permanentRedirect, redirect, RedirectType } from "next/navigation";
import CopyUrlComponent from "./components/CopyUrlComponent";
import { QRCodeSVG } from "qrcode.react";
import PaymentSection from "./components/PaymentSection";
import { headers } from "next/headers";

const PaymentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ registrationData: string }>;
}) => {
  const { registrationData } = await searchParams;

  // Redirect to home page if registration data is missing
  if (!registrationData) {
    permanentRedirect("/", RedirectType.replace);
  }

  // Fetch current user from supabase auth
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log("Error fetching authenticated user:", authError);
    return (
      <div className="flex justify-center items-center h-screen text-red-500 bg-black">
        Authentication error. Please log in again.
      </div>
    );
  }

  const decryptedRegistrationData = decrypt(registrationData, user?.id);

  // Validate JSON format and redirect if invalid
  let registrationDataDecrypted;
  try {
    registrationDataDecrypted = JSON.parse(decryptedRegistrationData);

    // Check for musical night flag
    if (registrationDataDecrypted.musical_night === false) {
      // Redirect to event search/URL generation page
      permanentRedirect("/events", RedirectType.replace);
    }
  } catch (error) {
    console.error("Invalid registration data format:", error);
    permanentRedirect("/", RedirectType.replace);
  }

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("user_auth_id", user.id)
    .single();

  if (userError || !userData) {
    console.log("Error fetching user data:", userError);
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        User not found
      </div>
    );
  }

  // Fetch event data
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", registrationDataDecrypted.event_id)
    .single();

  if (
    (eventError || !eventData) &&
    registrationDataDecrypted.musical_night === false
  ) {
    console.log("Error fetching event data:", eventError);
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Event not found
      </div>
    );
  }

  // Check if user is already registered for this event
  const { data: existingRegistration, error: registrationError } =
    await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", registrationDataDecrypted.event_id)
      .contains("team", [userData.texus_id])
      .maybeSingle();

  if (registrationError) {
    console.log("Error checking registration status:", registrationError);
  }

  const {
    data: existingRegistrationMusicalNight,
    error: registrationErrorMusicalNight,
  } = await supabase
    .from("musical_night")
    .select("*")
    .eq("user_texus_id", userData.texus_id)
    .maybeSingle();

  if (registrationErrorMusicalNight) {
    console.log("Error checking registration status:", registrationError);
  }

  // Fetch team members data if there are team members
  type TeamMember = {
    texus_id: string;
    name: string;
  };

  let teamMembersData: TeamMember[] = [];
  if (
    registrationDataDecrypted.team &&
    registrationDataDecrypted.team.length > 0
  ) {
    const { data: teamData, error: teamError } = await supabase
      .from("users")
      .select("texus_id, name")
      .in("texus_id", registrationDataDecrypted.team);

    if (!teamError && teamData) {
      teamMembersData = teamData as TeamMember[];
    } else {
      console.log("Error fetching team data:", teamError);
    }
  }

  // console.log("User Data:", userData);
  // console.log("Event Data:", eventData);

  const host = process.env.NEXT_PUBLIC_HOST_LOCAL;

  const headersList = await headers();
  const referer = headersList.get("referer");

  if (!referer) {
    redirect("/", RedirectType.replace);
  }

  const hostUrl = referer?.split("/")[0] + "//" + referer?.split("/")[2];

  // Create different payment data based on musical night flag
  const paymentData =
    registrationDataDecrypted.musical_night == true
      ? {
          merchant_id: process.env.NEXT_PUBLIC_CAvenue_MERCHANT_ID!, // Merchant ID (Required)
          order_id: `${userData.texus_id}-MUSICAL-NIGHT`, // Order ID with unique timestamp
          amount: registrationDataDecrypted.amount, // Payment Amount for Musical Night Premium Pack
          currency: "INR", // Payment Currency Type (Required)
          billing_email: user.email!, // Billing Email (Optional)
          billing_name: userData.name.split("(")[0], // Billing Name (Optional)
          billing_country: "India",
          cancel_url: `${hostUrl}/api/musical-night-handle`, // Failed/Cancel Payment URL (Required)
          merchant_param1: "Musical Night Premium Pack", // Event name for musical night
          merchant_param2: userData.texus_id, // Extra Information (Optional)
          merchant_param3: "musical_night", // Special ID for musical night
          merchant_param4: registrationDataDecrypted.referral, // Extra Information (Optional)
          merchant_param5: registrationDataDecrypted.phase, // Extra Information (Optional)
          language: "EN", // Language (Optional)
          billing_tel: userData.contact_number.toString(), // Billing Mobile Number (Optional)
          redirect_url: `${hostUrl}/api/ccavenue-handle`, // Redirect URL (Optional)
        }
      : {
          merchant_id: process.env.NEXT_PUBLIC_CAvenue_MERCHANT_ID!, // Merchant ID (Required)
          order_id: `${userData.texus_id}-${eventData.id}`, // Order ID - It can be generated from our project
          amount: String(
            registrationDataDecrypted.referral
              ? eventData.fee - 50
              : eventData.fee
          ),
          // amount: "1", // Payment Amount (Required)
          currency: "INR", // Payment Currency Type (Required)
          billing_email: user.email!, // Billing Email (Optional)
          billing_name: userData.name, // Billing Name (Optional)    billing_country: "India", // Billing COuntry (O...uired)
          cancel_url: `${host}/api/ccavenue-handle`, // Failed/Cancel Payment URL (Required)
          merchant_param1: eventData.name, // Extra Information (Optional)
          merchant_param2: userData.texus_id, // Extra Information (Optional)
          merchant_param3: eventData.id, // Extra Information (Optional)
          merchant_param4: registrationDataDecrypted.referral, // Extra Information (Optional)
          merchant_param5: registrationDataDecrypted.team.join(","), // Extra Information (Optional)
          language: "EN", // Language (Optional)
          billing_tel: userData.contact_number.toString(), // Billing Mobile Number (Optional)
          redirect_url: `${host}/api/ccavenue-handle`, // Redirect URL (Optional)
          billing_country: "India",
        };

  const encReq = CCAvenue.getEncryptedOrder(paymentData);
  const accessCode = process.env.NEXT_PUBLIC_CCAvenue_ACCESS_CODE;
  const URL = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=${paymentData.merchant_id}&encRequest=${encReq}&access_code=${accessCode}`;

  return (
    <div className="flex flex-col pt-24 min-h-screen py-8 px-4 bg-black text-white">
      <div className="container mx-auto max-w-6xl">
        {/* Page Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center font-mont text-white mb-8">
          Checkout
        </h1>

        {/* <div className="bg-[#111] rounded-lg border border-zinc-800 p-4 mb-6 overflow-auto max-h-40">
          <h3 className="text-sm font-semibold text-zinc-400 mb-2">
            Headers Information
          </h3>
          <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">
            {JSON.stringify(Object.fromEntries(headersList.entries()), null, 2)}
          </pre>
        </div> */}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Order Summary Section - Takes fixed width on desktop, full width on mobile */}
          <div className="lg:w-96 w-full bg-[#111] rounded-lg border border-zinc-800 shadow-xl backdrop-blur-sm h-fit lg:sticky top-4 self-start">
            <div className="p-6">
              <h2 className="text-xl font-semibold font-mont text-white border-b border-zinc-700 pb-3 mb-5">
                Order Summary
              </h2>

              <div className="space-y-5">
                <div>
                  <span className="text-zinc-400 text-sm block mb-1">
                    Event
                  </span>
                  <span className="font-medium text-white block">
                    {registrationDataDecrypted.musical_night === true
                      ? `Musical Night Premium Pack - Phase ${registrationDataDecrypted.phase}`
                      : eventData.name}
                  </span>
                </div>

                {registrationDataDecrypted.team &&
                  registrationDataDecrypted.team.length > 0 && (
                    <div>
                      <span className="text-zinc-400 text-sm block mb-2">
                        Team Members
                      </span>
                      <ul className="list-disc list-inside text-sm pl-1 space-y-2">
                        {teamMembersData.length > 0
                          ? teamMembersData.map((member, index) => (
                              <li key={index} className="text-zinc-300">
                                <span className="font-medium">
                                  {member.name}
                                </span>{" "}
                                <span className="text-zinc-500 font-mono text-xs">
                                  ({member.texus_id})
                                </span>
                              </li>
                            ))
                          : registrationDataDecrypted.team.map(
                              (member: string, index: number) => (
                                <li key={index} className="text-zinc-300">
                                  {member}
                                </li>
                              )
                            )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>

            <div className="border-t border-zinc-800 p-6">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-sm mb-1">
                    Registration ID
                  </span>
                  <span className="font-mono text-sm text-zinc-300">
                    {paymentData.order_id}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-sm mb-1">Name</span>
                  <span className="text-zinc-300">{userData.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-sm mb-1">Department</span>
                  <span className="text-zinc-300">{userData.department}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Event Fee</span>
                  <span className="text-zinc-300">
                    ₹
                    {registrationDataDecrypted.musical_night === true
                      ? registrationDataDecrypted.amount
                      : eventData.fee}
                  </span>
                </div>

                {registrationDataDecrypted.referral && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Referral Discount</span>
                    <div className="flex items-center">
                      <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full mr-2">
                        Referral Code: {registrationDataDecrypted.referral}
                      </span>
                    </div>
                    <span className="text-green-500">-₹50</span>
                  </div>
                )}

                <div className="border-t border-zinc-800 pt-3"></div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-xl text-fuchsia-400">
                    ₹
                    {registrationDataDecrypted.musical_night
                      ? registrationDataDecrypted.amount
                      : registrationDataDecrypted.referral
                      ? eventData.fee - 50
                      : eventData.fee}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Section - Takes remaining space */}
          <div className="flex-1 bg-[#111] rounded-lg border border-zinc-800 shadow-xl backdrop-blur-sm">
            <PaymentSection
              initialIsRegistered={
                registrationDataDecrypted.musical_night
                  ? !!existingRegistrationMusicalNight
                  : !!existingRegistration
              }
              userData={userData}
              eventId={
                registrationDataDecrypted.musical_night
                  ? "MUSICAL-NIGHT"
                  : eventData.id
              }
              paymentUrl={URL}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
