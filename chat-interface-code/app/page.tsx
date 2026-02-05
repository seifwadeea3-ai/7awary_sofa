"use client"

import { AppProvider } from "@/lib/app-context"
import { MainApp } from "@/components/chat/main-app"

export default function Home() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  )
}
