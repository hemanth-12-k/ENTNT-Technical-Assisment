"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Patient {
  id: string
  name: string
  dob: string
  contact: string
  email?: string
  healthInfo: string
  createdAt: string
}

export interface Incident {
  id: string
  patientId: string
  title: string
  description: string
  comments: string
  appointmentDate: string
  cost?: number
  treatment?: string
  status: "Scheduled" | "Completed" | "Cancelled" | "Pending"
  nextDate?: string
  files: { name: string; url: string; type: string }[]
  createdAt: string
}

interface DataContextType {
  patients: Patient[]
  incidents: Incident[]
  addPatient: (patient: Omit<Patient, "id" | "createdAt">) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void
  addIncident: (incident: Omit<Incident, "id" | "createdAt">) => void
  updateIncident: (id: string, incident: Partial<Incident>) => void
  deleteIncident: (id: string) => void
  getPatientIncidents: (patientId: string) => Incident[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const INITIAL_DATA = {
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "1234567890",
      email: "john@smilecare.pro",
      healthInfo: "No allergies",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "p2",
      name: "Jane Smith",
      dob: "1985-08-22",
      contact: "0987654321",
      email: "jane@smilecare.pro",
      healthInfo: "Allergic to penicillin",
      createdAt: "2024-02-01T14:30:00Z",
    },
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Routine Checkup",
      description: "Regular dental examination and cleaning",
      comments: "Patient has good oral hygiene",
      appointmentDate: "2025-01-15T10:00:00",
      cost: 120,
      treatment: "Dental cleaning and fluoride treatment",
      status: "Completed" as const,
      files: [],
      createdAt: "2024-12-01T10:00:00Z",
    },
    {
      id: "i2",
      patientId: "p1",
      title: "Tooth Filling",
      description: "Cavity treatment on upper molar",
      comments: "Small cavity detected during checkup",
      appointmentDate: "2025-01-20T14:00:00",
      status: "Scheduled" as const,
      files: [],
      createdAt: "2024-12-10T09:00:00Z",
    },
    {
      id: "i3",
      patientId: "p2",
      title: "Root Canal",
      description: "Root canal treatment for infected tooth",
      comments: "Patient experiencing severe pain",
      appointmentDate: "2025-01-18T11:00:00",
      cost: 800,
      treatment: "Root canal therapy",
      status: "Pending" as const,
      nextDate: "2025-02-01T11:00:00",
      files: [],
      createdAt: "2024-12-05T16:00:00Z",
    },
  ],
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    const savedPatients = localStorage.getItem("dental_patients")
    const savedIncidents = localStorage.getItem("dental_incidents")

    if (savedPatients) {
      setPatients(JSON.parse(savedPatients))
    } else {
      setPatients(INITIAL_DATA.patients)
      localStorage.setItem("dental_patients", JSON.stringify(INITIAL_DATA.patients))
    }

    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents))
    } else {
      setIncidents(INITIAL_DATA.incidents)
      localStorage.setItem("dental_incidents", JSON.stringify(INITIAL_DATA.incidents))
    }
  }, [])

  const savePatients = (newPatients: Patient[]) => {
    setPatients(newPatients)
    localStorage.setItem("dental_patients", JSON.stringify(newPatients))
  }

  const saveIncidents = (newIncidents: Incident[]) => {
    setIncidents(newIncidents)
    localStorage.setItem("dental_incidents", JSON.stringify(newIncidents))
  }

  const addPatient = (patient: Omit<Patient, "id" | "createdAt">) => {
    const newPatient: Patient = {
      ...patient,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    savePatients([...patients, newPatient])
  }

  const updatePatient = (id: string, updatedPatient: Partial<Patient>) => {
    const newPatients = patients.map((p) => (p.id === id ? { ...p, ...updatedPatient } : p))
    savePatients(newPatients)
  }

  const deletePatient = (id: string) => {
    const newPatients = patients.filter((p) => p.id !== id)
    const newIncidents = incidents.filter((i) => i.patientId !== id)
    savePatients(newPatients)
    saveIncidents(newIncidents)
  }

  const addIncident = (incident: Omit<Incident, "id" | "createdAt">) => {
    const newIncident: Incident = {
      ...incident,
      id: `i${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    saveIncidents([...incidents, newIncident])
  }

  const updateIncident = (id: string, updatedIncident: Partial<Incident>) => {
    const newIncidents = incidents.map((i) => (i.id === id ? { ...i, ...updatedIncident } : i))
    saveIncidents(newIncidents)
  }

  const deleteIncident = (id: string) => {
    const newIncidents = incidents.filter((i) => i.id !== id)
    saveIncidents(newIncidents)
  }

  const getPatientIncidents = (patientId: string) => {
    return incidents.filter((i) => i.patientId === patientId)
  }

  return (
    <DataContext.Provider
      value={{
        patients,
        incidents,
        addPatient,
        updatePatient,
        deletePatient,
        addIncident,
        updateIncident,
        deleteIncident,
        getPatientIncidents,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
