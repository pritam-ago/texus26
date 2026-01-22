import Hero from "@/components/Home/Hero-events";
import Eventdata from "@/components/Eventdata";
import MusicalNightPage from "./musical-night/page";
import Proshows from "@/components/Home/Proshows";

export default async function EventsPage() {
  return (
    <div className="relative bg-black"> 
        <Hero/>
        <div id="events">
          <Eventdata />
        </div>
        <Proshows />
    </div>
  );
}