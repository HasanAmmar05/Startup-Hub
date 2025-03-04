import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BadgePlus, LogOut } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, signOut, signIn  } from '@/auth'

const Navbar =  async () => {

    const session = await auth()
    return (
        <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
          <nav className="flex justify-between items-center">
            <Link href="/">
              <Image src="/logo.png" alt="logo" width={144} height={30} />
            </Link>
    
            <div className="flex items-center gap-5 text-black">
              {session && session?.user ? ( // If session exists and has a user (authenticated user), 
              // it shows "Create" and "Logout" options.
                <>
                  <Link href="/startup/create">
                    <span className="max-sm:hidden">Create</span>
                    <BadgePlus className="size-6 sm:hidden" />
                  </Link>
    
                  <form
                    action={async () => {
                      "use server";
    
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button type="submit">
                      <span className="max-sm:hidden">Logout</span>
                      <LogOut className="size-6 sm:hidden text-red-500" />
                    </button>
                  </form>
    
                </>
              ) /* End of code for the Logged in user */ 
              
              // Code for the Un-logged in user 

              : (
                <form
                  action={async () => {
                    "use server";
    
                    await signIn("github");
                  }}
                >
                  <button type="submit">Login</button>
                </form>
              )}
            </div>
          </nav>
        </header>
      );
    };

export default Navbar