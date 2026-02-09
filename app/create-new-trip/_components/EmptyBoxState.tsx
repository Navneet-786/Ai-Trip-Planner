"use client";

import React, { useState } from "react";
import { Nunito } from "next/font/google";
import { suggestion } from "@/app/_components/Hero";
import clsx from "clsx";

const nunito = Nunito({
  subsets: ["latin"],
});

const EmptyBoxState = ({onSelectOption}:any) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center gap-3 px-4">
      
      <h2
        className={`font-bold text-xl md:text-2xl text-slate-400 ${nunito.className}`}
      >
        Start Planning a <span className="text-primary">New Trip</span> Using AI
      </h2>

      <p className="max-w-md text-sm md:text-base text-slate-500 leading-relaxed">
        Tell us where you want to go, your budget, and preferences — our AI will
        create a personalized travel plan including destinations, activities,
        and timelines in seconds.
      </p>

      {/* Suggestion List */}
      <div className="flex flex-col w-[80%] gap-4 mt-6 ">
        {suggestion.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setActiveIndex(index);
              onSelectOption(item?.title)
            }}
            className={clsx(
              "flex items-center gap-3 border rounded-lg p-3 cursor-pointer",
              "transition-all duration-300 ease-in-out border-1 border-gray-500",
              "hover:shadow-lg",
              activeIndex === index
                ? "translate-x-4 bg-primary/5 border-primary"
                : "translate-x-0"
            )}
           
          >
            <div
              className={clsx(
                "transition-transform duration-300",
                activeIndex === index && "scale-110"
              )}
            >
              {item.icon}
            </div>

            <h2
              className={clsx(
                "text-base md:text-lg transition-colors duration-300",
                activeIndex === index
                  ? "text-primary font-semibold"
                  : "text-slate-600"
              )}
            >
              {item.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyBoxState;
