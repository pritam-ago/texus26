import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

type Event = {
  id: number;
  name: string;
  venue: string;
  datetime: string;
};

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/event/${event.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
      >
        <Card className="bg-black/50 border-purple-500 hover:border-purple-400 hover:shadow-purple-500/40 transition-colors">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-xl text-white font-montserrat font-medium">
              {event.name}
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <CalendarClock size={20} className="text-purple-400" />
                <span className="font-montserrat">
                  {new Date(event.datetime).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={20} className="text-purple-400" />
                <span className="font-montserrat">{event.venue}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
