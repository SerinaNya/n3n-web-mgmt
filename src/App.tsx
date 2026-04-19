import { RouterProvider } from "react-router-dom"
import router from "@/routes"
import { Toaster } from "@/components/ui/sonner"

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" expand={true} richColors />
    </>
  )
}

export default App