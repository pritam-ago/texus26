import EventDetails from "./EventDetails";
import { PaperHeading, PaperText, PAPER } from "@/components/PaperComponents";

type Event = {
  id: number;
  name: string;
  venue: string;
  datetime: string;
};

type EventDetailsListProps = {
  events: Event[];
  title?: string;
  buttonText?: string;
};

export default function EventDetailsList({
  events,
  title = "Upcoming Events",
  buttonText = "View Event",
}: EventDetailsListProps) {
  return (
    <div className="space-y-6">
      <PaperHeading size="3xl">{title}</PaperHeading>

      {events.length === 0 ? (
        <PaperText opacity={0.7}>No events found.</PaperText>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventDetails
              key={event.id}
              id={event.id}
              name={event.name}
              venue={event.venue}
              datetime={event.datetime}
              buttonText={buttonText}
            />
          ))}
        </div>
      )}
    </div>
  );
}
