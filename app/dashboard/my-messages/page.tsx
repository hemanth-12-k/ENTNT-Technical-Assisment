"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Send, Search, Plus } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

interface Message {
  id: string
  from: string
  to: string
  subject: string
  content: string
  timestamp: string
  read: boolean
  type: "sent" | "received"
}

export default function MyMessagesPage() {
  const { user } = useAuth()
  const [messages] = useState<Message[]>([
    {
      id: "1",
      from: "Dr. Smith",
      to: user?.email || "",
      subject: "Appointment Reminder",
      content:
        "Hi! This is a reminder about your upcoming appointment on January 20th at 2:00 PM. Please arrive 15 minutes early for check-in.",
      timestamp: new Date().toISOString(),
      read: false,
      type: "received",
    },
    {
      id: "2",
      from: user?.email || "",
      to: "Dr. Smith",
      subject: "Question about Treatment",
      content: "Hi Doctor, I have some questions about my recent root canal treatment. Could we schedule a follow-up?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      type: "sent",
    },
    {
      id: "3",
      from: "Dr. Smith",
      to: user?.email || "",
      subject: "Re: Question about Treatment",
      content:
        "Of course! I'll have my assistant schedule a follow-up appointment for you. Please call the office at your convenience.",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
      type: "received",
    },
  ])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [newMessage, setNewMessage] = useState({ subject: "", content: "" })
  const [searchTerm, setSearchTerm] = useState("")

  if (user?.role !== "Patient") {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Access denied. Patient access required.</p>
      </div>
    )
  }

  const filteredMessages = messages.filter(
    (message) =>
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const unreadCount = messages.filter((m) => !m.read && m.type === "received").length

  const handleSendMessage = () => {
    if (!newMessage.subject || !newMessage.content) return
    alert("Message sent to your dental practice!")
    setNewMessage({ subject: "", content: "" })
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Messages</h1>
          <p className="text-gray-600">Communicate with your dental practice</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">{unreadCount} unread</Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${
                      selectedMessage?.id === message.id ? "bg-blue-50 border-blue-200" : ""
                    } ${!message.read && message.type === "received" ? "bg-blue-25" : ""}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-emerald-100 text-emerald-600">
                          {message.from.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm text-gray-900 truncate">{message.from}</p>
                          {!message.read && message.type === "received" && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="font-medium text-sm text-gray-900 truncate mb-1">{message.subject}</p>
                        <p className="text-xs text-gray-500 truncate">{message.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(message.timestamp), "MMM dd, h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Content & Compose */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Message */}
          {selectedMessage ? (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-emerald-100 text-emerald-600">
                        {selectedMessage.from.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                      <CardDescription>
                        From: {selectedMessage.from} •{" "}
                        {format(new Date(selectedMessage.timestamp), "MMM dd, yyyy h:mm a")}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={selectedMessage.type === "sent" ? "default" : "secondary"}>
                    {selectedMessage.type === "sent" ? "Sent" : "Received"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{selectedMessage.content}</p>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Button className="mr-2">Reply</Button>
                  <Button variant="outline">Forward</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a message to view its content</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compose New Message */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600" />
                Send Message to Practice
              </CardTitle>
              <CardDescription>Contact your dental practice with questions or concerns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                <Input
                  placeholder="Enter message subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  rows={6}
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Save Draft</Button>
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
