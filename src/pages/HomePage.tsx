import { Button } from "@/components/ui/button"
import { ArrowUpRightIcon } from "lucide-react"

export function HomePage() {
  return (
    <div className="my-auto flex h-full flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <h1 className="mb-6 text-4xl font-bold">n3n Web Management</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          A comprehensive web management tool for n3n, providing easy access to
          network configuration and monitoring.
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