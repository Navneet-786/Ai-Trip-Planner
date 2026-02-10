"use client"
import React, { useEffect, useState } from 'react'
import { Hotel } from './ChatBox'
import Image from 'next/image'
import {  ExternalLink, Star, Wallet } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import axios from 'axios'



type Props = {
  hotel:Hotel
  imageIndex: number
}


const HotelImageHolder:any = [
  "/hotel1.jpg",
  "/hotel2.jpg",
  "/hotel3.jpg",
  "/hotel4.jpg",
]
const HotelCardItem = ({hotel,imageIndex}:Props) => {
 
console.log(imageIndex)
const imageSrc =
    HotelImageHolder.length > 0
      ? HotelImageHolder[imageIndex % HotelImageHolder.length]
      : null


  return (
    <div  className='my-4 flex-col gap-4    shadow-2xl hover:scale-102 hover:bg-[#A3D8FF] p-3 transition duration-300 rounded-lg bg-white hover:border-2 hover:border-[#3B0270]'>
                {imageSrc && <Image src={imageSrc || "/hotel3.jpg"}  className="rounded-2xl shadow-lg  object-cover mx-auto mb-4 "alt='place-image' width={250} height={150}/>}
                <h2 className='font-semibold text-lg text-black'>{hotel?.hotel_name}</h2>
                <h2 className='font-semibold text-gray-500 text-sm'>{hotel?.hotel_address}</h2>
    
               <div className='flex gap-4 mt-2'>
                 <h2 className='font-semibold text-gray-500 text-sm flex gap-2 text-green-500'> <Wallet size={"18px"}/>
                <div>{hotel?.price_per_night}</div>
                </h2>
                <h2 className='font-semibold text-gray-500 text-sm text-yellow-500 flex items-center gap-2'><Star size={"18px"}/>
                <div>{hotel?.rating}</div>
                </h2>
               </div>
    
    
               <p className='text-sm text-gray-400 line-clamp-2'>
                {hotel?.description}
               </p>
              
                <Link href={`https://www.google.com/maps/search/?api=1&query=%27+${hotel?.hotel_name}`}  target="_blank" 
                    rel="noopener noreferrer" >

                 <Button size={"sm"} variant={"outline"} className='w-full mt-2 text-black'>view <ExternalLink/></Button>
                 </Link>
                 
                </div>
  )
}

export default HotelCardItem
