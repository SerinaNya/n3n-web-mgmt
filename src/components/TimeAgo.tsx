import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DateTime } from "luxon"

interface TimeAgoProps {
  timestamp: number
}

export function TimeAgo({ timestamp }: TimeAgoProps) {
  if (timestamp === 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="italic">Never</span>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const date = new Date(timestamp * 1000)
  const formattedDate = date.toLocaleString()
  const now = DateTime.now()
  const timeAgo = DateTime.fromJSDate(date).toRelative({ base: now })

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{formattedDate}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{timeAgo}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TimeAgo