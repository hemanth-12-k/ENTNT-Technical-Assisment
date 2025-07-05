"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Download } from "lucide-react"
import { format, parseISO } from "date-fns"

export default function MyAppointmentsPage() {
  const { user } = useAuth()
  const { patients, incidents } = useData()

  if (user?.role !== "Patient") {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Access denied. Patient access required.</p>
      </div>
    )
  }

  const patient = patients.find((p) => p.id === user?.patientId)
  const patientIncidents = incidents
    .filter((i) => i.patientId === user?.patientId)
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())

  const upcomingAppointments = patientIncidents.filter((i) => i.status === "Scheduled" || i.status === "Pending")

  const pastAppointments = patientIncidents.filter((i) => i.status === "Completed" || i.status === "Cancelled")

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">View your dental appointments and treatment history</p>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Appointments
          </CardTitle>
          <CardDescription>Your scheduled and pending appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{appointment.title}</h3>
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">{appointment.description}</p>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(parseISO(appointment.appointmentDate), "EEEE, MMMM dd, yyyy 'at' h:mm a")}
                    </div>
                    {appointment.comments && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> {appointment.comments}
                        </p>
                      </div>
                    )}
                    {appointment.nextDate && (
                      <p className="text-sm text-gray-600">
                        <strong>Follow-up:</strong> {format(parseISO(appointment.nextDate), "MMM dd, yyyy 'at' h:mm a")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Treatment History
          </CardTitle>
          <CardDescription>Your completed and cancelled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {pastAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No treatment history</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{appointment.title}</h3>
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">{appointment.description}</p>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(parseISO(appointment.appointmentDate), "EEEE, MMMM dd, yyyy 'at' h:mm a")}
                    </div>

                    {appointment.treatment && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Treatment:</strong> {appointment.treatment}
                        </p>
                      </div>
                    )}

                    {appointment.cost && (
                      <p className="text-sm font-medium text-gray-700">
                        Cost: <span className="text-green-600">${appointment.cost}</span>
                      </p>
                    )}

                    {appointment.comments && (
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {appointment.comments}
                      </p>
                    )}

                    {appointment.files && appointment.files.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Attachments ({appointment.files.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {appointment.files.map((file, index) => (
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
