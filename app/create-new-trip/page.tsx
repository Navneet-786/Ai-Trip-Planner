
import Chatbox from "./_components/ChatBox"
import Iternary from "./_components/Iternary"


// const CreateNewTrip = () => {
//   return (
// <div className='grid grid-cols-1 lg:grid-cols-5 gap-5 p-5   '>
      
//       {/* CHAT COLUMN */}
//       <div className="lg:col-span-2 border p-4 rounded-lg bg-slate-200">
//         <Chatbox />
//       </div>

//       {/* MAP COLUMN */}
//       <div className="lg:col-span-3">
//         <Iternary/>
//       </div>

//     </div>
//   )
// }


const CreateNewTrip = () => {
  return (
    <div className="min-h-[89vh] w-full">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 p-5 h-full ">
        
        {/* CHAT COLUMN */}
        <div className="md:col-span-2  border rounded-lg bg-[#ECFCFF] h-full pb-4 px-4 border shadow-lg">
          <Chatbox />
        </div>

        {/* ITINERARY COLUMN */}
        <div className="lg:col-span-3 h-full">
          <Iternary />
        </div>

      </div>
    </div>
  )
}

export default CreateNewTrip
