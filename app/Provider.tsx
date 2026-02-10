// "use client"
// import { useMutation } from "convex/react";
// import Header from "./_components/Header";
// import { api } from "@/convex/_generated/api";
// import { useUser } from "@clerk/nextjs";
// import { useContext, useEffect, useState } from "react";
// import { UserDetailContext } from "@/context/UserDeatailContext";

// const Provider = ({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>  ) => {

//   const createUser = useMutation(api.user.createNewUser);
// const [userDetail, setUserDetail] = useState<any>()
//   const {user} = useUser();

//   useEffect(()=>{
//     user&& createNewUser()
//   },[user])
//   const createNewUser = async()=>{
//     if(user){
//       const result = await createUser({
//       email: user?.primaryEmailAddress?.emailAddress??'',
//       imageUrl: user?.imageUrl??'',
//       name:user?.fullName??''
//     })
//     setUserDetail(result)
//     }
//   }
//   return (
//     <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
//     <div>

//       <Header/>
//         {children}
//     </div>
//     </UserDetailContext.Provider>
//   )
// }

// export default Provider

// export const useUserDetail = ()=>{
//   return useContext(UserDetailContext);
// }




"use client"

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useContext } from "react";
import Header from "./_components/Header";
import { UserDetailContext } from "@/context/UserDetailContext";
import { TripContextType, TripDetailContext } from "@/context/TripDetailContext";
import { TripInfo } from "./create-new-trip/_components/ChatBox";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const createUser = useMutation(api.user.createNewUser);
  const [userDetail, setUserDetail] = useState<any>(null);

  const [tripDetailInfo,setTripDetailInfo] = useState<TripInfo|null>(null)

  const createNewUser = async () => {
    if (user) {
      const result = await createUser({
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user?.imageUrl ?? "",
        name: user?.fullName ?? "",
      });
      setUserDetail(result);
    }
  };

  useEffect(() => {
    if (user) createNewUser();
  }, [user]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <TripDetailContext.Provider value={{tripDetailInfo, setTripDetailInfo}}>
     
        <Header />
        {children}
     
      </TripDetailContext.Provider>
    </UserDetailContext.Provider>
  );
};

export default Provider;

// ✅ Custom hook
export const useUserDetail = () => useContext(UserDetailContext);


export const useTripDetail=():TripContextType=>{
  const context = useContext(TripDetailContext);
  if (!context) {
    throw new Error("useTripDetail must be used within TripDetailContext.Provider");
  }
  return context;
}