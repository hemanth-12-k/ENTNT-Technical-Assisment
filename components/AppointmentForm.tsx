"use client"

import type React from "react"

import { useState } from "react"
import { useData, type Incident } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

interface AppointmentFormProps {
  appointment?: Incident
  onSuccess?: () => void
}

export default function AppointmentForm({ appointment, onSuccess }: AppointmentFormProps) {
  const { patients, addIncident, updateIncident } = useData()
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || "",
    title: appointment?.title || "",
    description: appointment?.description || "",
    comments: appointment?.comments || "",
    appointmentDate: appointment?.appointmentDate
      ? new Date(appointment.appointmentDate).toISOString().slice(0, 16)
      : "",
    cost: appointment?.cost?.toString() || "",
    treatment: appointment?.treatment || "",
    status: appointment?.status || "Scheduled",
    nextDate: appointment?.nextDate ? new Date(appointment.nextDate).toISOString().slice(0, 16) : "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) {
      newErrors.patientId = "Please select a patient"
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required"
    }

    if (formData.cost && isNaN(Number(formData.cost))) {
      newErrors.cost = "Cost must be a valid number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const convertFilesToBase64 = async (files: File[]): Promise<{ name: string; url: string; type: string }[]> => {
    const filePromises = files.map((file) => {
      return new Promise<{ name: string; url: string; type: string }>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            name: file.name,
            url: reader.result as string,
            type: file.type,
          })
        }
        reader.readAsDataURL(file)
      })
    })

    return Promise.all(filePromises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const fileData = await convertFilesToBase64(files)

      const appointmentData = {
        ...formData,
        cost: formData.cost ? Number(formData.cost) : undefined,
        appointmentDate: new Date(formData.appointmentDate).toISOString(),
        nextDate: formData.nextDate ? new Date(formData.nextDate).toISOString() : undefined,
        files: [...(appointment?.files || []), ...fileData],
      }

      if (appointment) {
        updateIncident(appointment.id, appointmentData)
      } else {
        addIncident(appointmentData)
      }

      onSuccess?.()
    } catch (error) {
      console.error("Error saving appointment:", error)
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
              <Label htmlFor="patientId">Patient *</Label>
              <Select value={formData.patientId} onValueChange={(value) => handleChange("patientId", value)}>
                <SelectTrigger className={errors.patientId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.contact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.patientId && <p className="text-sm text-red-500">{errors.patientId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Routine Checkup, Root Canal"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Appointment Date & Time *</Label>
              <Input
                id="appointmentDate"
                type="datetime-local"
                value={formData.appointmentDate}
                onChange={(e) => handleChange("appointmentDate", e.target.value)}
                className={errors.appointmentDate ? "border-red-500" : ""}
              />
              {errors.appointmentDate && <p className="text-sm text-red-500">{errors.appointmentDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleChange("cost", e.target.value)}
                placeholder="0.00"
                className={errors.cost ? "border-red-500" : ""}
              />
              {errors.cost && <p className="text-sm text-red-500">{errors.cost}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextDate">Next Appointment Date</Label>
              <Input
                id="nextDate"
                type="datetime-local"
                value={formData.nextDate}
                onChange={(e) => handleChange("nextDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the treatment or procedure"
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment Details</Label>
            <Textarea
              id="treatment"
              value={formData.treatment}
              onChange={(e) => handleChange("treatment", e.target.value)}
              placeholder="Detailed treatment information"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
              placeholder="Additional notes or comments"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Upload Files</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label htmlFor="files" className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload files</p>
                <p className="text-xs text-gray-500">PDF, Images, Documents</p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Files:</p>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : appointment ? "Update Appointment" : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
