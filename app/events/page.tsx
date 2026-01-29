import Eventdata from "@/components/Eventdata";
import MusicalNightPage from "./musical-night/page";
import Proshows from "@/components/Home/Proshows";

export default async function EventsPage() {
  return (
    <div className="relative"> 
        {/* Background with hero image and paper texture */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `#F2F2F2 url('/assets/hero-bg.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `url('/textures/paper.png')`,
              backgroundRepeat: "repeat",
              opacity: 0.5,
            }}
          />
        </div>

        <div className="relative z-10" id="events">
          <Eventdata />
        </div>
        <Proshows />
    </div>
  );
}