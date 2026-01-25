import Link from "next/link";
import { CalendarClock, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { 
  PaperSimpleCard, 
  PaperHeading, 
  PaperText,
  PAPER,
  bodyFont
} from "@/components/PaperComponents";

type EventDetailsProps = {
  id: number;
  name: string;
  venue: string;
  datetime: string;
  buttonText?: string;
};

export default function EventDetails({
  id,
  name,
  venue,
  datetime,
  buttonText = "View Event",
}: EventDetailsProps) {
  return (
    <PaperSimpleCard className="hover:scale-[1.02] transition-transform">
      <div className="space-y-4">
        {/* Event Name */}
        <PaperHeading size="xl" className="mb-0">
          {name}
        </PaperHeading>

        {/* Date & Time and Venue */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div style={{ color: PAPER.accent }}>
              <CalendarClock size={20} />
            </div>
            <PaperText className="mb-0" opacity={0.9}>
              {new Date(datetime).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </PaperText>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ color: PAPER.accent }}>
              <MapPin size={20} />
            </div>
            <PaperText className="mb-0" opacity={0.9}>
              {venue}
            </PaperText>
          </div>
        </div>

        {/* Button */}
        <Link href={`/event/${id}`} className="block">
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-full px-4 py-2.5 rounded-xl font-bold inline-flex justify-center items-center gap-2"
            style={{
              fontFamily: bodyFont,
              background: "rgba(121,166,119,0.3)",
              color: PAPER.ink,
              border: `2px solid ${PAPER.ink}`,
              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
            }}
          >
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </Link>
      </div>
    </PaperSimpleCard>
  );
}
