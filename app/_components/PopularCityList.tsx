"use client";

import React from "react";
import Image from "next/image";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import { clsx } from "clsx";

/** Dummy content for each card */
const DummyContent = () => (
  <p className="text-sm md:text-base text-white/90 mt-1 line-clamp-3">
    This is some placeholder content for the card. It can be any JSX content.
  </p>
);

/** Sample data for the Carousel cards */
const data = [
  {
    category: "Paris, France",
    title: "Explore the City of Lights",
    src: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&auto=format&fit=crop&q=60",
  },
  {
    category: "New York, USA",
    title: "Experience NYC Times Square",
    src: "https://plus.unsplash.com/premium_photo-1676657955507-b1f993556e80?w=600&auto=format&fit=crop&q=60",
  },
  {
    category: "Tokyo, Japan",
    title: "Discover Shibuya & Cherry Blossoms",
    src: "https://plus.unsplash.com/premium_photo-1716026575946-2a03d5dcc0bc?w=600&auto=format&fit=crop&q=60",
  },
  {
    category: "Rome, Italy",
    title: "Walk through History Colosseum & Vatican",
    src: "https://images.unsplash.com/photo-1700413367536-b8f890530cce?w=600&auto=format&fit=crop&q=60",
  },
  {
    category: "Dubai, UAE",
    title: "Luxury Burj Khalifa & Desert Safari",
    src: "https://images.unsplash.com/photo-1494675595046-ae42af7dc2ce?w=600&auto=format&fit=crop&q=60",
  },
  {
    category: "Sydney, Australia",
    title: "Opera House & Harbour Views",
    src: "https://images.unsplash.com/photo-1767057286447-334fd52b7bd8?w=600&auto=format&fit=crop&q=60",
  },
];

/** Card Component with overlay text */
const Card = ({ card }:any) => {
  return (
    <div
      className={clsx(
        "relative rounded-xl overflow-hidden shadow-lg",
        "w-[300px] md:w-[340px] lg:w-[360px]",
        "h-[380px] md:h-[420px] lg:h-[450px]"
      )}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={card.src}
          alt={card.title}
          fill
          
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 340px"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Text overlay */}
      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-start">
        <h3 className="text-2xl md:text-4xl font-semibold text-white">
          {card.category}
        </h3>
        <p className="mt-1 text-2xl md:text-xl font-bold text-white line-clamp-2">
          {card.title}
        </p>
        {/* <DummyContent /> */}
      </div>
    </div>
  );
};

/** Main Component */
const PopularCityList = () => {
  const cards = data.map((card) => <Card key={card.src} card={card} />);

  return (
    <section className="w-[90%] mx-auto pt-16 pb-2 px-4 md:px-8 lg:px-16">
      <h2 className="max-w-7xl mx-auto text-xl sm:text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 font-sans mb-2 text-center mt-16">
        Popular Destination to visit
      </h2>

      {/* Carousel Section */}
      <Carousel items={cards} />
    </section>
  );
};

export default PopularCityList;
