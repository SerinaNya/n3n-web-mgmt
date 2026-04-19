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
import { toast } from "sonner"

type Community = {
  community: string
  purgeable: number
  is_federation: number
  ip4addr: string
}

// 获取 communities 数据的函数
async function fetchCommunitiesData(): Promise<Community[]> {
  const response = await fetch("/api/communities")
  if (!response.ok) {
    throw new Error("Failed to fetch communities")
  }
  const data = await response.json()
  // API 返回的是 { result: [...communities] } 格式
  return data.result || []
}

export function CommunitiesPage() {
  const {
    data: communities = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunitiesData,
  })

  // 监听错误状态，显示 toast 错误提示
  useEffect(() => {
    if (error) {
      toast.error("Failed to load communities data")
    }
  }, [error])

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Communities</h1>
        <Button onClick={() => refetch()} disabled={loading}>
          {loading ? "Fetching..." : "Refresh"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Community</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-center">Purgeable</TableHead>
              <TableHead className="text-center">Federation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? // 显示 skeleton 加载状态
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 rounded-full mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 rounded-full mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              : // 显示实际数据
                communities.map((community, index) => (
                  <TableRow key={index}>
                    <TableCell>{community.community}</TableCell>
                    <TableCell>{community.ip4addr}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={community.purgeable === 1 ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300"}>
                        {community.purgeable === 1 ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={community.is_federation === 1 ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300"}>
                        {community.is_federation === 1 ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default CommunitiesPage