"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, DollarSign, FileText, Search, Download, Plus, Eye } from "lucide-react"
import { format, parseISO } from "date-fns"
import { useState } from "react"

export default function BillingPage() {
  const { user } = useAuth()
  const { patients, incidents } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  if (user?.role !== "Admin") {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  // Calculate billing data
  const totalRevenue = incidents
    .filter((i) => i.cost && i.status === "Completed")
    .reduce((sum, i) => sum + (i.cost || 0), 0)

  const pendingPayments = incidents
    .filter((i) => i.cost && i.status === "Pending")
    .reduce((sum, i) => sum + (i.cost || 0), 0)

  const billingRecords = incidents
    .filter((i) => i.cost)
    .map((incident) => {
      const patient = patients.find((p) => p.id === incident.patientId)
      return {
        ...incident,
        patientName: patient?.name || "Unknown",
        patientContact: patient?.contact || "",
      }
    })
    .filter((record) => {
      const matchesSearch =
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || record.status.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Manage invoices, payments, and financial records</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">5 pending</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${pendingPayments.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Pending Payments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">{incidents.filter((i) => i.cost).length} total</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {incidents.filter((i) => i.cost && i.status === "Completed").length}
              </p>
              <p className="text-sm text-gray-600">Paid Invoices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient name or treatment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Billing Records */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Billing Records</CardTitle>
          <CardDescription>All treatment invoices and payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No billing records found</p>
              </div>
            ) : (
              billingRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{record.title}</h3>
                      <p className="text-sm text-gray-600">{record.patientName}</p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(record.appointmentDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">${record.cost}</p>
                      <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Payment methods and transaction overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-600 mb-1">75%</div>
              <p className="text-sm text-blue-700">Card Payments</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-600 mb-1">20%</div>
              <p className="text-sm text-green-700">Cash Payments</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-600 mb-1">5%</div>
              <p className="text-sm text-purple-700">Insurance Claims</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
