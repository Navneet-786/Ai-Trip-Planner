import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

//Menu options
const menuOptions = [
  {
    name:"Home", 
    path:"/"
  },
  {
    name: "Pricing",
    path:'/pricing'
  }
  ,{
    name: "Contact",
    path:"/contact"
  }
]

const Header = () => {



  return (
    <div className='flex justify-between items-center pt-4 px-8'>


      <div className='flex items-center gap-4'>
          {/* Lgog */}
        <Image src={"/NavLogo.svg"} alt='logooo' width={35} height={35}/>
        <h2 className='font-bold text-2xl'>Ai Trip Planner</h2>
      </div>



      {/* menu option */}
      <div className='flex gap-8 items-center text-slate-500'>
          {menuOptions.map((menu, index) => (
      <Link href={menu.path} key={index}>
        <h2 className='text-lg hover:scale-105 transition-all hover:border-b-white'>{menu.name}</h2>
      </Link>
      ))}
      </div>

      <SignInButton mode='modal'>
      <Button className='hover:scale-105 transition-all hover:shadow-2xl'>Get Started</Button>
      </SignInButton>
    </div>
  )
}

export default Header
