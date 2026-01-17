import { permanentRedirect, redirect } from "next/navigation";
import SupportPageClient from "./SupportPageClient";
import { createClient } from "@/supabase/server";

export default async function SupportPage() {
  // Server-side data fetching
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user profile data if user is authenticated
  let userData = null;
  if (user) {
    const { data: profileData } = await supabase
      .from("users")
      .select("*")
      .eq("user_auth_id", user.id)
      .single();

    if (profileData) {
      userData = profileData;
    }
  }

  return (
    <div className="flex flex-col pt-16 sm:pt-20 md:pt-24 min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4 bg-black text-white">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center font-mont text-white mb-4 sm:mb-6 md:mb-8">
          Support Center
        </h1>

        <SupportPageClient initialUser={user} initialUserData={userData} />
      </div>
    </div>
  );
}
