"use client"

import type { Message } from "./chat-interface"

interface ChatMessagesProps {
  messages: Message[]
  currentUser: string
}

export function ChatMessages({ messages, currentUser }: ChatMessagesProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isOwn = message.username === currentUser
        const isAdminUser = message.username.toLowerCase() === "sofa"

        return (
          <div
            key={message.id}
            className={`flex gap-3 message-animate ${isOwn ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <img
              src={message.avatar || "/placeholder.svg"}
              alt={message.username}
              className={`w-10 h-10 rounded-full flex-shrink-0 ${
                isAdminUser ? "ring-2 ring-white ring-offset-2 ring-offset-background" : ""
              }`}
            />

            {/* Message Content */}
            <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
              {/* Username */}
              <div className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                {isAdminUser ? (
                  <span className="admin-name text-sm">
                    {message.username} 👑
                  </span>
                ) : (
                  <span className="text-sm font-medium text-foreground">
                    {message.username}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-[20px] px-5 py-3 ${
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-lg"
                    : message.isAdmin
                    ? "bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 text-foreground rounded-bl-lg"
                    : "bg-muted text-foreground rounded-bl-lg"
                }`}
              >
                <p className="text-[15px] leading-relaxed break-words">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
