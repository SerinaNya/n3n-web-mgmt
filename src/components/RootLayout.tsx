import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/Navbar"

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default RootLayout