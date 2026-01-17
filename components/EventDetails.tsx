import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
    <Card className="bg-black/50 border-purple-500 hover:border-purple-400 hover:shadow-purple-500/40 transition-colors">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-xl text-white font-montserrat font-medium">
          {name}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-300">
            <CalendarClock size={20} className="text-purple-400" />
            <span className="font-montserrat">
              {new Date(datetime).toLocaleString("en-US", {
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
            <span className="font-montserrat">{venue}</span>
          </div>
        </div>

        <Link href={`/event/${id}`} className="block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-montserrat">
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </Link>
      </CardContent>
    </Card>
  );
}
