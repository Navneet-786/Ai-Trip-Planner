"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Gem,
  Globe2,
  MapPinHouse,
  Plane,
  Send,
} from "lucide-react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const suggestion = [
  {
    title: "Create New Trip",
    icon: <Globe2 className="text-blue-500 h-5 w-5" />,
  },
  {
    title: "Inspire me where to go",
    icon: <Plane className="text-green-500 h-5 w-5" />,
  },
  {
    title: "Discover hidden gem",
    icon: <Gem className="text-red-500 h-5 w-5" />,
  },
  {
    title: "Adventure destination",
    icon: <MapPinHouse className="text-yellow-500 h-5 w-5" />,
  },
];

const Hero = () => {
  const { user } = useUser();
  const router = useRouter();

  const sendHandle = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    router.push("/create-new-trip");
  };

  return (
    <section className="mt-20 px-6 md:px-16 lg:px-32 flex flex-col items-center text-center">
      {/* Hero Content */}
      <div className="space-y-6 max-w-6xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
          Hey, I'm Your Personal{" "}
          <span className="text-primary">Trip Planner</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600">
          Tell me what you want, and I will handle the rest: Flights,
          Hotels, and full trip planning — all in seconds.
        </p>
      </div>

      {/* Input Box */}
      <div className="w-full max-w-2xl mt-10 flex flex-col gap-4 relative">
        <Textarea
          placeholder="Create a trip for Paris from India"
          className="w-full h-32 bg-background border border-border rounded-md shadow-md focus:border-primary focus-visible:ring-0 resize-none px-4 py-3 text-base"
        />
        <Button
          size="icon"
          className="absolute bottom-4 right-4 cursor-pointer hover:shadow-2xl"
          onClick={sendHandle}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* ✅ RESPONSIVE SUGGESTIONS */}
      <div
        className="
          flex gap-3 mt-6
          flex-wrap
          justify-center
          sm:justify-start
          max-w-2xl
        "
      >
        {suggestion.map((item, index) => (
          <div
            key={index}
            className="
              flex items-center gap-2
              border rounded-full
              px-3 py-2
              text-sm
              cursor-pointer
              bg-white
              hover:scale-105 hover:shadow-lg
              transition-all
            "
          >
            {item.icon}
            <span className="whitespace-nowrap">{item.title}</span>
          </div>
        ))}
      </div>

      {/* Video Section */}
      <div className="mt-12 w-full max-w-4xl">
        <div className="flex justify-center items-center mt-10 mb-10 gap-3">
          <h2 className="text-sm sm:text-base">
            Not sure where to start?{" "}
            <strong>See how it works</strong>
          </h2>
          <ArrowDown className="animate-bounce" />
        </div>

        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-center"
          videoSrc="/video.mp4"
          thumbnailSrc="/videoThumbnail.jpg"
          thumbnailAlt="Demo Video"
        />
      </div>
    </section>
  );
};

export default Hero;
