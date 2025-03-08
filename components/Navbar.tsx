import Link from "next/link"
import Image from "next/image"
import { BadgePlus, LogOut, User } from "lucide-react"
import { auth } from "@/auth"
import { signOut, signIn } from "@/auth"

const Navbar = async () => {
  const session = await auth()

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session?.user ? (
            <>
              <Link
                href={`/user/${session.user.id}`} // Now using session.user.id
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <User className="size-4" />
                <span className="max-sm:hidden">{session.user.name || "User"}</span>
              </Link>

              <Link href="/startup/create" className="flex items-center hover:text-primary transition-colors">
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>

              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
              >
                <button type="submit" className="flex items-center hover:text-red-500 transition-colors">
                  <span className="max-sm:hidden">Logout</span>
                  <LogOut className="size-6 sm:hidden text-red-500" />
                </button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server"
                await signIn("github")
              }}
            >
              <button type="submit" className="hover:text-primary transition-colors">
                Login
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar

