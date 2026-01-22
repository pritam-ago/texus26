import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Meteors } from "@/components/ui/Meteors";
import { XCircle } from "lucide-react";
import { decrypt } from "@/lib/utils";
import { permanentRedirect } from "next/navigation";
export default async function PaymentFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ errorCode: string }>;
}) {
  const { errorCode } = await searchParams;

  const decryptedError = decrypt(errorCode, "texus25");
  try {
    const errorData = JSON.parse(`${decryptedError}}`) as { code: string };
    if (errorData.code !== "Texus25Error") {
      permanentRedirect("/");
    }
  } catch (error) {
    console.log(error);
    permanentRedirect("/");
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 md:p-8">
      <div
        suppressHydrationWarning
        className="relative w-full max-w-lg rounded-lg overflow-hidden"
      >
        <div className="relative p-8 bg-black/80 backdrop-blur-sm border border-red-500/20 rounded-lg overflow-hidden shadow-xl z-10">
          <div className="flex flex-col items-center">
            {/* Red error icon */}
            <div className="flex justify-center mb-6">
              <XCircle className="h-24 w-24 text-red-500" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-4 font-mont">
              Payment Failed
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-center mb-6">
              Your transaction could not be completed. This could be due to
              insufficient funds, network issues, or the payment being declined
              by your bank.
            </p>

            {/* Error details card */}
            <div className="bg-black/50 border border-red-500/10 rounded-md p-4 mb-6 w-full hover:shadow-lg hover:border-red-500/30 transition-all duration-300">
              <h3 className="text-red-400 text-sm font-semibold mb-2">
                Error Details
              </h3>
              <p className="text-gray-400 text-sm">
                The payment processor returned an error. Your card has not been
                charged.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
              <div className="w-full sm:w-auto"></div>

              <div className="w-full sm:w-auto">
                <Button
                  asChild
                  variant="outline"
                  className="font-medium border-gray-700 hover:bg-gray-800 w-full hover:scale-105 transition-transform"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>

            {/* Help text */}
            <p className="text-gray-400 text-sm text-center mt-6">
              If you continue to face issues, please contact support at{" "}
              <a
                href="mailto:srmtexus24@gmail.com"
                className="text-blue-400 hover:underline hover:text-blue-300 transition-colors"
              >
                srmtexus24@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Background effect */}
        <Meteors number={20} />
      </div>
    </div>
  );
}
