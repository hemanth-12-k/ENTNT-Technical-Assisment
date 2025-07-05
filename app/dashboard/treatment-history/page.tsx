"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Download, Calendar, DollarSign, Eye } from "lucide-react"
import { format, parseISO } from "date-fns"
import { useState } from "react"

export default function TreatmentHistoryPage() {
  const { user } = useAuth()
  const { patients, incidents } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  if (user?.role !== "Patient") {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Access denied. Patient access required.</p>
      </div>
    )
  }

  const patient = patients.find((p) => p.id === user?.patientId)
  const patientTreatments = incidents
    .filter((i) => i.patientId === user?.patientId)
    .filter((treatment) => {
      const matchesSearch =
        treatment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treatment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (treatment.treatment && treatment.treatment.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === "all" || treatment.status.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())

  const totalTreatments = patientTreatments.length
  const completedTreatments = patientTreatments.filter((t) => t.status === "Completed").length
  const totalCost = patientTreatments
    .filter((t) => t.cost && t.status === "Completed")
    .reduce((sum, t) => sum + (t.cost || 0), 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDownloadFile = (file: { name: string; url: string }) => {
    alert(`Downloading ${file.name}`)
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Patient profile not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Treatment History</h1>
          <p className="text-gray-600">Complete record of your dental treatments and procedures</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalTreatments}</p>
              <p className="text-sm text-gray-600">Total Treatments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedTreatments}</p>
              <p className="text-sm text-gray-600">Completed</p>
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
              <p className="text-2xl font-bold text-gray-900">${totalCost.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Investment</p>
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
                placeholder="Search treatments by name, description, or procedure..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Treatment History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Your Treatment Records</CardTitle>
          <CardDescription>Detailed history of all your dental treatments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {patientTreatments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No treatment history found</p>
              </div>
            ) : (
              patientTreatments.map((treatment) => (
                <div key={treatment.id} className="border rounded-xl p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{treatment.title}</h3>
                      <Badge className={getStatusColor(treatment.status)}>{treatment.status}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {format(parseISO(treatment.appointmentDate), "MMMM dd, yyyy")}
                      </p>
                      {treatment.cost && <p className="text-lg font-semibold text-emerald-600">${treatment.cost}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                      <p className="text-gray-600">{treatment.description}</p>
                    </div>

                    {treatment.treatment && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Treatment Details</h4>
                        <p className="text-gray-600">{treatment.treatment}</p>
                      </div>
                    )}

                    {treatment.comments && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Doctor's Notes</h4>
                        <p className="text-gray-600 italic">{treatment.comments}</p>
                      </div>
                    )}

                    {treatment.nextDate && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Follow-up Appointment</h4>
                        <p className="text-blue-600">
                          {format(parseISO(treatment.nextDate), "MMMM dd, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    )}

                    {treatment.files && treatment.files.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Attachments</h4>
                        <div className="flex flex-wrap gap-2">
                          {treatment.files.map((file, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadFile(file)}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {file.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Appointment: {format(parseISO(treatment.appointmentDate), "h:mm a")}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
