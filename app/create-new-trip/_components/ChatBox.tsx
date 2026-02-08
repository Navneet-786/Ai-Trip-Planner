"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send } from 'lucide-react'
import React, { useState } from 'react'
import EmptyBoxState from './EmptyBoxState'

interface Messages{
  role:string,
  content:string
}
const ChatBox = () => {
  const [loading,setLoading] = useState(false)
const [messages,setMessages] = useState<Messages[]>([])
const [userInput,setUserInput] = useState<string>();
  const sendHandle = async()=>{
    if(!userInput?.trim())return;
    setLoading(true);
    const newMsg:Messages = {
      role: "user",
      content:userInput
    }
    setUserInput("");
    setMessages((prev:Messages[])=>[...prev, newMsg])
    const result = await axios.post("/api/aimodel",{
      messages:[...messages, newMsg]
    })
    // setMessages((prev:Messages[])=>[...prev,{
      //   role: "assistant",
      //   content: result?.data?.resp ?? '...'
      // }])
      
      const aiReply = result?.data?.resp;
      
      if (aiReply) {
        setMessages((prev:Messages[])=>[
          ...prev,
          { role: "assistant", content: aiReply }
        ]);
      }
      setLoading(false);
   
    console.log(result.data)
  }
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
      <section>
        <div className="w-full max-w-2xl mt-10 flex flex-col gap-4 relative">
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
