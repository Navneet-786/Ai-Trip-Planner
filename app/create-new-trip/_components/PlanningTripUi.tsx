import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'

interface Props {
  onViewTrip: () => void
  loading?: boolean
}

const PlanningTripUi: React.FC<Props> = ({ onViewTrip, loading ,disable}:any) => {
  return (
    <div className='flex flex-col items-center justify-center mt-4 p-4'>
      {loading ? (
        <Loader className="animate-spin h-6 w-6 text-primary" />
      ) : (
        <>
          <p className='mb-4 text-center text-lg font-medium'>
            Your trip plan is ready!
          </p>
          <Button disabled={disable} onClick={onViewTrip}>View Trip</Button>
        </>
      )}
    </div>
  )
}

export default PlanningTripUi
