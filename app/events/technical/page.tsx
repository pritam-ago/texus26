import { createClient } from "@/supabase/server";
import TechnicalEventsClient from "./TechnicalEventsClient";

export default async function TechnicalEventsPage() {
  // Create the Supabase server client
  const supabase = await createClient();

  // Fetch events on the server
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_type", "technical_event");

  if (error) {
    console.error("Error fetching events:", error.message);
  }

  // Extract unique departments
  const uniqueDepartments = events
    ? [...new Set(events.map((event) => event.department))]
    : [];

  // Pass the data to the client component
  return (
    <TechnicalEventsClient
      initialEvents={events || []}
      initialDepartments={uniqueDepartments}
    />
  );
}
