"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { format, parseISO } from "date-fns"
import PatientForm from "@/components/PatientForm"
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

export default function PatientsPage() {
  const { user } = useAuth()
  const { patients, deletePatient, getPatientIncidents } = useData()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  if (user?.role !== "Admin") {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact.includes(searchTerm) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDeletePatient = (patientId: string) => {
    deletePatient(patientId)
    toast({
      title: "Patient deleted",
      description: "Patient and all associated appointments have been removed.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Manage your dental practice patients</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <PatientForm
              onSuccess={() => {
                setIsFormOpen(false)
                toast({
                  title: "Patient added",
                  description: "New patient has been successfully added.",
                })
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients by name, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const patientIncidents = getPatientIncidents(patient.id)
          const upcomingAppointments = patientIncidents.filter(
            (i) => i.status === "Scheduled" || i.status === "Pending",
          ).length

          return (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>Born: {format(parseISO(patient.dob), "MMM dd, yyyy")}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Patient Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Full Name</p>
                              <p>{patient.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                              <p>{format(parseISO(patient.dob), "MMM dd, yyyy")}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Contact</p>
                              <p>{patient.contact}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Email</p>
                              <p>{patient.email || "Not provided"}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Health Information</p>
                            <p>{patient.healthInfo}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                            <p>{patientIncidents.length}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Patient</DialogTitle>
                        </DialogHeader>
                        <PatientForm
                          patient={patient}
                          onSuccess={() => {
                            toast({
                              title: "Patient updated",
                              description: "Patient information has been successfully updated.",
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
                          <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {patient.name}? This will also delete all associated
                            appointments and cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePatient(patient.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Contact:</span>
                    <span>{patient.contact}</span>
                  </div>
                  {patient.email && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Email:</span>
                      <span className="truncate ml-2">{patient.email}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Appointments:</span>
                    <Badge variant="outline">{patientIncidents.length}</Badge>
                  </div>
                  {upcomingAppointments > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Upcoming:</span>
                      <Badge>{upcomingAppointments}</Badge>
                    </div>
                  )}
                  <div className="pt-2">
                    <p className="text-xs text-gray-500">Health Info:</p>
                    <p className="text-sm truncate">{patient.healthInfo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? "No patients found matching your search." : "No patients added yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
