"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pie, PieChart } from "recharts"
import { Empty, EmptyDescription } from "@/components/ui/empty"
import { Item, ItemTitle, ItemDescription } from "@/components/ui/item"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { toast } from "sonner"
import { TimeAgo } from "@/components/TimeAgo"

type DaemonInfo = {
  version: string
  builddate: string
  is_edge: number
  is_supernode: number
  macaddr: string
  ip4addr: string
  sockaddr: string
}

type Timestamps = {
  last_register_req: number
  last_rx_p2p: number
  last_rx_super: number
  last_sweep: number
  last_sn_fwd: number
  last_sn_reg: number
  start_time: number
}

type PacketStat = {
  type: string
  tx_pkt?: number
  rx_pkt?: number
  nak?: number
}

// 获取守护进程信息的函数
async function fetchDaemonInfo(): Promise<DaemonInfo> {
  const response = await fetch("/api/info")
  if (!response.ok) {
    throw new Error("Failed to fetch daemon info")
  }
  const data = await response.json()
  return data.result
}

// 获取 timestamps 数据的函数
async function fetchTimestamps(): Promise<Timestamps> {
  const response = await fetch("/api/timestamps")
  if (!response.ok) {
    throw new Error("Failed to fetch timestamps")
  }
  const data = await response.json()
  return data.result
}

// 获取 packetstats 数据的函数
async function fetchPacketStats(): Promise<PacketStat[]> {
    const response = await fetch("/api/packetstats")
    if (!response.ok) {
      throw new Error("Failed to fetch packet stats")
    }
    const data = await response.json()
    return data.result
}

// 饼图数据转换函数
function getPieChartData(stat: PacketStat) {
  const data = []
  if (stat.tx_pkt) {
    data.push({
      name: "TX Packets",
      value: stat.tx_pkt,
      fill: "var(--chart-1)",
    })
  }
  if (stat.rx_pkt) {
    data.push({
      name: "RX Packets",
      value: stat.rx_pkt,
      fill: "var(--chart-2)",
    })
  }
  return data
}

// 类型名称映射
const typeNameMap: Record<string, string> = {
  transop: "Transform Operation",
  p2p: "P2P",
  super: "Supernode",
  super_broadcast: "Supernode Broadcast",
  tuntap_error: "Tuntap Error",
  multicast_drop: "Multicast Drop",
  sn_fwd: "Supernode Forward",
  sn_broadcast: "Supernode Broadcast",
  sn_reg: "Supernode Register",
  sn_errors: "Supernode Errors",
}

export function StatsPage() {
  const {
    data: daemonInfo,
    isLoading: infoLoading,
    error: infoError,
    refetch: refetchInfo,
  } = useQuery({
    queryKey: ["daemonInfo"],
    queryFn: fetchDaemonInfo,
  })

  const {
    data: timestamps,
    isLoading: timestampsLoading,
    error: timestampsError,
    refetch: refetchTimestamps,
  } = useQuery({
    queryKey: ["timestamps"],
    queryFn: fetchTimestamps,
  })

  const {
    data: packetStats = [],
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["packetStats"],
    queryFn: fetchPacketStats,
  })

  // 监听错误状态，显示 toast 错误提示
  useEffect(() => {
    if (infoError) {
      toast.error("Failed to load daemon information")
    }
    if (timestampsError) {
      toast.error("Failed to load timestamps")
    }
    if (statsError) {
      toast.error("Failed to load packet statistics")
    }
  }, [infoError, timestampsError, statsError])

  // 根据 daemon 类型过滤统计数据
  const filteredStats = daemonInfo
    ? daemonInfo.is_supernode === 1
      ? packetStats.filter((stat) => stat.type.startsWith("sn_"))
      : daemonInfo.is_edge === 1
        ? packetStats.filter((stat) => !stat.type.startsWith("sn_"))
        : packetStats
    : packetStats

  // 过滤出适合用饼图展示的 stats（同时拥有 tx_pkt 和 rx_pkt）
  const chartStats = filteredStats.filter(
    (stat) => stat.tx_pkt !== undefined && stat.rx_pkt !== undefined
  )

  // 过滤出不适合用饼图展示的 stats
  const cardStats = filteredStats.filter(
    (stat) => stat.tx_pkt === undefined || stat.rx_pkt === undefined
  )

  const handleRefresh = () => {
    refetchInfo()
    refetchTimestamps()
    refetchStats()
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stats</h1>
        <Button onClick={handleRefresh} disabled={infoLoading || timestampsLoading || statsLoading}>
          {infoLoading || timestampsLoading || statsLoading ? "Fetching..." : "Refresh"}
        </Button>
      </div>

      {/* 守护进程信息部分 */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Daemon Information</h2>
        <div className="flex flex-wrap gap-6">
          <Card className="flex-1 min-w-75">
            <CardHeader>
              <CardTitle>Current Daemon</CardTitle>
              <CardDescription>
                Basic information about the current daemon
              </CardDescription>
            </CardHeader>
            <CardContent>
              {infoLoading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                </div>
              ) : daemonInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Type
                      </p>
                      <div className="mt-1">
                        {daemonInfo.is_edge === 1 && (
                          <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            Edge
                          </Badge>
                        )}
                        {daemonInfo.is_supernode === 1 && (
                          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            Supernode
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Version
                      </p>
                      <p className="mt-1">{daemonInfo.version}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Build Date
                      </p>
                      <p className="mt-1">{daemonInfo.builddate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        MAC Address
                      </p>
                      <p className="mt-1">{daemonInfo.macaddr}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        IP Address
                      </p>
                      <p className="mt-1">{daemonInfo.ip4addr}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Socket Address
                      </p>
                      <p className="mt-1">{daemonInfo.sockaddr}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-75">
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
              <CardDescription>
                Recent activity timestamps
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timestampsLoading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                </div>
              ) : timestamps ? (
                <div className="space-y-4">
                  {daemonInfo?.is_edge === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Last Register Request
                          </p>
                          <p className="mt-1">
                            <TimeAgo timestamp={timestamps.last_register_req} />
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Last RX P2P
                          </p>
                          <p className="mt-1">
                            <TimeAgo timestamp={timestamps.last_rx_p2p} />
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Last RX Super
                          </p>
                          <p className="mt-1">
                            <TimeAgo timestamp={timestamps.last_rx_super} />
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Last Sweep
                          </p>
                          <p className="mt-1">
                            <TimeAgo timestamp={timestamps.last_sweep} />
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {daemonInfo?.is_supernode === 1 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Last SN Forward
                        </p>
                        <p className="mt-1">
                          <TimeAgo timestamp={timestamps.last_sn_fwd} />
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Last SN Register
                        </p>
                        <p className="mt-1">
                          <TimeAgo timestamp={timestamps.last_sn_reg} />
                        </p>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Start Time
                    </p>
                    <p className="mt-1">
                      <TimeAgo timestamp={timestamps.start_time} />
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Packet Stats 部分 */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Packet Statistics</h2>

        {/* 饼图部分 */}
        {!(daemonInfo?.is_supernode === 1) && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-medium">Traffic Distribution</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {statsLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>
                          <Skeleton className="h-4 w-32" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <Skeleton className="h-full w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : chartStats.map((stat) => {
                    const pieData = getPieChartData(stat)
                    const hasData = pieData.some((item) => item.value > 0)

                    return (
                      <Card key={stat.type}>
                        <CardHeader>
                          <CardTitle>
                            {typeNameMap[stat.type] || stat.type}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            {hasData ? (
                              <ChartContainer
                                config={
                                  {
                                    value: {
                                      label: "value",
                                    },
                                    tx_pkt: {
                                      label: "TX Packets",
                                      color: "var(--chart-1)",
                                    },
                                    rx_pkt: {
                                      label: "RX Packets",
                                      color: "var(--chart-2)",
                                    },
                                  } satisfies ChartConfig
                                }
                                className="w-full h-full max-h-62.5 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                              >
                                <PieChart>
                                  <ChartTooltip
                                    content={<ChartTooltipContent hideLabel />}
                                  />
                                  <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    label
                                  />
                                </PieChart>
                              </ChartContainer>
                            ) : (
                              <Empty className="h-full">
                                <EmptyDescription>
                                  No packets.
                                </EmptyDescription>
                              </Empty>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
            </div>
          </div>
        )}

        {/* 卡片部分 */}
        <div>
          <h3 className="mb-4 text-lg font-medium">Other Statistics</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {statsLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-4 w-32" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : cardStats.map((stat) => (
                  <Card key={stat.type}>
                    <CardHeader>
                      <CardTitle>
                        {typeNameMap[stat.type] || stat.type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-row gap-2">
                        {stat.tx_pkt !== undefined && (
                          <Item>
                            <ItemTitle>TX Packets</ItemTitle>
                            <ItemDescription>{stat.tx_pkt}</ItemDescription>
                          </Item>
                        )}
                        {stat.rx_pkt !== undefined && (
                          <Item>
                            <ItemTitle>RX Packets</ItemTitle>
                            <ItemDescription>{stat.rx_pkt}</ItemDescription>
                          </Item>
                        )}
                        {stat.nak !== undefined && (
                          <Item>
                            <ItemTitle>NAK</ItemTitle>
                            <ItemDescription>{stat.nak}</ItemDescription>
                          </Item>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage