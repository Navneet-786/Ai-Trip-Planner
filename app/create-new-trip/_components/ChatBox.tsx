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

interface Messages{
  role:string,
  content:string,
  ui?:string
}

type Step =
  | "source"
  | "destination"
  | "groupSize"
  | "budget"
  | "tripDuration"
  | "interests"
  | "final";


  //define trip ingo
  type TripInfo={
    budget:string,
    destination:string,
    duration:string,
    group_size:string,
    hotels: any,
    itinerary:any,
    origin:string,
  }



const ChatBox = () => {
  const [loading,setLoading] = useState(false)
const [messages,setMessages] = useState<Messages[]>([])
const [userInput,setUserInput] = useState<string>();
const [isFinal,setIsFinal] = useState<boolean>(false)
const [step,setStep] = useState<Step>("source")
const [tripDetail,setTripDetail] = useState<TripInfo>()

// const sendHandle = async () => {
//   if (!userInput?.trim()) return;

//   setLoading(true);

//   const newMsg: Messages = { role: "user", content: userInput };
//   setMessages(prev => [...prev, newMsg]);
//   setUserInput("");

//   try {
//     const result = await axios.post("/api/aimodel", {
//       step,
//       answer: userInput.trim(),
//     });

//     const aiReply = result?.data?.resp;
//     const nextStep = result?.data?.ui as Step;

//     // Add AI reply if not final
//     if (aiReply && nextStep !== "final") {
//       setMessages(prev => [...prev, { role: "assistant", content: aiReply, ui: nextStep }]);
//     }

//     // Handle final step
//     if (nextStep === "final") {
//       setIsFinal(true);
//       setMessages(prev => [
//         ...prev,
//         { role: "assistant", content: "🎉 All details collected! Generating your trip plan...", ui: "final" },
//       ]);
//     }

//     setStep(nextStep);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// };

const sendHandle = async () => {
  if (!userInput?.trim()) return;

  setLoading(true);

  const newMsg: Messages = { role: "user", content: userInput };
  setMessages(prev => [...prev, newMsg]);
  setUserInput("");

  try {
    const result = await axios.post("/api/aimodel", {
      step,
      answer: userInput.trim(),
      isFinal, // pass this to trigger FINAL_PROMPT
    });

    const aiReply = result?.data?.resp;
    const nextStep = result?.data?.ui as Step;

    // If it's the final step, show PlanningTripUi with loading until trip is ready
    if (nextStep === "final") {
      setIsFinal(true);

      // Show loading in the UI
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "🎉 Generating your complete trip plan...", ui: "final" },
      ]);
    } else if (aiReply) {
      setMessages(prev => [...prev, { role: "assistant", content: aiReply, ui: nextStep }]);
    }

    setStep(nextStep);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

// Handle "View Trip" click
const handleViewTrip = async () => {
  setLoading(true);
  try {
    const result = await axios.post("/api/aimodel", {
      step: "final",
      answer: "", // answer is not needed for final generation
      isFinal: true,
       messages,
    });

    console.log("FINAL TRIP PLAN:", result.data); // <-- here you have full JSON as per FINAL_PROMPT
    //save the data when result comes
    if(isFinal){
      setTripDetail(result?.data?.trip_plan)
    }
    // You can now navigate to a page or display the trip plan
    // e.g., setTripPlan(result.data)
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const RenderGenerativeUi = (ui:string)=>{

    if(ui =='budget'){
      //render buddet ui
      return <BudgetUi onSelectedOption={(e:string)=>{setUserInput(e); sendHandle()}}/>
    }
    else if(ui == 'groupSize'){
      //render size ui component
      return <GroupSizeUi onSelectedOption={(e:string)=>{setUserInput(e); sendHandle()}}/>

    }
   else if(ui == "tripDuration"){
    return <TripDuration onSelectedOption={(e:string)=>{setUserInput(e); sendHandle()}}/>
}
  else if(ui === "final"){
  return (
    <PlanningTripUi 
      loading={loading} 
      onViewTrip={handleViewTrip} 
      disable={!tripDetail}
    />
  )
}
      
        return null
      
  }
useEffect(() => {
  const lastMsg = messages[messages.length - 1];
  if (lastMsg?.ui === "final") {
    setIsFinal(true);
    // Defer sendHandle to avoid cascading render
    setUserInput("Ok , Greate!")
    setTimeout(() => {
      sendHandle();
    }, 0);
  }
}, [messages]);
  return (
    <div className='h-[85vh] flex flex-col'>
      {/* display messages */}
      <section className='flex-1 overflow-y-auto p-4'>
        {
          messages.length==0&& <EmptyBoxState onSelectOption={(v:string)=>{setUserInput(v);}}/>
        }

        {
          messages.map((msg:Messages,index)=>{
            return msg.role=="user"?
            <div className='flex justify-end mt-2' key={index}>
          <div className='max-w-lg bg-primary text-white px-4 py-4 rounded-lg'>
           {msg.content}
          </div>
        </div>:
          <div className='flex justify-start mt-2' key={index}>
          <div className='max-w-lg bg-gray-100 text-black px-4 py-4 rounded-lg'>
             {msg.content}
             {RenderGenerativeUi(msg.ui??'')}
          </div>
        </div>

          })
        }
         {loading && <div className='flex justify-start mt-2' >
          <div className='max-w-lg bg-gray-100 text-black px-4 py-4 rounded-lg'>
             {<Loader className="animate-spin"/>}
          </div>
        </div>}
        
      
      </section>

      {/* user input */}
      <section className="flex justify-center">
        <div className="w-full max-w-2xl mt-10 flex flex-col gap-4 relative ">
        <Textarea
          placeholder="start typing here..."
          className="w-full h-32 bg-background border border-border rounded-md shadow-md focus:border-primary focus-visible:ring-0 resize-none px-4 py-3 text-base "
          onChange={(e)=>setUserInput(e.target.value??"")}
          value={userInput}
        />
        <Button size={"icon"} className="absolute  bottom-4 right-4 cursor-pointer hover:shadow-2xl" onClick={()=>sendHandle()}>
          <Send className="h-4 w-4" />
        </Button>
       
      </div>
      </section>
    </div>
  )
}

export default ChatBox


