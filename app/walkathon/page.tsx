import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WalkathonPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Image Section with margins */}
      <div className="relative w-[90%] aspect-[16/9] mx-auto mt-8 group">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image
            src="/assets/walkathon-poster.png"
            alt="Walkathon Hero Image"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          {/* Hover overlay with title */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <h1 className="text-white text-6xl font-thuast tracking-wider">
              WALKATHON
            </h1>
          </div>
        </div>
      </div>

      {/* Description Box */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center font-thuast text-[#FF4500]">
            Join Our Walkathon
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-6 font-montserrat">
              Join us for an inspiring journey of hope and solidarity at our
              upcoming Walkathon event. This event brings together people from
              all walks of life to support our cause and make a difference in
              our community. Your participation will help raise awareness and
              funds for various charitable initiatives.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 font-montserrat">
              As a volunteer, you&apos;ll play a crucial role in making this
              event a success. From route marshaling to participant support,
              there are numerous ways you can contribute to this meaningful
              cause.
            </p>
          </div>

          {/* Volunteer Button */}
          <div className="flex gap-2 justify-center mt-8">
            <Button
              asChild
              className="w-full p-2 rounded-lg bg-[#FF4500] hover:bg-[white] hover:text-[#FF4500] hover:border-2 hover:border-[#FF4500] text-white font-thuast"
            >
              <Link href="https://forms.gle/1soFfFPuDPpzvSvx7">
                Join Us{""}
              </Link>
            </Button>
            <Button
              asChild
              className="w-full p-2 rounded-lg hover:bg-green-600 text-green-600 border-2 border-green-600 hover:text-white font-thuast"
            >
              <Link target="_blank" href="https://walkathon.texus.io">
                Go Greener
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Additional spacing at bottom */}
      <div className="h-20" />
    </div>
  );
}
