"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUi from './GroupSizeUi'
import BudgetUi from './BudgetUi'
import TripDuration from './TripDuration'
import PlanningTripUi from './PlanningTripUi'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import { useTripDetail, useUserDetail } from '@/app/Provider'

interface Messages {
  role: string,
  content: string,
  ui?: string
}

type Step =
  | "source"
  | "destination"
  | "groupSize"
  | "budget"
  | "tripDuration"
  | "interests"
  | "final";

export type TripInfo = {
  budget: string,
  destination: string,
  duration: string,
  group_size: string,
  hotels: Hotel[],
  itinerary: Itinerary[],
  origin: string,
}

// Hotels type
export type Hotel = {
  hotel_name: string,
  hotel_address: string,
  price_per_night: string,
  hotel_img_url: string,
  geo_coordinates: {
    latitude: number,
    longitude: number
  },
  rating: number,
  description: string
}



// Activity type
export type Activity = {
  place_name: string,
  place_details: string,
  geo_coordinates: {
    latitude: number,
    longitude: number
  },
  place_address: string,
  ticket_pricing: string,
  time_travel_each_location: string,
  best_time_to_visit: string
}

export type Itinerary = {
  day: number,
  day_plan: string,
  best_time_to_visit_day: string,
  activities: Activity[]
}

const ChatBox = () => {
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Messages[]>([])
  const [userInput, setUserInput] = useState<string>("")
  const [isFinal, setIsFinal] = useState<boolean>(false)
  const [step, setStep] = useState<Step>("source")
  const [tripDetail, setTripDetail] = useState<TripInfo>()
  const { userDetail } = useUserDetail();
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

  const SavedTripDetail = useMutation(api.tripDetail.createTripDetail);

  // Send message to AI
  const sendHandle = async () => {
    if (!userInput?.trim()) return;
    setLoading(true);

    const newMsg: Messages = { role: "user", content: userInput, ui: step };
    setMessages(prev => [...prev, newMsg]);
    setUserInput("");

    try {
      const collected: Record<string, string> = {};
      messages.forEach(msg => {
        if (msg.role === "user" && msg.ui) {
          collected[msg.ui] = msg.content
        }
      });
      collected[step] = userInput;

      const result = await axios.post("/api/aimodel", {
        step,
        answer: userInput,
        isFinal,
        collected
      });

      const aiReply = result.data.resp;
      const nextStep = result.data.ui as Step;

      if (nextStep === "final") {
        setIsFinal(true);
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "🎉 Generating your complete trip plan...", ui: "final" }
        ]);
      } else if (aiReply) {
        setMessages(prev => [...prev, { role: "assistant", content: aiReply, ui: nextStep }])
      }

      setStep(nextStep);
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Handle final trip creation
  const handleViewTrip = async () => {
    setLoading(true);
    try {
      const collected: Record<string, string> = {};
      messages.forEach(msg => {
        if (msg.role === "user" && msg.ui) {
          collected[msg.ui] = msg.content;
        }
      });

      const result = await axios.post("/api/aimodel", {
        step: "final",
        answer: "",
        isFinal: true,
        collected
      });

      const tripPlan = result.data.trip_plan;

      if (!tripPlan) {
        console.error("AI did not return trip_plan")
        setLoading(false)
        return;
      }

      setTripDetail(tripPlan)
      setTripDetailInfo(tripPlan)

      const tripId = uuidv4()

      // Save safely to Convex
      if (tripPlan && userDetail?._id) {
        await SavedTripDetail({
          tripDetail: tripPlan,
          tripId: tripId,
          uid: userDetail._id
        })
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const RenderGenerativeUi = (ui: string) => {
    if (ui === 'budget') {
      return <BudgetUi onSelectedOption={(e: string) => { setUserInput(e); sendHandle() }} />
    } else if (ui === 'groupSize') {
      return <GroupSizeUi onSelectedOption={(e: string) => { setUserInput(e); sendHandle() }} />
    } else if (ui === "tripDuration") {
      return <TripDuration onSelectedOption={(e: string) => { setUserInput(e); sendHandle() }} />
    } else if (ui === "final") {
      return  <PlanningTripUi
            loading={loading}
            onViewTrip={handleViewTrip}
            disable={!!tripDetail}
            />
    }
    return null
  }

  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg?.ui === "final" && !isFinal) {
      setIsFinal(true)
      setUserInput("Ok, Great!")
      setTimeout(() => sendHandle(), 0)
    }
  }, [messages])

  return (
    <div className='h-[80vh] flex flex-col '>
      <section className='flex-1 overflow-y-auto px-0 rounded-lg no-scrollbar mt-4'>
        {messages.length === 0 && <EmptyBoxState onSelectOption={(v: string) => { setUserInput(v) }} />}
        {messages.map((msg, index) =>
          msg.role === "user" ?
            <div className='flex justify-end mt-2' key={index}>
              <div className='max-w-lg bg-primary text-white px-4 py-4 rounded-lg'>{msg.content}</div>
            </div>
            :
            <div className='flex justify-start mt-2' key={index}>
              <div className='max-w-lg bg-gray-100 text-black px-4 py-4 rounded-lg'>
                {msg.content}
                {RenderGenerativeUi(msg.ui ?? '')}
              </div>
            </div>
        )}
        {loading && <div className='flex justify-start mt-2'>
          <div className='max-w-lg bg-gray-100 text-black px-4 py-4 rounded-lg'><Loader className="animate-spin" /></div>
        </div>}
      </section>

      <section className="flex justify-center">
        <div className="w-full max-w-2xl mt-10 flex flex-col gap-4 relative">
          <Textarea
            placeholder={step=="source"?"Say hi...":"Double click or Write Something...."}
            className="w-full h-32 bg-background border border-border rounded-md shadow-md focus:border-primary focus-visible:ring-0 resize-none px-4 py-3 text-base"
            onChange={(e) => setUserInput(e.target.value ?? "")}
            value={userInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendHandle();
              }
            }}
          />
          <Button size={"icon"} className="absolute bottom-4 right-4 hover:cursor-pointer hover:shadow-2xl " onClick={() => sendHandle()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

      </section>
    </div>
  )
}

export default ChatBox
