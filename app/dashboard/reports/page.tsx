"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Calendar, Users, DollarSign, TrendingUp, Printer } from "lucide-react"
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { useState } from "react"

export default function ReportsPage() {
  const { user } = useAuth()
  const { patients, incidents } = useData()
  const [reportType, setReportType] = useState("financial")
  const [timeRange, setTimeRange] = useState("thisMonth")

  if (user?.role !== "Admin") {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  // Calculate report data based on time range
  const getDateRange = () => {
    const now = new Date()
    switch (timeRange) {
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfMonth(now) }
      case "lastMonth":
        return { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) }
      case "last3Months":
        return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now) }
      case "last6Months":
        return { start: startOfMonth(subMonths(now, 5)), end: endOfMonth(now) }
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) }
    }
  }

  const { start, end } = getDateRange()
  const filteredIncidents = incidents.filter((i) => {
    const date = parseISO(i.appointmentDate)
    return date >= start && date <= end
  })

  const reportData = {
    totalAppointments: filteredIncidents.length,
    completedAppointments: filteredIncidents.filter((i) => i.status === "Completed").length,
    totalRevenue: filteredIncidents
      .filter((i) => i.cost && i.status === "Completed")
      .reduce((sum, i) => sum + (i.cost || 0), 0),
    newPatients: patients.filter((p) => {
      const date = parseISO(p.createdAt)
      return date >= start && date <= end
    }).length,
  }

  const reportTypes = [
    { value: "financial", label: "Financial Report", icon: DollarSign },
    { value: "patient", label: "Patient Report", icon: Users },
    { value: "appointment", label: "Appointment Report", icon: Calendar },
    { value: "treatment", label: "Treatment Report", icon: FileText },
  ]

  const timeRanges = [
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "last3Months", label: "Last 3 Months" },
    { value: "last6Months", label: "Last 6 Months" },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive reports for your dental practice</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalAppointments}</p>
              <p className="text-sm text-gray-600">Total Appointments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.completedAppointments}</p>
              <p className="text-sm text-gray-600">Completed Treatments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${reportData.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.newPatients}</p>
              <p className="text-sm text-gray-600">New Patients</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {reportTypes.find((t) => t.value === reportType)?.label} - {format(start, "MMM dd")} to{" "}
            {format(end, "MMM dd, yyyy")}
          </CardTitle>
          <CardDescription>Detailed breakdown of your practice performance</CardDescription>
        </CardHeader>
        <CardContent>
          {reportType === "financial" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-xl">
                  <h3 className="font-semibold text-green-800 mb-4">Revenue Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">Completed Treatments</span>
                      <span className="font-semibold text-green-800">${reportData.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Average per Treatment</span>
                      <span className="font-semibold text-green-800">
                        $
                        {reportData.completedAppointments > 0
                          ? (reportData.totalRevenue / reportData.completedAppointments).toFixed(0)
                          : "0"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h3 className="font-semibold text-blue-800 mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Credit Card</span>
                      <span className="font-semibold text-blue-800">75%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Cash</span>
                      <span className="font-semibold text-blue-800">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Insurance</span>
                      <span className="font-semibold text-blue-800">5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === "patient" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{patients.length}</div>
                  <p className="text-sm text-blue-700">Total Active Patients</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">{reportData.newPatients}</div>
                  <p className="text-sm text-green-700">New Patients This Period</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
                  <p className="text-sm text-purple-700">Patient Retention Rate</p>
                </div>
              </div>
            </div>
          )}

          {reportType === "appointment" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4">Appointment Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Completed</span>
                      <span className="font-semibold text-green-600">{reportData.completedAppointments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Scheduled</span>
                      <span className="font-semibold text-blue-600">
                        {filteredIncidents.filter((i) => i.status === "Scheduled").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Cancelled</span>
                      <span className="font-semibold text-red-600">
                        {filteredIncidents.filter((i) => i.status === "Cancelled").length}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Completion Rate</span>
                      <span className="font-semibold text-green-600">
                        {reportData.totalAppointments > 0
                          ? Math.round((reportData.completedAppointments / reportData.totalAppointments) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Average Duration</span>
                      <span className="font-semibold text-blue-600">45 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
