import { createClient } from "@/supabase/server";
import NonTechnicalEventsClient from "./NonTechnicalEventsClient";

export default async function NonTechnicalEventsPage() {
  // Create the Supabase server client
  const supabase = await createClient();

  // Fetch events on the server
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_type", "non_technical_event");

  if (error) {
    console.error("Error fetching events:", error.message);
  }

  // Extract unique departments
  const uniqueDepartments = events
    ? [...new Set(events.map((event) => event.department))]
    : [];

  // Pass the data to the client component
  return (
    <NonTechnicalEventsClient
      initialEvents={events || []}
      initialDepartments={uniqueDepartments}
    />
  );
}
