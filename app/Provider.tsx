"use client"
import { useMutation } from "convex/react";
import Header from "./_components/Header";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDeatailContext";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>  ) => {

  const createUser = useMutation(api.user.createNewUser);
const [userDetail, setUserDetail] = useState<any>()
  const {user} = useUser();

  useEffect(()=>{
    user&& createNewUser()
  },[user])
  const createNewUser = async()=>{
    if(user){
      const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress??'',
      imageUrl: user?.imageUrl??'',
      name:user?.fullName??''
    })
    setUserDetail(result)
    }
  }
  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
    <div>

      <Header/>
        {children}
    </div>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUserDetail = ()=>{
  return useContext(UserDetailContext);
}
