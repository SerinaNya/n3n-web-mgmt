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
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"
import { TimeAgo } from "@/components/TimeAgo"
import { Duration } from "luxon"
import { useTranslation } from "react-i18next"

type Supernode = {
  version: string
  purgeable: number
  current: number
  macaddr: string
  sockaddr: string
  selection: string
  last_seen: number
  uptime: number
}

// 获取 supernodes 数据的函数
async function fetchSupernodesData(): Promise<Supernode[]> {
  const response = await fetch("/api/supernodes")
  if (!response.ok) {
    throw new Error("Failed to fetch supernodes")
  }
  const data = await response.json()
  // API 返回的是 { result: [...supernodes] } 格式
  return data.result || []
}

export function SupernodesPage() {
  const { t } = useTranslation()
  
  const {
    data: supernodes = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["supernodes"],
    queryFn: fetchSupernodesData,
  })

  // 监听错误状态，显示 toast 错误提示
  useEffect(() => {
    if (error) {
      toast.error(t("errors.loadSupernodes"))
    }
  }, [error, t])

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("supernodes.title")} <span className="text-sm text-muted-foreground">({supernodes.length})</span></h1>
        <Button onClick={() => refetch()} disabled={loading}>
          {loading ? t("common.fetching") : t("common.refresh")}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-20">{t("supernodes.status")}</TableHead>
              <TableHead>{t("supernodes.macAddress")}</TableHead>
              <TableHead>{t("supernodes.socketAddress")}</TableHead>
              <TableHead>{t("supernodes.selection")}</TableHead>
              <TableHead>{t("supernodes.lastSeen")}</TableHead>
              <TableHead className="text-right w-20">{t("supernodes.properties")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? // 显示 skeleton 加载状态
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      <Skeleton className="mx-auto h-4 w-8 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-4 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              : // 显示实际数据
                supernodes.map((supernode, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {supernode.current === 1 && (
                        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                          {t("supernodes.active")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{supernode.macaddr}</TableCell>
                    <TableCell>{supernode.sockaddr}</TableCell>
                    <TableCell>{supernode.selection}</TableCell>
                    <TableCell>
                      <TimeAgo timestamp={supernode.last_seen} />
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
                            <span className="sr-only">
                              {t("supernodes.viewDetails")}
                            </span>
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="sm:max-w-125">
                          <DrawerHeader>
                            <DrawerTitle>{t("supernodes.supernodeProperties")}</DrawerTitle>
                            <DrawerDescription>
                              {t("supernodes.allProperties")}
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="no-scrollbar space-y-4 overflow-y-auto">
                            <div className="mt-2 space-y-4 px-4">
                              <Card>
                                <CardContent>
                                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {t("supernodes.version")}
                                      </p>
                                      <p className="mt-1">
                                        {supernode.version}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {t("supernodes.current")}
                                      </p>
                                      <p className="mt-1">
                                        {supernode.current === 1 ? t("supernodes.yes") : t("supernodes.no")}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {t("supernodes.purgeable")}
                                      </p>
                                      <p className="mt-1">
                                        {supernode.purgeable === 1
                                          ? t("supernodes.yes")
                                          : t("supernodes.no")}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {t("supernodes.macAddress")}
                                      </p>
                                      <p className="mt-1">
                                        {supernode.macaddr}
                                      </p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {t("supernodes.socketAddress")}
                                      </p>
                                      <p className="mt-1">
                                        {supernode.sockaddr}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {t("supernodes.selection")}
                                      </p>
                                      <p className="mt-1">
                                        {supernode.selection}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {t("supernodes.lastSeen")}
                                      </p>
                                      <p className="mt-1">
                                        <TimeAgo
                                          timestamp={supernode.last_seen}
                                        />
                                      </p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {t("supernodes.uptime")}
                                      </p>
                                      <p className="mt-1">
                                        {Duration.fromMillis(
                                          supernode.uptime * 1000
                                        )
                                          .normalize()
                                          .shiftTo(
                                            "years",
                                            "months",
                                            "days",
                                            "hours",
                                            "minutes",
                                            "seconds"
                                          )
                                          .toHuman()}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                            <pre className="overflow-auto rounded-md bg-muted p-4 text-sm">
                              {JSON.stringify(supernode, null, 2)}
                            </pre>
                          </div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">{t("common.close")}</Button>
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

export default SupernodesPage