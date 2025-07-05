"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LoginForm from "@/components/LoginForm"
import {
  Shield,
  Award,
  Clock,
  Heart,
  Star,
  CheckCircle,
  Phone,
  MapPin,
  Zap,
  Smile,
  Calendar,
  Users,
  Trophy,
  Crown,
  Diamond,
  Gem,
  Activity,
  TrendingUp,
} from "lucide-react"

// Enhanced 3D Dental Logo Component
const DentalLogo = ({ size = "w-20 h-20", animate = false }: { size?: string; animate?: boolean }) => (
  <div className={`${size} relative ${animate ? "animate-pulse" : ""}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-20 blur-xl"></div>
    <svg viewBox="0 0 120 120" className="w-full h-full relative z-10">
      {/* Outer Glow */}
      <defs>
        <radialGradient id="toothGlow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="50%" stopColor="rgba(16,185,129,0.3)" />
          <stop offset="100%" stopColor="rgba(6,182,212,0.1)" />
        </radialGradient>
        <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f0fdf4" />
          <stop offset="100%" stopColor="#ecfdf5" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
        </filter>
      </defs>

      {/* Main Tooth Shape with 3D effect */}
      <path
        d="M60 15 C42 15, 30 25, 30 42 C30 58, 35 75, 42 88 C48 98, 54 105, 60 105 C66 105, 72 98, 78 88 C85 75, 90 58, 90 42 C90 25, 78 15, 60 15 Z"
        fill="url(#toothGradient)"
        stroke="rgba(16, 185, 129, 0.4)"
        strokeWidth="2"
        filter="url(#shadow)"
      />

      {/* Inner highlight for 3D effect */}
      <ellipse cx="52" cy="35" rx="12" ry="18" fill="url(#toothGlow)" opacity="0.8" />

      {/* Medical Cross - Enhanced */}
      <g transform="translate(60,50)">
        <rect x="-3" y="-15" width="6" height="30" fill="#10b981" rx="3" />
        <rect x="-15" y="-3" width="30" height="6" fill="#10b981" rx="3" />
        <circle cx="0" cy="0" r="8" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.3" />
      </g>

      {/* Sparkle Effects - Enhanced */}
      <g opacity="0.8">
        <circle cx="35" cy="25" r="2.5" fill="white">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="85" cy="30" r="2" fill="white">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="55" r="1.5" fill="white">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="80" cy="65" r="2" fill="white">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Premium Badge */}
      <circle cx="85" cy="25" r="12" fill="#fbbf24" stroke="white" strokeWidth="2">
        <animate attributeName="r" values="12;13;12" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="85" y="29" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
        ★
      </text>
    </svg>
  </div>
)

// Floating Animation Component
const FloatingElement = ({
  children,
  delay = 0,
  duration = 3,
}: { children: React.ReactNode; delay?: number; duration?: number }) => (
  <div
    className="animate-bounce"
    style={{
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      animationIterationCount: "infinite",
    }}
  >
    {children}
  </div>
)

// Testimonial Component
const TestimonialCard = ({
  name,
  text,
  rating,
  delay,
}: { name: string; text: string; rating: number; delay: number }) => (
  <div
    className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fade-in"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex mb-3">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-white/90 text-sm mb-3 italic">"{text}"</p>
    <p className="text-emerald-100 font-semibold text-sm">- {name}</p>
  </div>
)

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "The most amazing dental experience I've ever had! The technology is incredible.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      text: "Pain-free treatment and beautiful results. Highly recommend SmileCare Pro!",
      rating: 5,
    },
    {
      name: "Emily Davis",
      text: "Professional, caring, and state-of-the-art facility. My smile has never looked better!",
      rating: 5,
    },
  ]

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center">
        <div className="text-center">
          <DentalLogo size="w-24 h-24" animate={true} />
          <div className="mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p className="text-white text-xl font-semibold">Loading SmileCare Pro...</p>
            <p className="text-emerald-100 text-sm mt-2">Preparing your premium dental experience</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Geometric Shapes */}
        <FloatingElement delay={0} duration={4}>
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-sm"></div>
        </FloatingElement>
        <FloatingElement delay={1} duration={3}>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full"></div>
        </FloatingElement>
        <FloatingElement delay={2} duration={5}>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-white/15 rounded-full"></div>
        </FloatingElement>
        <FloatingElement delay={0.5} duration={3.5}>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-white/8 rounded-full blur-sm"></div>
        </FloatingElement>

        {/* Animated Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-transparent to-teal-500/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>

        {/* Moving Light Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Mobile-First Layout */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="text-center pt-8 pb-6 px-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <DentalLogo size="w-24 h-24" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              SmileCare Pro
            </h1>
            <p className="text-emerald-100 text-lg font-semibold mb-4">Where Luxury Meets Dentistry</p>
            <div className="flex items-center justify-center mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-emerald-100 font-medium">4.9/5 • Award Winner</span>
            </div>

            {/* Mobile Premium Features */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-white">
                  <Smile className="w-4 h-4 mr-2 text-emerald-300" />
                  <span className="font-semibold">Hollywood Smiles</span>
                </div>
                <div className="flex items-center text-white">
                  <Zap className="w-4 h-4 mr-2 text-blue-300" />
                  <span className="font-semibold">Laser Precision</span>
                </div>
                <div className="flex items-center text-white">
                  <Heart className="w-4 h-4 mr-2 text-pink-300" />
                  <span className="font-semibold">Spa Dentistry</span>
                </div>
                <div className="flex items-center text-white">
                  <Calendar className="w-4 h-4 mr-2 text-orange-300" />
                  <span className="font-semibold">VIP Concierge</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-center space-x-4 text-white text-sm">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    <span className="font-semibold">(555) 123-SMILE</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1 text-emerald-300" />
                    <span className="font-semibold">24/7 Care</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Login Form */}
          <div className="px-6 pb-8">
            <LoginForm />
          </div>

          {/* Mobile Contact & Hours */}
          <div className="px-6 pb-8">
            <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="text-center text-white">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-emerald-300" />
                  <span className="text-sm font-semibold">123 Luxury Boulevard, Premium District</span>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 mr-2 text-blue-300" />
                  <span className="text-sm font-semibold">Mon-Fri 7AM-8PM • Sat 8AM-5PM</span>
                </div>
                <div className="flex items-center justify-center mb-3">
                  <Activity className="w-4 h-4 mr-2 text-purple-300" />
                  <span className="text-sm font-semibold">Emergency & VIP Services 24/7</span>
                </div>
                <div className="pt-3 border-t border-white/20">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-emerald-300" />
                      <span className="text-xs font-semibold">5,000+ Patients</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-blue-300" />
                      <span className="text-xs font-semibold">98% Satisfaction</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex min-h-screen">
          {/* Left Side - Enhanced Dental Center Showcase */}
          <div className="w-1/2 flex flex-col justify-center px-12 text-white">
            <div className="max-w-lg animate-fade-in">
              {/* Premium Brand Header */}
              <div className="flex items-center mb-10">
                <div className="relative">
                  <DentalLogo size="w-20 h-20" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
                    SmileCare Pro
                  </h1>
                  <p className="text-emerald-100 text-xl font-semibold mt-2">Where Luxury Meets Dentistry</p>
                  <div className="flex items-center mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-emerald-100 font-medium">4.9/5 • 5,000+ Transformed Smiles</span>
                  </div>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-emerald-100 text-sm">Award Winner 2024</span>
                    </div>
                    <div className="flex items-center">
                      <Diamond className="w-4 h-4 text-blue-300 mr-1" />
                      <span className="text-emerald-100 text-sm">Premium Care</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspiring Mission Statement */}
              <div className="mb-10">
                <h2 className="text-4xl font-bold mb-6 leading-tight">
                  Crafting{" "}
                  <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                    Perfect Smiles
                  </span>
                  <br />
                  <span className="text-2xl">With Artistry & Science</span>
                </h2>
                <p className="text-lg text-emerald-50 leading-relaxed mb-4">
                  Step into the future of dental excellence where every treatment is a masterpiece. Our revolutionary
                  approach combines cutting-edge technology with personalized luxury care.
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-300 mr-2" />
                    <span className="text-emerald-100 font-semibold">Pain-Free Guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <Gem className="w-5 h-5 text-purple-300 mr-2" />
                    <span className="text-emerald-100 font-semibold">Luxury Experience</span>
                  </div>
                </div>
              </div>

              {/* Premium Services Showcase */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Smile className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Hollywood Smiles</h3>
                  <p className="text-emerald-100 text-sm">Celebrity-level smile makeovers using advanced techniques</p>
                </div>

                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Laser Precision</h3>
                  <p className="text-emerald-100 text-sm">Revolutionary laser dentistry for painless treatments</p>
                </div>

                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Spa Dentistry</h3>
                  <p className="text-emerald-100 text-sm">Luxury spa-like environment with premium amenities</p>
                </div>

                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">VIP Concierge</h3>
                  <p className="text-emerald-100 text-sm">24/7 concierge service with same-day appointments</p>
                </div>
              </div>

              {/* Dynamic Testimonials */}
              <div className="mb-6">
                <TestimonialCard {...testimonials[currentTestimonial]} delay={0} />
              </div>

              {/* Awards & Recognition */}
              <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-yellow-400" />
                  World-Class Recognition
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                    <span className="font-semibold">Global Excellence Award 2024</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    <span className="font-semibold">Patient Choice #1</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="w-4 h-4 mr-2 text-purple-400" />
                    <span className="font-semibold">Luxury Dental Practice</span>
                  </div>
                  <div className="flex items-center">
                    <Gem className="w-4 h-4 mr-2 text-blue-400" />
                    <span className="font-semibold">Innovation Leader</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
