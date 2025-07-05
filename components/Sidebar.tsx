"use client"

import { useAuth } from "@/contexts/AuthContext"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Users,
  BarChart3,
  User,
  LogOut,
  Stethoscope,
  Settings,
  FileText,
  Activity,
  CreditCard,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const adminNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Analytics", href: "/dashboard/analytics", icon: Activity },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: "3" },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
]

const patientNavItems = [
  { name: "My Profile", href: "/dashboard", icon: User },
  { name: "My Appointments", href: "/dashboard/my-appointments", icon: Calendar },
  { name: "Treatment History", href: "/dashboard/treatment-history", icon: FileText },
  { name: "Billing", href: "/dashboard/my-billing", icon: CreditCard },
  { name: "Messages", href: "/dashboard/my-messages", icon: MessageSquare, badge: "1" },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navItems = user?.role === "Admin" ? adminNavItems : patientNavItems

  return (
    <div className="w-72 bg-gray-900 text-white h-screen flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">DentalCare Pro</h1>
            <p className="text-sm text-gray-400">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="bg-red-500 text-white text-xs px-2 py-1">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/dashboard/settings"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 mb-4 px-4 py-3 bg-gray-800 rounded-xl">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{user?.email}</p>
            <p className="text-sm text-gray-400">{user?.role}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
