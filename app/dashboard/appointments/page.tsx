"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye, Calendar } from "lucide-react"
import { format, parseISO } from "date-fns"
import AppointmentForm from "@/components/AppointmentForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AppointmentsPage() {
  const { user } = useAuth()
  const { patients, incidents, deleteIncident } = useData()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  if (user?.role !== "Admin") {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const filteredAppointments = incidents
    .filter((appointment) => {
      const patient = patients.find((p) => p.id === appointment.patientId)
      const matchesSearch =
        appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient && patient.name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())

  const handleDeleteAppointment = (appointmentId: string) => {
    deleteIncident(appointmentId)
    toast({
      title: "Appointment deleted",
      description: "Appointment has been successfully removed.",
    })
  }

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600">Manage patient appointments and treatments</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <AppointmentForm
              onSuccess={() => {
                setIsFormOpen(false)
                toast({
                  title: "Appointment scheduled",
                  description: "New appointment has been successfully scheduled.",
                })
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search appointments by title, description, or patient name..."
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
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => {
          const patient = patients.find((p) => p.id === appointment.patientId)

          return (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{appointment.title}</h3>
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Patient:</strong> {patient?.name || "Unknown Patient"}
                      </p>
                      <p>
                        <strong>Description:</strong> {appointment.description}
                      </p>
                      {appointment.comments && (
                        <p>
                          <strong>Comments:</strong> {appointment.comments}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(parseISO(appointment.appointmentDate), "MMM dd, yyyy h:mm a")}
                        </p>
                        {appointment.cost && (
                          <p>
                            <strong>Cost:</strong> ${appointment.cost}
                          </p>
                        )}
                      </div>
                      {appointment.treatment && (
                        <p>
                          <strong>Treatment:</strong> {appointment.treatment}
                        </p>
                      )}
                      {appointment.nextDate && (
                        <p>
                          <strong>Next Appointment:</strong>{" "}
                          {format(parseISO(appointment.nextDate), "MMM dd, yyyy h:mm a")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Appointment Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Patient</p>
                              <p>{patient?.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Status</p>
                              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Date & Time</p>
                              <p>{format(parseISO(appointment.appointmentDate), "MMM dd, yyyy h:mm a")}</p>
                            </div>
                            {appointment.cost && (
                              <div>
                                <p className="text-sm font-medium text-gray-500">Cost</p>
                                <p>${appointment.cost}</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Title</p>
                            <p>{appointment.title}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Description</p>
                            <p>{appointment.description}</p>
                          </div>
                          {appointment.comments && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">Comments</p>
                              <p>{appointment.comments}</p>
                            </div>
                          )}
                          {appointment.treatment && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">Treatment</p>
                              <p>{appointment.treatment}</p>
                            </div>
                          )}
                          {appointment.files && appointment.files.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">Files</p>
                              <div className="space-y-1">
                                {appointment.files.map((file, index) => (
                                  <p key={index} className="text-sm text-blue-600">
                                    {file.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Edit Appointment</DialogTitle>
                        </DialogHeader>
                        <AppointmentForm
                          appointment={appointment}
                          onSuccess={() => {
                            toast({
                              title: "Appointment updated",
                              description: "Appointment has been successfully updated.",
                            })
                          }}
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this appointment? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "No appointments found matching your criteria."
                : "No appointments scheduled yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
