"use client"

import React from "react"

import { useState, useRef } from "react"
import { Plus, Send, Smile, ImageIcon } from "lucide-react"

interface ChatInputProps {
  onSend: (content: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [showActions, setShowActions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message.trim())
      setMessage("")
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="bg-card border-t border-border p-4">
      {/* Actions popup */}
      {showActions && (
        <div className="mb-4 flex gap-3 animate-in slide-in-from-bottom-4">
          <button className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-[16px] transition-colors">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span className="text-sm">صورة</span>
          </button>
          <button className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-[16px] transition-colors">
            <Smile className="w-5 h-5 text-primary" />
            <span className="text-sm">ملصق</span>
          </button>
        </div>
      )}

      {/* Capsule Input Bar */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          {/* Add Button */}
          <button
            type="button"
            onClick={() => setShowActions(!showActions)}
            className={`w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground transition-all duration-300 hover:scale-105 orange-glow ${
              showActions ? "rotate-45" : ""
            }`}
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </button>

          {/* Input Capsule */}
          <div className="flex-1 bg-secondary rounded-[30px] flex items-center px-2">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رسالتك..."
              className="flex-1 bg-transparent border-0 text-foreground placeholder:text-muted-foreground py-4 px-4 focus:outline-none text-[15px]"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 orange-glow"
          >
            <Send className="w-5 h-5 -rotate-45" />
          </button>
        </div>
      </form>
    </div>
  )
}
