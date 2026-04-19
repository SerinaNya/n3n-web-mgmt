import { createBrowserRouter } from "react-router-dom"
import HomePage from "@/pages/HomePage"
import EdgesPage from "@/pages/EdgesPage"
import SupernodesPage from "@/pages/SupernodesPage"
import StatsPage from "@/pages/StatsPage"
import RootLayout from "@/components/RootLayout"

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/edges",
        element: <EdgesPage />
      },
      {
        path: "/supernodes",
        element: <SupernodesPage />
      },
      {
        path: "/stats",
        element: <StatsPage />
      }
    ]
  }
])

export default router