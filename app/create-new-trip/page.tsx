import React from "react"
import Chatbox from "./_components/ChatBox"

const CreateNewTrip = () => {
  return (
<div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-5 '>
      
      {/* CHAT COLUMN */}
      <div className="">
        <Chatbox />
      </div>

      {/* MAP COLUMN */}
      <div className="">
        map trip plans
      </div>

    </div>
  )
}

export default CreateNewTrip
