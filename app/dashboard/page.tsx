"use client"

import { useAuth } from "@/contexts/AuthContext"
import AdminDashboard from "@/components/AdminDashboard"
import PatientDashboard from "@/components/PatientDashboard"

export default function Dashboard() {
  const { user } = useAuth()

  if (user?.role === "Admin") {
    return <AdminDashboard />
  }

  return <PatientDashboard />
}
