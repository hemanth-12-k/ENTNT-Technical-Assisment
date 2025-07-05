"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, DollarSign, FileText, Download, Calendar, Receipt } from "lucide-react"
import { format, parseISO } from "date-fns"

export default function MyBillingPage() {
  const { user } = useAuth()
  const { patients, incidents } = useData()

  if (user?.role !== "Patient") {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Access denied. Patient access required.</p>
      </div>
    )
  }

  const patient = patients.find((p) => p.id === user?.patientId)
  const patientBilling = incidents
    .filter((i) => i.patientId === user?.patientId && i.cost)
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())

  const totalPaid = patientBilling.filter((b) => b.status === "Completed").reduce((sum, b) => sum + (b.cost || 0), 0)

  const pendingPayments = patientBilling
    .filter((b) => b.status === "Pending")
    .reduce((sum, b) => sum + (b.cost || 0), 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Patient profile not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Billing</h1>
          <p className="text-gray-600">View your treatment costs and payment history</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Statement
        </Button>
      </div>

      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">Paid</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${totalPaid.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Paid</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${pendingPayments.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Outstanding Balance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">{patientBilling.length} total</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {patientBilling.filter((b) => b.status === "Completed").length}
              </p>
              <p className="text-sm text-gray-600">Paid Invoices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-600" />
            Payment History
          </CardTitle>
          <CardDescription>Your complete billing and payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientBilling.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No billing records found</p>
              </div>
            ) : (
              patientBilling.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{bill.title}</h3>
                      <p className="text-sm text-gray-600">{bill.description}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(parseISO(bill.appointmentDate), "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">${bill.cost}</p>
                      <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Your saved payment methods and billing preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-gray-600">Expires 12/25</p>
                </div>
              </div>
              <Badge variant="outline">Primary</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Auto-pay enabled</p>
                  <p className="text-sm text-gray-600">Payments processed automatically</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
