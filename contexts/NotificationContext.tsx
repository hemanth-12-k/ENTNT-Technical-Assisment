"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedNotifications = localStorage.getItem("dental_notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      // Add some initial notifications
      const initialNotifications: Notification[] = [
        {
          id: "1",
          title: "Welcome to Dental Center",
          message: "Your account has been set up successfully. Explore the dashboard to get started.",
          type: "success",
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: "2",
          title: "Appointment Reminder",
          message: "You have 3 appointments scheduled for this week. Check your calendar for details.",
          type: "info",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
        },
      ]
      setNotifications(initialNotifications)
      localStorage.setItem("dental_notifications", JSON.stringify(initialNotifications))
    }
  }, [])

  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications)
    localStorage.setItem("dental_notifications", JSON.stringify(newNotifications))
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    }

    const updatedNotifications = [newNotification, ...notifications]
    saveNotifications(updatedNotifications)

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "error" ? "destructive" : "default",
    })
  }

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    saveNotifications(updatedNotifications)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notif) => ({ ...notif, read: true }))
    saveNotifications(updatedNotifications)
  }

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter((notif) => notif.id !== id)
    saveNotifications(updatedNotifications)
  }

  const clearAllNotifications = () => {
    saveNotifications([])
  }

  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
