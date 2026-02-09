"use client"
import { createContext } from "react";

interface UserDetailContextType {
  userDetail: any;
  setUserDetail: (val: any) => void;
}

export const UserDetailContext = createContext<UserDetailContextType>({
  userDetail: null,
  setUserDetail: () => {}
});
