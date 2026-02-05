"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Sidebar } from "./sidebar"
import { ChatView } from "./chat-view"
import { StoreView } from "./store-view"
import { ProfileView } from "./profile-view"
import { GroupsView } from "./groups-view"
import { NotificationsView } from "./notifications-view"
import { AdminDashboard } from "./admin-dashboard"
import { PrivateChatView } from "./private-chat-view"

export function ChatLayout() {
  const { currentView, currentUser } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderView = () => {
    switch (currentView) {
      case "store":
        return <StoreView />
      case "profile":
        return <ProfileView />
      case "groups":
        return <GroupsView />
      case "notifications":
        return <NotificationsView />
      case "admin":
        return currentUser?.isAdmin ? <AdminDashboard /> : <ChatView />
      case "private-chat":
        return currentUser?.isAdmin ? <PrivateChatView /> : <ChatView />
      default:
        return <ChatView />
    }
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
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {renderView()}
      </div>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg orange-glow"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  )
}
