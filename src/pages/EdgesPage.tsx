import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"
import { TimeAgo } from "@/components/TimeAgo"

type Edge = {
  mode: string
  community: string
  ip4addr: string
  purgeable: number
  local: number
  macaddr: string
  sockaddr: string
  prefered_sockaddr: string
  desc: string
  version: string
  timeout: number
  uptime: number
  time_alloc: number
  last_p2p: number
  last_sent_query: number
  last_seen: number
}

// 获取 edges 数据的函数
async function fetchEdgesData(): Promise<Edge[]> {
  const response = await fetch("/api/edges")
  if (!response.ok) {
    throw new Error("Failed to fetch edges")
  }
  const data = await response.json()
  // API 返回的是 { result: [...edges] } 格式
  return data.result || []
}

export function EdgesPage() {
  const {
    data: edges = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["edges"],
    queryFn: fetchEdgesData,
  })

  // 监听错误状态，显示 toast 错误提示
  useEffect(() => {
    if (error) {
      toast.error("Failed to load edges data")
    }
  }, [error])

  function getBadgeClass(mode: string) {
    switch (mode) {
      case "p2p":
        return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      case "pSp":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
      case "sn":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      default:
        return ""
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edges</h1>
        <Button onClick={() => refetch()} disabled={loading}>
          {loading ? "Fetching..." : "Refresh"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-16">Mode</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>MAC Address</TableHead>
              <TableHead>Socket Address</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead className="text-right w-20">Properties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? // 显示 skeleton 加载状态
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-8 rounded-full mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-4 rounded-full ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              : // 显示实际数据
                edges.map((edge, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      <Badge className={getBadgeClass(edge.mode)}>
                        {edge.mode}
                      </Badge>
                    </TableCell>
                    <TableCell>{edge.community}</TableCell>
                    <TableCell>{edge.ip4addr}</TableCell>
                    <TableCell>{edge.macaddr}</TableCell>
                    <TableCell>{edge.sockaddr}</TableCell>
                    <TableCell>{edge.desc}</TableCell>
                    <TableCell>
                      <TimeAgo timestamp={edge.last_seen} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Drawer direction="right">
                        <DrawerTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontalIcon />
                            <span className="sr-only">View Edge Details</span>
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="sm:max-w-125">
                          <DrawerHeader>
                            <DrawerTitle>Edge Properties</DrawerTitle>
                            <DrawerDescription>
                              All properties for this edge
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="no-scrollbar space-y-4 overflow-y-auto">
                            <div className="mt-2 space-y-4 px-4">
                              <Card>
                                
                                <CardContent>
                                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Mode
                                      </p>
                                      <p className="mt-1"><Badge className={getBadgeClass(edge.mode)}>{edge.mode}</Badge></p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Community
                                      </p>
                                      <p className="mt-1">{edge.community}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        IP Address
                                      </p>
                                      <p className="mt-1">{edge.ip4addr}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        MAC Address
                                      </p>
                                      <p className="mt-1">{edge.macaddr}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Socket Address
                                      </p>
                                      <p className="mt-1">{edge.sockaddr}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Preferred Socket Address
                                      </p>
                                      <p className="mt-1">
                                        {edge.prefered_sockaddr}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Description
                                      </p>
                                      <p className="mt-1">{edge.desc}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Version
                                      </p>
                                      <p className="mt-1">{edge.version}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Purgeable
                                      </p>
                                      <p className="mt-1">{edge.purgeable === 1 ? "Yes" : "No"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Local
                                      </p>
                                      <p className="mt-1">{edge.local === 1 ? "Yes" : "No"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Timeout
                                      </p>
                                      <p className="mt-1">{edge.timeout} s</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Uptime
                                      </p>
                                      <p className="mt-1">{edge.uptime}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Time Allocated
                                      </p>
                                      <p className="mt-1">
                                        <TimeAgo timestamp={edge.time_alloc} />
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Last P2P
                                      </p>
                                      <p className="mt-1">
                                        <TimeAgo timestamp={edge.last_p2p} />
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Last Sent Query
                                      </p>
                                      <p className="mt-1">
                                        <TimeAgo timestamp={edge.last_sent_query} />
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        Last Seen
                                      </p>
                                      <p className="mt-1">
                                        <TimeAgo timestamp={edge.last_seen} />
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                            <pre className="overflow-auto rounded-md bg-muted p-4 text-sm">
                              {JSON.stringify(edge, null, 2)}
                            </pre>
                          </div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Close</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default EdgesPage