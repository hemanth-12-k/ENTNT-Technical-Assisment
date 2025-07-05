"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, DollarSign, Download } from "lucide-react"
import { format, parseISO } from "date-fns"

export default function PatientDashboard() {
  const { user } = useAuth()
  const { patients, incidents } = useData()

  const patient = patients.find((p) => p.id === user?.patientId)
  const patientIncidents = incidents.filter((i) => i.patientId === user?.patientId)

  const upcomingAppointments = patientIncidents
    .filter((i) => i.status === "Scheduled" || i.status === "Pending")
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())

  const completedTreatments = patientIncidents.filter((i) => i.status === "Completed")
  const totalCost = completedTreatments.reduce((sum, i) => sum + (i.cost || 0), 0)

  const handleDownloadFile = (file: { name: string; url: string }) => {
    // In a real app, this would download the file
    // For demo purposes, we'll just show an alert
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {patient.name}</h1>
        <p className="text-gray-600">Here's your dental care overview</p>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-lg">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="text-lg">{format(parseISO(patient.dob), "MMM dd, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contact</p>
              <p className="text-lg">{patient.contact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg">{patient.email || "Not provided"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500">Health Information</p>
              <p className="text-lg">{patient.healthInfo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled treatments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Treatments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTreatments.length}</div>
            <p className="text-xs text-muted-foreground">Total treatments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost}</div>
            <p className="text-xs text-muted-foreground">Treatment expenses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled treatments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{appointment.title}</h3>
                      <Badge variant={appointment.status === "Scheduled" ? "default" : "secondary"}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(parseISO(appointment.appointmentDate), "MMM dd, yyyy h:mm a")}
                    </div>
                    {appointment.comments && (
                      <p className="text-sm text-gray-600 mt-2 italic">Note: {appointment.comments}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Treatment History */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment History</CardTitle>
            <CardDescription>Your completed treatments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {completedTreatments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No completed treatments</p>
              ) : (
                completedTreatments.map((treatment) => (
                  <div key={treatment.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{treatment.title}</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{treatment.description}</p>
                    {treatment.treatment && (
                      <p className="text-sm text-blue-600 mb-2">Treatment: {treatment.treatment}</p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{format(parseISO(treatment.appointmentDate), "MMM dd, yyyy")}</span>
                      {treatment.cost && <span className="font-medium">${treatment.cost}</span>}
                    </div>
                    {treatment.files && treatment.files.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                        <div className="space-y-1">
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
