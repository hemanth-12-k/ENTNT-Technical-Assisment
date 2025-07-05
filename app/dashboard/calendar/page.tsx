"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  parseISO,
  addMonths,
  subMonths,
} from "date-fns"

export default function CalendarPage() {
  const { user } = useAuth()
  const { patients, incidents } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  if (user?.role !== "Admin") {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getAppointmentsForDate = (date: Date) => {
    return incidents.filter((incident) => {
      const appointmentDate = parseISO(incident.appointmentDate)
      return isSameDay(appointmentDate, date) && (incident.status === "Scheduled" || incident.status === "Pending")
    })
  }

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
        <p className="text-gray-600">View and manage appointments by date</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day) => {
                  const dayAppointments = getAppointmentsForDate(day)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const isTodayDate = isToday(day)

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        p-2 min-h-[80px] border rounded-lg text-left hover:bg-gray-50 transition-colors
                        ${isSelected ? "bg-blue-50 border-blue-200" : "border-gray-200"}
                        ${isTodayDate ? "bg-blue-100 border-blue-300" : ""}
                      `}
                    >
                      <div className={`text-sm font-medium mb-1 ${isTodayDate ? "text-blue-700" : ""}`}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((appointment) => {
                          const patient = patients.find((p) => p.id === appointment.patientId)
                          return (
                            <div
                              key={appointment.id}
                              className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                            >
                              {format(parseISO(appointment.appointmentDate), "HH:mm")} - {patient?.name}
                            </div>
                          )
                        })}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayAppointments.length - 2} more</div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{selectedDate ? format(selectedDate, "MMMM dd, yyyy") : "Select a Date"}</CardTitle>
              <CardDescription>
                {selectedDate
                  ? `${selectedDateAppointments.length} appointment${selectedDateAppointments.length !== 1 ? "s" : ""}`
                  : "Click on a date to view appointments"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {selectedDateAppointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No appointments scheduled</p>
                  ) : (
                    selectedDateAppointments
                      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                      .map((appointment) => {
                        const patient = patients.find((p) => p.id === appointment.patientId)
                        return (
                          <div key={appointment.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{appointment.title}</h3>
                              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                <strong>Patient:</strong> {patient?.name}
                              </p>
                              <p>
                                <strong>Time:</strong> {format(parseISO(appointment.appointmentDate), "h:mm a")}
                              </p>
                              <p>
                                <strong>Description:</strong> {appointment.description}
                              </p>
                              {appointment.comments && (
                                <p>
                                  <strong>Notes:</strong> {appointment.comments}
                                </p>
                              )}
                              {appointment.cost && (
                                <p>
                                  <strong>Cost:</strong> ${appointment.cost}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a date to view appointments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
