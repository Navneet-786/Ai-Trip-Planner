"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const { user } = useUser();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
         <Link href={"/"}>
          <Image src="/NavLogo.svg" alt="logo" width={35} height={35} />
          <h2 className="font-bold text-xl md:text-2xl">
            AI Trip Planner
          </h2>
         </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-slate-500">
          {menuOptions.map((menu, index) => (
            <Link key={index} href={menu.path}>
              <span className="text-lg hover:text-black transition">
                {menu.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <SignInButton mode="modal">
              <Button>Get Started</Button>
            </SignInButton>
          ) : path === "/create-new-trip" ? (
            <Link href="/my-trips">
              <Button>My Trips</Button>
            </Link>
          ) : (
            <Link href="/create-new-trip">
              <Button>+ Create New Trip</Button>
            </Link>
          )}
          {user && <UserButton />}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-start">
          {menuOptions.map((menu, index) => (
            <Link
              key={index}
              href={menu.path}
              onClick={() => setOpen(false)}
              className="text-lg text-slate-600"
            >
              {menu.name}
            </Link>
          ))}

          {!user ? (
            <SignInButton mode="modal">
              <div className="bg-white text-slate-500 text-lg flex w-full">Get Started</div>
            </SignInButton>
          ) : path === "/create-new-trip" ? (
            <Link href="/my-trips">
              <div  className="bg-white text-slate-500 text-lg flex w-full">My Trips</div>
            </Link>
          ) : (
            <Link href="/create-new-trip">
              <div className="bg-white text-slate-500 text-lg flex w-full"> Create New Trip</div>
            </Link>
          )}

          {user && (
            <div className="flex justify-start gap-2">
              <UserButton />
              {user?.fullName}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
