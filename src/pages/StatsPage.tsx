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
import { useTranslation } from "react-i18next"

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
  last_register_req?: number
  last_rx_p2p?: number
  last_rx_super?: number
  last_sweep?: number
  last_sn_fwd?: number
  last_sn_reg?: number
  start_time: number
  last_p2p?: number
  last_super?: number
  last_fwd?: number
  last_reg_super?: number
}

type PacketStat = {
  type: string
  tx_pkt?: number
  rx_pkt?: number
  nak?: number
}

// 获取守护进程信息的函数
async function fetchDaemonInfo(): Promise<DaemonInfo | null> {
  const response = await fetch("/api/info")
  if (response.status === 404) {
    // 404 表示当前版本的守护进程不支持守护进程信息
    return null
  }
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
      name: "tx_pkt",
      value: stat.tx_pkt,
      fill: "var(--chart-1)",
    })
  }
  if (stat.rx_pkt) {
    data.push({
      name: "rx_pkt",
      value: stat.rx_pkt,
      fill: "var(--chart-2)",
    })
  }
  return data
}

// 类型名称映射
// 类型名称映射将使用 i18n 翻译

export function StatsPage() {
  const { t } = useTranslation()
  
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
  
  // 最终才进行守护进程信息查询
  // 因为如果此功能未被实现的话会卡住页面加载
  const {
    data: daemonInfo,
    isLoading: infoLoading,
    error: infoError,
    refetch: refetchInfo,
  } = useQuery<DaemonInfo | null>({
    queryKey: ["daemonInfo"],
    queryFn: fetchDaemonInfo,
  })

  // 监听错误状态，显示 toast 错误提示
  useEffect(() => {
    if (infoError) {
      toast.error(t("errors.loadDaemonInfo"))
    }
    if (timestampsError) {
      toast.error(t("errors.loadTimestamps"))
    }
    if (statsError) {
      toast.error(t("errors.loadStats"))
    }
  }, [infoError, timestampsError, statsError, t])

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
        <h1 className="text-2xl font-bold">{t("stats.title")}</h1>
        <Button
          onClick={handleRefresh}
          disabled={infoLoading || timestampsLoading || statsLoading}
        >
          {infoLoading || timestampsLoading || statsLoading
            ? t("common.fetching")
            : t("common.refresh")}
        </Button>
      </div>

      {/* 守护进程信息部分 */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">{t("stats.daemonInfo")}</h2>
        <div className="flex flex-wrap gap-6">
          <Card className="min-w-75 flex-1">
            <CardHeader>
              <CardTitle>{t("stats.daemon")}</CardTitle>
              <CardDescription>
                {t("stats.daemonDescription")}
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
              ) : daemonInfo === null ? (
                  <Empty className="h-full">
                    <EmptyDescription>
                      {t("stats.daemonInfoNotImplemented")}
                    </EmptyDescription>
                  </Empty>
              ) : daemonInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("stats.type")}
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
                        {t("stats.version")}
                      </p>
                      <p className="mt-1">{daemonInfo.version}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("stats.buildDate")}
                      </p>
                      <p className="mt-1">{daemonInfo.builddate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("stats.macAddress")}
                      </p>
                      <p className="mt-1">{daemonInfo.macaddr}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("stats.ipAddress")}
                      </p>
                      <p className="mt-1">{daemonInfo.ip4addr}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("stats.socketAddress")}
                      </p>
                      <p className="mt-1">{daemonInfo.sockaddr}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Card className="min-w-75 flex-1">
            <CardHeader>
              <CardTitle>{t("stats.timestamps")}</CardTitle>
              <CardDescription>
                {t("stats.timestampsDescription")}
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {timestamps.last_register_req && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("stats.lastRegisterRequest")}
                        </p>
                        <p className="mt-1">
                          <TimeAgo timestamp={timestamps.last_register_req} />
                        </p>
                      </div>
                    )}
                    {(timestamps.last_rx_p2p !== undefined ||
                      timestamps.last_p2p !== undefined) && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("stats.lastRXP2P")}
                        </p>
                        <p className="mt-1">
                          <TimeAgo
                            timestamp={
                              (timestamps.last_rx_p2p ||
                                timestamps.last_p2p) as number
                            }
                          />
                        </p>
                      </div>
                    )}
                    {(timestamps.last_rx_super !== undefined ||
                      timestamps.last_super !== undefined) && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("stats.lastRXSuper")}
                        </p>
                        <p className="mt-1">
                          <TimeAgo
                            timestamp={
                              (timestamps.last_rx_super ||
                                timestamps.last_super) as number
                            }
                          />
                        </p>
                      </div>
                    )}
                    {timestamps.last_sweep && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("stats.lastSweep")}
                        </p>
                        <p className="mt-1">
                          <TimeAgo timestamp={timestamps.last_sweep} />
                        </p>
                      </div>
                    )}
                    {(timestamps.last_sn_fwd !== undefined ||
                      timestamps.last_fwd !== undefined) && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("stats.lastSNForward")}
                        </p>
                        <p className="mt-1">
                          <TimeAgo
                            timestamp={
                              (timestamps.last_sn_fwd ||
                                timestamps.last_fwd) as number
                            }
                          />
                        </p>
                      </div>
                    )}
                    {(timestamps.last_sn_reg !== undefined ||
                      timestamps.last_reg_super !== undefined) && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("stats.lastSNRegister")}
                        </p>
                        <p className="mt-1">
                          <TimeAgo
                            timestamp={
                              (timestamps.last_sn_reg ||
                                timestamps.last_reg_super) as number
                            }
                          />
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("stats.startTime")}
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
        <h2 className="mb-4 text-xl font-semibold">{t("stats.packetStats")}</h2>

        {/* 饼图部分 */}
        {!(daemonInfo?.is_supernode === 1) && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-medium">
              {t("stats.trafficDistribution")}
            </h3>
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
                            {t(`stats.${stat.type}`) || stat.type}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            {hasData ? (
                              <ChartContainer
                                config={
                                  {
                                    tx_pkt: {
                                      label: t("stats.packetsTX"),
                                      color: "var(--chart-1)",
                                    },
                                    rx_pkt: {
                                      label: t("stats.packetsRX"),
                                      color: "var(--chart-2)",
                                    },
                                  } satisfies ChartConfig
                                }
                                className="h-full max-h-62.5 w-full pb-0 [&_.recharts-pie-label-text]:fill-foreground"
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
                                  {t("stats.noPackets")}
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
        {cardStats.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-medium">
              {t("stats.otherStats")}
            </h3>
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
                          {t(`stats.${stat.type}`) || stat.type}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-row gap-2">
                          {stat.tx_pkt !== undefined && (
                            <Item>
                              <ItemTitle>{t("stats.packetsTX")}</ItemTitle>
                              <ItemDescription>{stat.tx_pkt}</ItemDescription>
                            </Item>
                          )}
                          {stat.rx_pkt !== undefined && (
                            <Item>
                              <ItemTitle>{t("stats.packetsRX")}</ItemTitle>
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
        )}
      </div>
    </div>
  )
}

export default StatsPage