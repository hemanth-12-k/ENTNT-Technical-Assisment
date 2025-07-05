"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, UserCheck, Stethoscope, Sparkles, Crown, Shield, Zap, Star } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    const success = login(email, password)
    if (!success) {
      setError("Invalid email or password")
    }
    setIsLoading(false)
  }

  const handleDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError("")
    // Remove auto-login - just populate credentials
  }

  const demoAccounts = [
    {
      role: "Premium Admin",
      email: "admin@smilecare.pro",
      password: "admin123",
      icon: Stethoscope,
      description: "Complete practice management",
      color: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
      textColor: "text-emerald-700",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      badge: Crown,
      badgeColor: "text-yellow-500",
    },
    {
      role: "VIP Patient",
      email: "john@smilecare.pro",
      password: "patient123",
      icon: User,
      description: "Premium patient portal",
      color: "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500",
      textColor: "text-blue-700",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      badge: Star,
      badgeColor: "text-blue-500",
    },
    {
      role: "Elite Patient",
      email: "jane@smilecare.pro",
      password: "patient123",
      icon: UserCheck,
      description: "Luxury patient access",
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500",
      textColor: "text-purple-700",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      badge: Shield,
      badgeColor: "text-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full blur-xl animate-bounce"></div>
      </div>

      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl relative overflow-hidden w-full max-w-md">
        {/* Premium Card Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-emerald-50/30 to-teal-50/30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-full blur-2xl"></div>

        <CardHeader className="text-center pb-6 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-3 h-3 text-white" />
              </div>
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-3xl border-2 border-emerald-300/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-3xl border border-teal-300/20 animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Welcome to Excellence
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg font-medium">
            Access your premium SmileCare Pro experience
          </CardDescription>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-sm text-gray-600 font-medium">Secure Login</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-gray-600 font-medium">Instant Access</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2 text-emerald-600" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your premium email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/90 text-base font-medium placeholder:text-gray-400 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold text-gray-700 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-600" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/90 text-base font-medium placeholder:text-gray-400 rounded-xl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="animate-fade-in border-red-200 bg-red-50">
                <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 transition-all duration-500 shadow-xl hover:shadow-emerald-500/25 rounded-xl relative overflow-hidden"
              disabled={isLoading}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Accessing Premium Portal...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Enter SmileCare Pro
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-bold tracking-wider">Premium Demo Access</span>
            </div>
          </div>

          <div className="space-y-3">
            {demoAccounts.map((account, index) => {
              const Icon = account.icon
              const Badge = account.badge
              return (
                <div
                  key={index}
                  className={`relative flex items-center justify-between p-4 ${account.bgColor} rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] overflow-hidden`}
                >
                  {/* Background gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>

                  <div className="flex items-center space-x-3 relative z-10">
                    <div
                      className={`w-12 h-12 ${account.color} rounded-xl flex items-center justify-center shadow-lg relative`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <Badge className={`w-2.5 h-2.5 ${account.badgeColor}`} />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-base ${account.textColor}`}>{account.role}</p>
                      <p className="text-sm text-gray-600 font-medium">{account.email}</p>
                      <p className="text-xs text-gray-500 font-medium">{account.description}</p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`border-2 ${account.textColor} hover:bg-white/90 font-bold transition-all duration-300 hover:scale-105 shadow-md rounded-lg px-4 relative z-10`}
                    onClick={() => handleDemoCredentials(account.email, account.password)}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Use
                  </Button>
                </div>
              )
            })}
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 leading-relaxed">
              By accessing SmileCare Pro, you agree to our{" "}
              <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">Terms of Service</span>{" "}
              and <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">Privacy Policy</span>
              <br />
              <span className="text-emerald-600 font-medium">
                🔒 Your data is protected with enterprise-grade security
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
