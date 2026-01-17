import CCAvenue from "@/lib/CCAvenue";
import { encrypt } from "@/lib/utils";
import { permanentRedirect, RedirectType } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let redirectPath: string | null = null;

  try {
    // Get the form data from the request
    const formData = await request.formData();
    const encResp = formData.get("encResp") as string;

    // Decrypt the Response Data
    const data = CCAvenue.decrypt(encResp) as PaymentResponse;

    // Simple redirect logic based on payment status
    if (data.order_status === "Success") {
      // Payment successful - redirect to profile page
      redirectPath = new URL(
        data.merchant_param3 === "musical_night"
          ? "/musical-night"
          : "/profile",
        request.url
      ).toString();
    } else {
      // Payment failed - redirect to error page
      const encryptData = encrypt(
        JSON.stringify({ code: "Texus25Error" }),
        "texus25"
      );
      redirectPath = new URL(
        `/failed?errorCode=${encryptData}`,
        request.url
      ).toString();
    }
  } catch (error) {
    // Handle any errors during processing
    console.log("Error processing CCAvenue request:", error);

    const encryptData = encrypt(
      JSON.stringify({ code: "Texus25Error" }),
      "texus25"
    );

    // Store failure URL in redirectPath
    redirectPath = new URL(
      `/failed?errorCode=${encryptData}`,
      request.url
    ).toString();
  } finally {
    // Perform redirect if redirectPath is set
    if (redirectPath) {
      return permanentRedirect(redirectPath, RedirectType.replace);
    }

    // Fallback response if no redirect was set
    return NextResponse.json({
      errorCode: "Error processing payment request",
    });
  }
}
