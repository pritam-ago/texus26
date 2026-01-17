import { createClient } from "@/supabase/server";
import WorkshopClient from "./WorkshopClient";

export default async function WorkshopPage() {
  // Create the Supabase server client
  const supabase = await createClient();

  // Fetch events on the server
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_type", "workshop");

  if (error) {
    console.error("Error fetching events:", error.message);
  }

  // Extract unique departments
  const uniqueDepartments = events
    ? [...new Set(events.map((event) => event.department))]
    : [];

  // Pass the data to the client component
  return (
    <WorkshopClient
      initialEvents={events || []}
      initialDepartments={uniqueDepartments}
    />
  );
}
