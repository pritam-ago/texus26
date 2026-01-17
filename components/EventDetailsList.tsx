import EventDetails from "./EventDetails";

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
      <h2 className="text-2xl font-bold text-white font-montserrat">{title}</h2>

      {events.length === 0 ? (
        <p className="text-gray-400 font-montserrat">No events found.</p>
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
