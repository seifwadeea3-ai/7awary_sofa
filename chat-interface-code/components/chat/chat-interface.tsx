"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X } from "lucide-react"
import type { User } from "@/app/page"
import { ChatHeader } from "./chat-header"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { UserSidebar } from "./user-sidebar"
import { AdminDashboard } from "./admin-dashboard"

export interface Message {
  id: string
  username: string
  avatar: string
  content: string
  timestamp: Date
  isOwn: boolean
  isAdmin: boolean
}

interface ChatInterfaceProps {
  user: User
  onLogout: () => void
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    username: "أحمد",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
    content: "مرحبا بالجميع! 👋",
    timestamp: new Date(Date.now() - 300000),
    isOwn: false,
    isAdmin: false,
  },
  {
    id: "2",
    username: "سارة",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
    content: "أهلا أحمد، كيف حالك؟",
    timestamp: new Date(Date.now() - 240000),
    isOwn: false,
    isAdmin: false,
  },
  {
    id: "3",
    username: "محمد",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohamed",
    content: "الجو جميل اليوم ☀️",
    timestamp: new Date(Date.now() - 180000),
    isOwn: false,
    isAdmin: false,
  },
]

export function ChatInterface({ user, onLogout }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [onlineUsers] = useState(127)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      username: user.username,
      avatar: user.avatar,
      content,
      timestamp: new Date(),
      isOwn: true,
      isAdmin: user.isAdmin,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleBroadcast = (message: string) => {
    const broadcastMessage: Message = {
      id: Date.now().toString(),
      username: "📢 إعلان من الإدارة",
      avatar: user.avatar,
      content: message,
      timestamp: new Date(),
      isOwn: false,
      isAdmin: true,
    }
    setMessages((prev) => [...prev, broadcastMessage])
  }

  if (showAdminDashboard && user.isAdmin) {
    return (
      <AdminDashboard
        user={user}
        onClose={() => setShowAdminDashboard(false)}
        onBroadcast={handleBroadcast}
      />
    )
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 right-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <UserSidebar
          user={user}
          onlineUsers={onlineUsers}
          onLogout={onLogout}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ChatHeader
          onlineUsers={onlineUsers}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <ChatMessages messages={messages} currentUser={user.username} />
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={handleSendMessage} />
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg orange-glow"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  )
}
