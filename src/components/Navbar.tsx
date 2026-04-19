import { Link, useLocation } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useTranslation } from "react-i18next"

export function Navbar() {
  const location = useLocation()
  const { t } = useTranslation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const pages = [
    {
      name: t("edges.title"),
      path: "/edges",
    },
    {
      name: t("supernodes.title"),
      path: "/supernodes",
    },
    {
      name: t("communities.title"),
      path: "/communities",
    },
    {
      name: t("stats.title"),
      path: "/stats",
    },
  ]

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold">
            {t("common.appName")}
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