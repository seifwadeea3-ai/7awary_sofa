"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { useApp } from "@/lib/app-context"
import { getRankColor } from "@/lib/types"
import { Send, Plus, ImageIcon, Smile, Hash, Volume2, VolumeX, Users } from "lucide-react"

export function ChatView() {
  const { currentUser, currentGroup, messages, sendMessage, globalMute, users, setSelectedUserId, setCurrentView } = useApp()
  const [inputValue, setInputValue] = useState("")
  const [showMentions, setShowMentions] = useState(false)
  const [mentionSearch, setMentionSearch] = useState("")
  const [showMembers, setShowMembers] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const groupMessages = messages.filter((m) => m.groupId === currentGroup?.id)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [groupMessages])

  const handleSend = () => {
    if (!inputValue.trim() || !currentGroup) return
    sendMessage(currentGroup.id, inputValue.trim())
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === "@") {
      setShowMentions(true)
      setMentionSearch("")
    }
    if (e.key === "Escape") {
      setShowMentions(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Check for mention trigger
    const lastAtIndex = value.lastIndexOf("@")
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowMentions(true)
      setMentionSearch("")
    } else if (lastAtIndex !== -1) {
      const searchText = value.slice(lastAtIndex + 1)
      if (!searchText.includes(" ")) {
        setShowMentions(true)
        setMentionSearch(searchText)
      } else {
        setShowMentions(false)
      }
    } else {
      setShowMentions(false)
    }
  }

  const insertMention = (username: string) => {
    const lastAtIndex = inputValue.lastIndexOf("@")
    const newValue = inputValue.slice(0, lastAtIndex) + `@${username} `
    setInputValue(newValue)
    setShowMentions(false)
    inputRef.current?.focus()
  }

  const filteredUsers = users.filter(
    (u) =>
      u.id !== currentUser?.id &&
      u.username.toLowerCase().includes(mentionSearch.toLowerCase())
  )

  const handleUserClick = (userId: string) => {
    if (userId !== currentUser?.id) {
      setSelectedUserId(userId)
      setCurrentView("profile")
    }
  }

  if (!currentGroup) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">اختر مجموعة للبدء</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-secondary border-2 border-primary/30">
            <img
              src={currentGroup.image || "/placeholder.svg"}
              alt={currentGroup.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-foreground flex items-center gap-2 text-lg">
              <Hash className="w-5 h-5 text-primary" />
              {currentGroup.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {currentGroup.members.length} عضو
            </p>
          </div>
          <div className="flex items-center gap-2">
            {globalMute ? (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-1.5 rounded-full">
                <VolumeX className="w-4 h-4" />
                <span>مغلقة</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-500 text-sm bg-green-500/10 px-3 py-1.5 rounded-full">
                <Volume2 className="w-4 h-4" />
                <span>مفتوحة</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowMembers(!showMembers)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                showMembers ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {groupMessages.length === 0 && (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <Hash className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>لا توجد رسائل بعد</p>
                <p className="text-sm">كن أول من يبدأ المحادثة!</p>
              </div>
            </div>
          )}
          {groupMessages.map((msg) => {
            const isOwn = msg.senderId === currentUser?.id
            return (
              <div
                key={msg.id}
                className={`flex gap-3 message-animate ${isOwn ? "flex-row-reverse" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => handleUserClick(msg.senderId)}
                  className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition-transform hover:scale-105"
                >
                  <img
                    src={msg.senderAvatar || "/placeholder.svg"}
                    alt={msg.senderName}
                    className="w-10 h-10 rounded-full border-2 border-transparent hover:border-primary transition-colors"
                  />
                </button>
                <div className={`max-w-[70%] ${isOwn ? "text-right" : "text-left"}`}>
                  {/* Sender name */}
                  <div
                    className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    {msg.isAdmin ? (
                      <button
                        type="button"
                        onClick={() => handleUserClick(msg.senderId)}
                        className="admin-name text-xs cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        {msg.senderName}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUserClick(msg.senderId)}
                        className="text-sm font-medium cursor-pointer hover:underline transition-all"
                        style={{ color: getRankColor(msg.senderRank) }}
                      >
                        {msg.senderName}
                      </button>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {/* Message bubble */}
                  <div
                    className={`px-4 py-2.5 rounded-[18px] ${
                      msg.isAnnouncement
                        ? "bg-primary/20 border border-primary text-foreground"
                        : isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <div className="w-64 bg-card border-r border-border overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                الاعضاء ({currentGroup.members.length})
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {currentGroup.members.map((member) => {
                const memberUser = users.find((u) => u.id === member.userId)
                if (!memberUser) return null
                return (
                  <button
                    key={member.userId}
                    type="button"
                    onClick={() => handleUserClick(member.userId)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-secondary rounded-[12px] transition-colors text-right"
                  >
                    <div className="relative">
                      <img
                        src={memberUser.avatar || "/placeholder.svg"}
                        alt={memberUser.username}
                        className="w-9 h-9 rounded-full"
                      />
                      <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {memberUser.isAdmin ? (
                        <span className="admin-name text-xs">{memberUser.username}</span>
                      ) : (
                        <span
                          className="text-sm font-medium block truncate"
                          style={{ color: getRankColor(memberUser.rank) }}
                        >
                          {memberUser.username}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {member.role === "owner" ? "مالك" : member.role === "admin" ? "مشرف" : member.role === "moderator" ? "مراقب" : "عضو"}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 relative">
        {/* Mention suggestions */}
        {showMentions && filteredUsers.length > 0 && (
          <div className="absolute bottom-full mb-2 right-4 left-4 bg-card border border-border rounded-[16px] p-2 shadow-lg max-h-48 overflow-y-auto">
            {filteredUsers.slice(0, 5).map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => insertMention(user.username)}
                className="w-full flex items-center gap-3 p-2 hover:bg-secondary rounded-[12px] transition-colors"
              >
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <span
                  className="font-medium"
                  style={{ color: getRankColor(user.rank) }}
                >
                  {user.username}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Capsule Input */}
        <div className="bg-secondary rounded-full flex items-center gap-2 p-2">
          <button
            type="button"
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>

          <div className="flex-1 flex items-center gap-2 px-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={globalMute ? "الدردشة مغلقة..." : "اكتب رسالة..."}
              disabled={globalMute && !currentUser?.isAdmin}
              className="flex-1 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none text-sm py-2"
              dir="rtl"
            />
            <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || (globalMute && !currentUser?.isAdmin)}
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5 -rotate-90" />
          </button>
        </div>
      </div>
    </div>
  )
}
