"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import CopyUrlComponent from "./CopyUrlComponent";
import { Button } from "@/components/ui/button";

type PaymentSectionProps = {
  initialIsRegistered: boolean;
  userData: any;
  eventId: number;
  paymentUrl: string;
};

export default function PaymentSection({
  initialIsRegistered,
  userData,
  eventId,
  paymentUrl,
}: PaymentSectionProps) {
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const [qrEnlarged, setQrEnlarged] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Set initial status from prop
    setIsRegistered(initialIsRegistered);

    // Set up real-time subscription to registrations table
    const registrationsChannel = supabase
      .channel("registration-check")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "registrations",
          filter: `team=cs.{${userData.texus_id}} AND event_id=eq.${eventId}`,
        },
        (payload) => {
          console.log("Registration change detected:", payload);

          // If a new registration is created that includes this user
          if (payload.eventType === "INSERT") {
            const team = payload.new.team || [];
            if (team.includes(userData.texus_id)) {
              setIsRegistered(true);
            }
          }
          // If a registration is updated
          else if (payload.eventType === "UPDATE") {
            const team = payload.new.team || [];
            if (team.includes(userData.texus_id)) {
              setIsRegistered(true);
            } else {
              setIsRegistered(false);
            }
          }
          // If a registration is deleted
          else if (payload.eventType === "DELETE") {
            const team = payload.old.team || [];
            if (team.includes(userData.texus_id)) {
              setIsRegistered(false);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Registration subscription status:", status);
      });

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(registrationsChannel);
    };
  }, [initialIsRegistered, userData.texus_id, eventId, supabase]);

  // Function to toggle QR code enlargement
  const toggleQrEnlargement = () => {
    setQrEnlarged(!qrEnlarged);
  };

  return (
    <>
      <div className="p-6">
        {isRegistered ? (
          <>
            <h2 className="text-xl font-semibold font-mont text-white border-b border-zinc-700 pb-3 mb-6">
              Already Registered
            </h2>

            <div className="p-4 bg-zinc-900 border border-emerald-500/30 rounded-md mb-8">
              <p className="text-sm text-emerald-400 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                You have already registered for this event. You can view your
                registrations in your profile.
              </p>
            </div>

            <div className="flex justify-center mt-8">
              <Link
                href="/"
                className="bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white px-8 py-3 rounded-md transition-all shadow-md hover:shadow-pink-500/25 text-center font-medium"
              >
                Return to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold font-mont text-white border-b border-zinc-700 pb-3 mb-6">
              Complete Payment
            </h2>

            {/* Warning Alert */}
            <div className="p-4 bg-zinc-900 border border-amber-500/30 rounded-md mb-8">
              <p className="text-sm text-amber-400 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                If one payment method doesn&apos;t work, please try one of the
                alternatives below.
              </p>
            </div>

            {/* Payment Options with Modern Design */}
            <div className="space-y-8">
              {/* Option 1 */}
              <div className="bg-zinc-900/50 p-5 rounded-lg border border-zinc-700 hover:border-fuchsia-700/50 transition-colors">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 w-7 h-7 rounded-full flex items-center justify-center mr-3 text-xs font-bold">
                    1
                  </span>
                  Pay Now (Recommended)
                </h3>
                <p className="text-sm text-zinc-400 mb-5">
                  Click the button below to proceed directly to the payment
                  gateway
                </p>
                <div className="flex">
                  <Link
                    href={paymentUrl}
                    className="bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white px-8 py-3 rounded-md transition-all shadow-md hover:shadow-pink-500/25 text-center font-medium"
                  >
                    Proceed to Payment
                  </Link>
                </div>
              </div>

              {/* Option 2 */}
              <div className="bg-zinc-900/50 p-5 rounded-lg border border-zinc-700 hover:border-fuchsia-700/50 transition-colors">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 w-7 h-7 rounded-full flex items-center justify-center mr-3 text-xs font-bold">
                    2
                  </span>
                  Copy Payment URL
                </h3>
                <p className="text-sm text-zinc-400 mb-5">
                  Copy the payment link and paste it in your browser
                </p>
                <div className="flex">
                  <CopyUrlComponent url={paymentUrl} />
                </div>
              </div>

              {/* Option 3 */}
              <div className="bg-zinc-900/50 p-5 rounded-lg border border-zinc-700 hover:border-fuchsia-700/50 transition-colors">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 w-7 h-7 rounded-full flex items-center justify-center mr-3 text-xs font-bold">
                    3
                  </span>
                  Scan QR Code
                </h3>
                <p className="text-sm text-zinc-400">
                  Use your mobile device to scan this QR code
                </p>
                <p className="text-xs text-zinc-400 mb-5">
                  Click the QR code to enlarge it
                </p>
                <div
                  className="p-4 bg-white rounded-md inline-block cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={toggleQrEnlargement}
                >
                  <QRCodeSVG
                    value={paymentUrl}
                    size={160}
                    level="M"
                    includeMargin={true}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-zinc-800">
              <p className="text-sm text-zinc-500 text-center">
                Having trouble? Contact support at{" "}
                <span className="text-fuchsia-400">srmtexus24@gmail.com</span>
              </p>
            </div>
          </>
        )}
      </div>
      {qrEnlarged && (
        <div
          className="w-full h-full fixed top-0 left-0 inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={toggleQrEnlargement}
        >
          <div
            className="bg-white p-8 rounded-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={toggleQrEnlargement}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <QRCodeSVG value={paymentUrl} size={300} level="M" />
          </div>
        </div>
      )}
    </>
  );
}
