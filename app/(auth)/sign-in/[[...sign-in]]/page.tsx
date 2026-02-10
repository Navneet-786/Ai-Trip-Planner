"use client";

import { SignIn } from "@clerk/nextjs";


export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      {/* Card wrapper */}
      <div className="bg-white dark:bg-pink-900 rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-[800px] flex flex-col items-center">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-pink-600 dark:text-pink-400 mb-6 text-center">
          Welcome Back!
        </h1>

        {/* Clerk SignIn component */}
        <SignIn 
          routing="path"
          path="/sign-in"
          appearance={{
       
            variables: {
              colorPrimary: "#ec4899", // Tailwind pink-500
              colorText: "#111827",
              colorBackground: "#ffffff",
              colorInputBackground: "#fce7f3", // light pink input bg
              borderRadius: "0.75rem",
              spacingUnit: "0.75rem",
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
        
      
       
      </div>
    </div>
  );
}
