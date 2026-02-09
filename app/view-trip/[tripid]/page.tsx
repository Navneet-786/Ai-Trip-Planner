"use client";

import Iternary from "@/app/create-new-trip/_components/Iternary";
import PlaceCardItem from "@/app/create-new-trip/_components/PlaceCardItem";
import { Trip } from "@/app/my-trips/page";
import { useTripDetail, useUserDetail } from "@/app/Provider";
import { Timeline } from "@/components/ui/timeline";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const ViewTrip = () => {
  const { tripid } = useParams<{ tripid: string }>();
  const { userDetail } = useUserDetail();
  const { tripDetailInfo ,setTripDetailInfo} = useTripDetail()
  const convex = useConvex();

  const [tripData, setTripData] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const GetTrip = async () => {
    if (!userDetail?._id || !tripid) return;

    try {
      const result = await convex.query(api.tripDetail.GetTripById, {
        uid: userDetail._id,
        tripid,
      });

      console.log(result[0]?.tripDetail);
      setTripDetailInfo(result[0]?.tripDetail)
      setTripData(result[0]?.tripDetail);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetTrip();
  }, [userDetail, tripid]);

  if (loading) {
    return <div className="p-10">Loading trip details...</div>;
  }

  if (!tripData) {
    return <div className="p-10">Trip not found</div>;
  }


console.log("tripdetail info: ",tripDetailInfo)
console.log("trip Data:",tripData)
  
 return (
  <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

    {/* ================= HEADER ================= */}
    <section className="rounded-2xl bg-gradient-to-r from-pink-500 to-sky-600 text-white p-8 shadow-lg">
      <h1 className="text-4xl font-bold mb-2">
        ✈️ {tripDetailInfo?.destination}
      </h1>
      <p className="opacity-90">
       
        {tripDetailInfo?.duration} days • {tripDetailInfo?.group_size}
      </p>

      <div className="flex gap-4 mt-4 text-sm">
        <span className="bg-white/20 px-3 py-1 rounded-full">
          Budget: {tripDetailInfo?.budget}
        </span>
        <span className="bg-white/20 px-3 py-1 rounded-full">
          🏨 {tripDetailInfo?.hotels?.length} Hotels
        </span>
      </div>
    </section>

    {/* ================= OVERVIEW ================= */}
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        ["Destination", tripDetailInfo?.destination],
        ["Duration", `${tripDetailInfo?.duration} Days`],
        ["Group Size", tripDetailInfo?.group_size],
        ["Budget", tripDetailInfo?.budget],
      ].map(([label, value], i) => (
        <div
          key={i}
          className="rounded-xl border p-5 text-center shadow-lg hover:scale-110 transition hover:shadow-md transition "
        >
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-semibold mt-1">{value}</p>
        </div>
      ))}
    </section>

    {/* ================= TIMELINE ================= */}
    <section className="space-y-8">
      <h2 className="text-2xl font-bold">🗓 Trip Itinerary</h2>

      <div className="relative border-l pl-6 space-y-10">
        {tripDetailInfo?.itinerary?.map((day) => (
          <div key={day.day} className="relative">

            {/* DAY DOT */}
            <span className="absolute -left-[10px] top-1 w-4 h-4 bg-primary rounded-full" />

            {/* DAY CARD */}
            <div className="rounded-xl border p-6 bg-background shadow-sm bg-gradient-to-r from-pink-50 to-sky-100 hover:scale-101 transition">
              <h3 className="text-xl font-semibold mb-1">
                Day {day.day}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {day.day_plan} • Best Time: {day.best_time_to_visit_day}
              </p>

              {/* ACTIVITIES */}
              <div className="space-y-4 ">
                {day.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 rounded-lg border p-4 hover:bg-muted transition bg-gradient-to-r from-pink-200 to-sky-200"
                  >
                    {/* IMAGE */}
                    <img
                      src={"/advent1.jpg"}
                      alt={act.place_name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />

                    {/* CONTENT */}
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        📍 {act.place_name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {act.place_details}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs">
                        <span className="px-2 py-1 bg-muted rounded">
                          ⏰ {act.best_time_to_visit}
                        </span>
                        <span className="px-2 py-1 bg-muted rounded">
                          🎟 {act.ticket_pricing}
                        </span>
                        <span className="px-2 py-1 bg-muted rounded">
                          🚗 {act.time_travel_each_location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ================= HOTELS ================= */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">🏨 Recommended Hotels</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tripDetailInfo?.hotels?.map((hotel, i) => (
          <div
            key={i}
            className="rounded-xl border p-5 shadow-sm hover:shadow-md transition  bg-gradient-to-r from-pink-200 to-sky-200 "
          >
            <h3 className="font-semibold">{hotel.hotel_name}</h3>
            <p className="text-sm text-muted-foreground">
              {hotel.hotel_address}
            </p>

            <div className="flex justify-between mt-3 text-sm">
              <span>💰 {hotel.price_per_night}</span>
              <span>⭐ {hotel.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

};

export default ViewTrip;
