// "use client"
// import Image from 'next/image'
// import React, { useMemo } from 'react'
// import { Activity } from './ChatBox'
// import { Clock, Ticket } from 'lucide-react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { div } from 'motion/react-client';

// type Props = {
//   activity:Activity,
//   imageIndex: number 
// }

// const PLACE_IMAGES:any = [
//   "/advent1.jpg",
//   "/advent2.jpg",
//   "/advent3.jpg",
//   "/advent4.jpg",
//   "/advent5.jpg",
// ]
// const PlaceCardItem = ({activity, imageIndex}:Props) => {
  
//  const imageSrc = useMemo(() => {
//     const randomIndex = Math.floor(Math.random() * PLACE_IMAGES.length)
//     return PLACE_IMAGES[randomIndex]
//   }, [])
     

//       console.log()
//   return (
//        <div className='max-h-[400px] border'>
//                  <div className='h-[50%]'>
//                    {imageSrc&& <Image src={imageSrc} alt='plcegolder' width={400} height={200} className='object-cover rounded-xl'/>}
//                  </div>
    
//                     <h2 className='font-semibold text-lg'>{activity?.place_name}</h2>
//                     <h2 className='text-gray-500 line-clamp-2'>{activity?.place_details}</h2>
//                     <h2 className='flex items-center gap-2 text-green-500 font-semibold '><Ticket size={"18px"}/>{activity?.ticket_pricing}</h2>
//                     <h2 className='flex items-center gap-2  text-sm text-gray-400'><Clock size={"18px"}/>{activity?.time_travel_each_location}</h2>
    
    
//                      <Link href={`https://www.google.com/maps/search/?api=1&query=%27+${activity?.place_name}`}  target="_blank" 
//                     rel="noopener noreferrer" >
//                     <Button size={"sm"} variant={"outline"} className='w-full mt-2'>view </Button>
//                     </Link>
//                   </div>
//   )
// }


// export default PlaceCardItem



"use client"
import Image from "next/image"
import React, { useMemo } from "react"
import { Activity } from "./ChatBox"
import { Clock, Navigation, Ticket } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Props = {
  activity: Activity,
  imageIndex: number;
}

const PLACE_IMAGES = [
  "/advent1.jpg",
  "/advent2.jpg",
  "/advent3.jpg",
  "/advent4.jpg",
  "/advent5.jpg",
]

const PlaceCardItem = ({ activity }: Props) => {
  // 🔥 random image per card (stable)
  const imageSrc = useMemo(() => {
    return PLACE_IMAGES[Math.floor(Math.random() * PLACE_IMAGES.length)]
  }, [])

  return (
    <div className="flex flex-col h-full rounded-xl   shadow-2xl hover:scale-102 transition duration-300  hover:bg-[#A3D8FF] p-3  bg-white">
      {/* IMAGE */}
      <div className="relative w-full h-[180px] mb-3">
        <Image
          src={imageSrc}
          alt="place"
          fill
          className="object-cover rounded-xl"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-grow gap-1">
        <h2 className="font-semibold text-lg text-black">{activity.place_name}</h2>
        <p className="text-gray-500 text-sm line-clamp-2">
          {activity.place_details}
        </p>

        <p className="flex items-center gap-2 text-green-600 text-sm font-semibold">
          <Ticket size={16} />
          {activity.ticket_pricing}
        </p>

        <p className="flex items-center gap-2 text-gray-400 text-sm">
          <Clock size={16} />
          {activity.time_travel_each_location}
        </p>
      </div>

      {/* BUTTON STAYS AT BOTTOM */}
      <Link
        href={`https://www.google.com/maps/search/?api=1&query=${activity.place_name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3"
      >
        <Button size="sm" variant="outline" className="w-full border text-black">
          View <Navigation/>
        </Button>
      </Link>
    </div>
  )
}

export default PlaceCardItem
