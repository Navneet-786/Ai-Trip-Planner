import { Button } from '@/components/ui/button'
import { SignInButton, UserAvatar, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'


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

const {user} = useUser();

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

     <div className='flex items-center gap-4'>
       {!user?<SignInButton mode='modal'>
      <Button className='hover:scale-105 transition-all hover:shadow-2xl'>Get Started</Button>
      </SignInButton>:
      <Link href={"/create-trip"}>
       <Button>+ Create New Trip</Button>
      </Link>
      }
      {user&& <UserAvatar />}
     </div>
    </div>
  )
}

export default Header
