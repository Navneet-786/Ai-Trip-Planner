import { PricingTable } from "@clerk/nextjs";
import React from "react";

const Pricing = () => {
  return (
    <div className="mt-16 sm:mt-20 text-center px-4 sm:px-6">
      {/* Heading */}
      <h1 className="mb-8 sm:mb-10 text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
        Ai Trip Planner –{" "}
        <span
          className="
            bg-yellow-500 text-white
            rounded-2xl
            px-3 py-1
            mt-3
            inline-block
            sm:mt-0 sm:ml-2
            sm:px-4 sm:py-2
            text-base sm:text-lg
          "
        >
          Choose Your Plan
        </span>
      </h1>

      {/* Pricing Table Wrapper */}
      <div
        className="
          mx-auto
          max-w-full
          sm:max-w-2xl
          md:max-w-3xl
          lg:max-w-4xl
          px-2 sm:px-0
        "
      >
        <PricingTable />
      </div>
    </div>
  );
};

export default Pricing;
