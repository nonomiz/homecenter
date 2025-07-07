"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Clock, CheckCircle } from "lucide-react"

interface StoreStats {
  totalReservations: number
  todayReservations: number
  pendingReservations: number
  completedReservations: number
}

export default function StoreDashboardPage() {
  const [stats, setStats] = useState<StoreStats>({
    totalReservations: 0,
    todayReservations: 0,
    pendingReservations: 0,
    completedReservations: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      // try {
      //   const token = sessionStorage.getItem("storeToken")
      //   const response = await fetch("/api/store/stats", {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   })
      //   if (response.ok) {
      //     const data = await response.json()
      //     setStats(data)
      //   }
      // } catch (error) {
      //   console.error("Failed to fetch store stats:", error)
      // }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総予約数
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              本日の予約
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayReservations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              保留中の予約
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReservations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              完了した予約
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedReservations}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 