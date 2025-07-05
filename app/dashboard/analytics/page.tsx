"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Activity, Download, RefreshCw } from "lucide-react"
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns"
import { useState } from "react"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { patients, incidents } = useData()
  const [timeRange, setTimeRange] = useState("6months")

  if (user?.role !== "Admin") {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  // Calculate analytics data
  const totalRevenue = incidents
    .filter((i) => i.cost && i.status === "Completed")
    .reduce((sum, i) => sum + (i.cost || 0), 0)

  const completedTreatments = incidents.filter((i) => i.status === "Completed").length
  const averageRevenue = completedTreatments > 0 ? totalRevenue / completedTreatments : 0

  // Monthly data for charts
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  })

  const monthlyData = last6Months.map((month) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    const monthIncidents = incidents.filter((i) => {
      const date = parseISO(i.appointmentDate)
      return date >= monthStart && date <= monthEnd
    })

    const revenue = monthIncidents
      .filter((i) => i.cost && i.status === "Completed")
      .reduce((sum, i) => sum + (i.cost || 0), 0)

    return {
      month: format(month, "MMM yyyy"),
      appointments: monthIncidents.length,
      revenue,
      completed: monthIncidents.filter((i) => i.status === "Completed").length,
    }
  })

  // Treatment type analysis
  const treatmentTypes = incidents.reduce(
    (acc, incident) => {
      const type = incident.title
      if (!acc[type]) {
        acc[type] = { count: 0, revenue: 0 }
      }
      acc[type].count++
      if (incident.cost && incident.status === "Completed") {
        acc[type].revenue += incident.cost
      }
      return acc
    },
    {} as Record<string, { count: number; revenue: number }>,
  )

  const topTreatments = Object.entries(treatmentTypes)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 5)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Practice Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your dental practice performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">+12%</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">+8%</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              <p className="text-sm text-gray-600">Active Patients</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700">+15%</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedTreatments}</p>
              <p className="text-sm text-gray-600">Completed Treatments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700">+5%</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${averageRevenue.toFixed(0)}</p>
              <p className="text-sm text-gray-600">Avg. Treatment Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium">{data.month}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${data.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{data.completed} treatments</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Treatments */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Top Treatments
            </CardTitle>
            <CardDescription>Most profitable treatment types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTreatments.map(([treatment, data], index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{treatment}</p>
                    <p className="text-sm text-gray-600">{data.count} procedures</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">${data.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">${(data.revenue / data.count).toFixed(0)} avg</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Demographics */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Patient Demographics & Insights</CardTitle>
          <CardDescription>Understanding your patient base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">68%</div>
              <p className="text-sm text-blue-700">Patient Retention Rate</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">4.8</div>
              <p className="text-sm text-green-700">Average Rating</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">24</div>
              <p className="text-sm text-purple-700">Avg. Days Between Visits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
