import EventDetails from "./EventDetails";

export default function EventDetailsExample() {
  // Example event data
  const event = {
    id: 1,
    name: "Hackathon 2024",
    venue: "Main Auditorium",
    datetime: "2024-04-15T10:00:00",
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-4 font-montserrat">
        Event Information
      </h2>
      <EventDetails
        id={event.id}
        name={event.name}
        venue={event.venue}
        datetime={event.datetime}
        buttonText="Register Now"
      />
    </div>
  );
}
