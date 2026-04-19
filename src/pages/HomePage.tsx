import { Button } from "@/components/ui/button"
import { ArrowUpRightIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

export function HomePage() {
  const { t } = useTranslation()
  
  return (
    <div className="my-auto flex h-full flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <h1 className="mb-6 text-4xl font-bold">{t("home.title")}</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {t("home.description")}
        </p>
        <p>
          <a href="https://github.com/SerinaNya/n3n-web-mgmt" target="_blank">
            <Button variant="ghost">
              GitHub <ArrowUpRightIcon />
            </Button>
          </a>
        </p>
      </div>
    </div>
  )
}

export default HomePage