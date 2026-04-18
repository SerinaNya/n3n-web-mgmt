import { Button } from "@/components/ui/button"

export function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-6">n3n Web Management</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A comprehensive web management tool for n3n, providing easy access to network configuration and monitoring.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <a href="/edges">View Edges</a>
          </Button>
          <Button variant="secondary">Documentation</Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage