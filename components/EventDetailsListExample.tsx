import EventDetailsList from "./EventDetailsList";

export default function EventDetailsListExample() {
  // Example events data
  const events = [
    {
      id: 1,
      name: "Hackathon 2024",
      venue: "Main Auditorium",
      datetime: "2024-04-15T10:00:00",
    },
    {
      id: 2,
      name: "Tech Talk: AI in Healthcare",
      venue: "Conference Room B",
      datetime: "2024-04-20T14:30:00",
    },
    {
      id: 3,
      name: "Coding Competition",
      venue: "Computer Lab",
      datetime: "2024-04-25T09:00:00",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <EventDetailsList
        events={events}
        title="Featured Events"
        buttonText="Learn More"
      />
    </div>
  );
}
