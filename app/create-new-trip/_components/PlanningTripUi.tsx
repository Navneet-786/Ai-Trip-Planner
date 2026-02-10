"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'

type Props = {
  loading: boolean;
  onViewTrip: () => Promise<void>;
  disable?: boolean;
};


const PlanningTripUi: React.FC<Props> = ({ onViewTrip, loading ,disable}:Props) => {
  const [toShow, setToShow] = useState<boolean>(false)
 useEffect(() => {
  const timer = setTimeout(() => {
    setToShow(prev => !prev);
  }, 10000);

  return () => clearTimeout(timer);
}, []);
  return (
    <div className='flex flex-col items-center justify-center mt-4 p-4'>
      {loading ? (
       <div className='text-center flex flex-col items-center'>
         <Loader className="animate-spin h-6 w-6 text-primary" />
         <p className='my-2 text-gray-400'>wait for minimum 20 sec</p>
         {toShow && <p className='text-slate-500'>It may take some Time , Please keep patience.. </p>}
       </div>
      ) : (
        <>
          <p className='mb-1 text-center text-lg font-medium'>
            Your trip plan is ready!
          </p>
         
          <Button disabled={disable} className='cursor-pointer hover:scale-101 hover:shadow-lg transition' onClick={onViewTrip}>View Trip</Button>
        </>
      )}
    </div>
  )
}

export default PlanningTripUi
