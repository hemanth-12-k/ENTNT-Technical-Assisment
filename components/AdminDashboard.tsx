"use client"

import { useData } from "@/contexts/DataContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, DollarSign, Clock, TrendingUp, Activity, CheckCircle, Plus, ArrowRight } from "lucide-react"
import { format, isToday, isTomorrow, parseISO } from "date-fns"

export default function AdminDashboard() {
  const { patients, incidents } = useData()
  const { addNotification } = useNotifications()

  // Calculate KPIs
  const totalPatients = patients.length
  const totalAppointments = incidents.length
  const completedAppointments = incidents.filter((i) => i.status === "Completed").length
  const pendingAppointments = incidents.filter((i) => i.status === "Pending").length
  const totalRevenue = incidents
    .filter((i) => i.cost && i.status === "Completed")
    .reduce((sum, i) => sum + (i.cost || 0), 0)

  // Get upcoming appointments (next 10)
  const upcomingAppointments = incidents
    .filter((i) => i.status === "Scheduled" || i.status === "Pending")
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 10)

  // Get top patients (by number of appointments)
  const patientAppointmentCounts = patients
    .map((patient) => ({
      ...patient,
      appointmentCount: incidents.filter((i) => i.patientId === patient.id).length,
    }))
    .sort((a, b) => b.appointmentCount - a.appointmentCount)
    .slice(0, 5)

  const getAppointmentDateLabel = (dateString: string) => {
    const date = parseISO(dateString)
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "MMM dd, yyyy")
  }

  // Add sample notifications on component mount

  const kpiCards = [
    {
      title: "Total Patients",
      value: totalPatients,
      subtitle: "Active patients",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "This Month Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      subtitle: "From completed treatments",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Appointments Today",
      value: upcomingAppointments.filter((apt) => isToday(parseISO(apt.appointmentDate))).length,
      subtitle: "Scheduled for today",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+3",
      changeType: "neutral",
    },
    {
      title: "Pending Treatments",
      value: pendingAppointments,
      subtitle: "Awaiting completion",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "-2",
      changeType: "positive",
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Doctor! 👋</h1>
            <p className="text-emerald-100 text-lg">Here's what's happening at your practice today</p>
          </div>
          <div className="hidden md:block">
            <Button
              variant="secondary"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              onClick={() =>
                addNotification({
                  title: "Quick Action Completed",
                  message: "You've successfully triggered a test notification!",
                  type: "success",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Action
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="card-hover border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${kpi.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${
                      kpi.changeType === "positive"
                        ? "bg-green-100 text-green-700"
                        : kpi.changeType === "negative"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                  <p className="text-sm text-gray-600">{kpi.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Next appointments scheduled</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => (window.location.href = "/dashboard/appointments")}>
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming appointments</p>
                </div>
              ) : (
                upcomingAppointments.slice(0, 5).map((appointment) => {
                  const patient = patients.find((p) => p.id === appointment.patientId)
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient?.name}</p>
                          <p className="text-sm text-gray-600">{appointment.title}</p>
                          <p className="text-xs text-gray-500">
                            {getAppointmentDateLabel(appointment.appointmentDate)} at{" "}
                            {format(parseISO(appointment.appointmentDate), "h:mm a")}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={appointment.status === "Scheduled" ? "default" : "secondary"}
                        className={appointment.status === "Scheduled" ? "bg-emerald-100 text-emerald-700" : ""}
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Practice Analytics */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Practice Analytics
            </CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{completedAppointments}</div>
                  <p className="text-sm text-green-700">Completed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {incidents.filter((i) => i.status === "Scheduled").length}
                  </div>
                  <p className="text-sm text-blue-700">Scheduled</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Patient Satisfaction</span>
                  <span className="text-sm font-bold text-emerald-600">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "98%" }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Monthly Growth</span>
                  <span className="text-sm font-bold text-blue-600">+15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 hover:bg-emerald-50 hover:border-emerald-200 bg-transparent"
              onClick={() => (window.location.href = "/dashboard/patients")}
            >
              <Users className="h-6 w-6 text-emerald-600" />
              <span>Add New Patient</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-200 bg-transparent"
              onClick={() => (window.location.href = "/dashboard/appointments")}
            >
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Schedule Appointment</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200 bg-transparent"
              onClick={() => (window.location.href = "/dashboard/reports")}
            >
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
