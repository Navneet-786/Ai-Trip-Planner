import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const Pricing = () => {
  return (
    <div className='mt-40 text-center'>
      <h1 className='mb-10 text-4xl'>Ai Trip Planner - <span className='bg-yellow-500 text-white rounded-2xl px-4 py-2'>Choose Your Plan </span></h1>
       <div style={{ maxWidth: '800px', margin: '0 auto',       padding: '0 1rem' }}>
        <PricingTable />
      </div>
    </div>
  )
}

export default Pricing
