import { Link, useLocation } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const pages = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Edges",
      path: "/edges",
    },
    {
      name: "Supernodes",
      path: "/supernodes",
    },
    {
      name: "Stats",
      path: "/stats",
    },
  ]

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold">
            n3n Web Management
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            {pages.map((page) => (
              <NavigationMenuLink asChild key={page.path}>
                <Link
                  to={page.path}
                  className={isActive(page.path) ? "font-medium" : ""}
                >
                  {page.name}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}

export default Navbar