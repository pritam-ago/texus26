import { createClient } from "@/supabase/server";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import EventDescriptionPageClient from "@/components/EventDescription";

async function getEvent(eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }

  return data;
}

type Props = {
  params: Promise<{ eventId: string }>;
};

export default async function EventPage({ params }: Props) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  if (!event) {
    return permanentRedirect("/404");
  }

  if (event.hidden) {
    notFound();
  }

  // Fetch logged-in user and user data
  const supabase = await createClient();
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
    <EventDescriptionPageClient
      event={event}
      initialUser={user}
      initialUserData={userData}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  if (!event || event.hidden) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: `${event.name}`,
  };
}
