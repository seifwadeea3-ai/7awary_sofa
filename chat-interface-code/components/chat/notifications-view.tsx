"use client"

import { useApp } from "@/lib/app-context"
import {
  Bell,
  AtSign,
  Coins,
  LogIn,
  Gift,
  UserPlus,
  Trash2,
  Check,
} from "lucide-react"

export function NotificationsView() {
  const {
    notifications,
    markNotificationRead,
    clearNotifications,
    setSelectedUserId,
    setCurrentView,
  } = useApp()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="w-5 h-5 text-primary" />
      case "mention":
        return <AtSign className="w-5 h-5 text-blue-500" />
      case "coins":
        return <Coins className="w-5 h-5 text-yellow-500" />
      case "gift":
        return <Gift className="w-5 h-5 text-green-500" />
      case "friend_request":
        return <UserPlus className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "الآن"
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    if (hours < 24) return `منذ ${hours} ساعة`
    return `منذ ${days} يوم`
  }

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markNotificationRead(notification.id)
    
    // Navigate based on notification type
    if (notification.fromUserId && notification.type === "coins") {
      setSelectedUserId(notification.fromUserId)
      setCurrentView("profile")
    } else if (notification.groupId) {
      setCurrentView("chat")
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-foreground text-lg">الإشعارات</h2>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} إشعار غير مقروء`
                : "لا يوجد إشعارات جديدة"}
            </p>
          </div>
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearNotifications}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              title="حذف الكل"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Bell className="w-16 h-16 mb-4 opacity-20" />
            <p>لا يوجد إشعارات</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-right p-4 rounded-[18px] transition-all ${
                  notification.read
                    ? "bg-card"
                    : "bg-primary/5 border border-primary/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon or Avatar */}
                  {notification.fromAvatar ? (
                    <img
                      src={notification.fromAvatar || "/placeholder.svg"}
                      alt=""
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-foreground truncate">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    {notification.amount && (
                      <div className="flex items-center gap-1 mt-2 text-yellow-500">
                        <Coins className="w-4 h-4" />
                        <span className="font-bold">
                          +{notification.amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
