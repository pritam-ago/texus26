import Link from "next/link";
import { CalendarClock, MapPin } from "lucide-react";
import { 
  PaperSimpleCard, 
  PaperHeading, 
  PaperText,
  PAPER 
} from "@/components/PaperComponents";

type Event = {
  id: number;
  name: string;
  venue: string;
  datetime: string;
};

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/event/${event.id}`} className="block">
      <PaperSimpleCard className="hover:scale-[1.02] transition-transform cursor-pointer">
        {/* Event Name */}
        <PaperHeading size="xl" className="mb-4">
          {event.name}
        </PaperHeading>

        <div className="space-y-3">
          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <div style={{ color: PAPER.accent }}>
              <CalendarClock size={20} />
            </div>
            <PaperText className="mb-0" opacity={0.9}>
              {new Date(event.datetime).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </PaperText>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-3">
            <div style={{ color: PAPER.accent }}>
              <MapPin size={20} />
            </div>
            <PaperText className="mb-0" opacity={0.9}>
              {event.venue}
            </PaperText>
          </div>
        </div>
      </PaperSimpleCard>
    </Link>
  );
}
