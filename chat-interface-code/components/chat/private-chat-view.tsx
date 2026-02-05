"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { useApp } from "@/lib/app-context"
import { getRankColor } from "@/lib/types"
import { ArrowRight, Send, Lock } from "lucide-react"

export function PrivateChatView() {
  const {
    currentUser,
    users,
    selectedUserId,
    setCurrentView,
    privateMessages,
    sendPrivateMessage,
  } = useApp()

  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedUser = users.find((u) => u.id === selectedUserId)

  const chatMessages = privateMessages.filter(
    (m) =>
      (m.senderId === currentUser?.id && m.receiverId === selectedUserId) ||
      (m.senderId === selectedUserId && m.receiverId === currentUser?.id)
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSend = () => {
    if (!inputValue.trim() || !selectedUserId) return
    sendPrivateMessage(selectedUserId, inputValue.trim())
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!currentUser || currentUser.isGuest) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Lock className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>يجب تسجيل الدخول للمحادثات الخاصة</p>
        </div>
      </div>
    )
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">اختر مستخدم للمحادثة</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView("profile")}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <img
            src={selectedUser.avatar || "/placeholder.svg"}
            alt={selectedUser.username}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <h2
              className="font-bold"
              style={{ color: getRankColor(selectedUser.rank) }}
            >
              {selectedUser.username}
            </h2>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              رسالة خاصة
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>ابدأ المحادثة...</p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isOwn = msg.senderId === currentUser.id
            return (
              <div
                key={msg.id}
                className={`flex gap-3 message-animate ${isOwn ? "flex-row-reverse" : ""}`}
              >
                <div className={`max-w-[70%] ${isOwn ? "text-right" : "text-left"}`}>
                  <div
                    className={`px-4 py-2.5 rounded-[18px] ${
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4">
        <div className="bg-secondary rounded-full flex items-center gap-2 p-2">
          <div className="flex-1 px-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رسالة خاصة..."
              className="w-full bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none text-sm py-2"
              dir="rtl"
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5 -rotate-90" />
          </button>
        </div>
      </div>
    </div>
  )
}
