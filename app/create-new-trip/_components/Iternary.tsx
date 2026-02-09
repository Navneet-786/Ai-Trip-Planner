"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Timeline } from "@/components/ui/timeline"
import HotelCardItem from "./HotelCardItem"
import PlaceCardItem from "./PlaceCardItem"
import { useTripDetail } from "@/app/Provider"
import { TripInfo } from "./ChatBox"

import Image from "next/image"

const Grid_Image = [
    "/beaches.jpg",
    "/history.jpg",
    "/tracking.jpg",
    "/mountains.jpg",
    "/food.jpg",
    "/bridge.jpg",
]


const Iternary = () => {
  const { tripDetailInfo } = useTripDetail()
  const [tripData, setTripData] = useState<TripInfo | null>(null)

  useEffect(() => {
    if (tripDetailInfo) setTripData(tripDetailInfo)
  }, [tripDetailInfo])

  const timelineData = useMemo(() => {
    if (!tripData) return []

    return [
      {
        title: "Recommended Hotels",
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tripData.hotels.map((hotel, index) => (
              <HotelCardItem
                key={index}
                hotel={hotel}
                imageIndex={index}
              />
            ))}
          </div>
        ),
      },

      ...tripData.itinerary.map((dayData) => ({
        title: `Day ${dayData.day}`,
        content: (
          <div>
            <p className="mb-2 text-sm text-gray-400">
              Best Time: {dayData.best_time_to_visit_day}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dayData.activities.map((activity, index) => (
                <PlaceCardItem
                  key={index}
                  activity={activity}
                  imageIndex={index}
                />
              ))}
            </div>
          </div>
        ),
      })),
    ]
  }, [tripData])

  return (
    <div className="relative w-full  h-[85vh] px-3 overflow-y-auto  no-scrollbar bg-slate-400 rounded-lg">
      {tripData ? (
        <Timeline data={timelineData} tripData={tripData} />
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
         
          <p className="text-2xl mb-6 text-center text-white">
             Generate a trip to see your itinerary....
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-[420px] sm:max-w-[600px] ">
  {Grid_Image.map((img, index) => (
    <div
      key={index}
      className=" rounded-xl shadow hover:scale-105 transition-transform duration-300 "
    >
      <Image
        src={img}
        alt="travel"
        className="w-full  object-cover"
        
        width={280}
        height={280}
      />
    </div>
  ))}
</div>

          
        </div>
      )}
    </div>
  )
}

export default Iternary
