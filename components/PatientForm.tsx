"use client"

import type React from "react"

import { useState } from "react"
import { useData, type Patient } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface PatientFormProps {
  patient?: Patient
  onSuccess?: () => void
}

export default function PatientForm({ patient, onSuccess }: PatientFormProps) {
  const { addPatient, updatePatient } = useData()
  const [formData, setFormData] = useState({
    name: patient?.name || "",
    dob: patient?.dob || "",
    contact: patient?.contact || "",
    email: patient?.email || "",
    healthInfo: patient?.healthInfo || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required"
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required"
    } else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, ""))) {
      newErrors.contact = "Please enter a valid 10-digit phone number"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.healthInfo.trim()) {
      newErrors.healthInfo = "Health information is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (patient) {
        updatePatient(patient.id, formData)
      } else {
        addPatient(formData)
      }

      onSuccess?.()
    } catch (error) {
      console.error("Error saving patient:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                className={errors.dob ? "border-red-500" : ""}
              />
              {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                placeholder="Enter contact number"
                className={errors.contact ? "border-red-500" : ""}
              />
              {errors.contact && <p className="text-sm text-red-500">{errors.contact}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthInfo">Health Information *</Label>
            <Textarea
              id="healthInfo"
              value={formData.healthInfo}
              onChange={(e) => handleChange("healthInfo", e.target.value)}
              placeholder="Enter health information, allergies, medical conditions, etc."
              rows={3}
              className={errors.healthInfo ? "border-red-500" : ""}
            />
            {errors.healthInfo && <p className="text-sm text-red-500">{errors.healthInfo}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : patient ? "Update Patient" : "Add Patient"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
