"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface LanguageContextType {
  language: "ar" | "en"
  setLanguage: (lang: "ar" | "en") => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<"ar" | "en">("ar")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("language") as "ar" | "en" | null
    if (saved) {
      setLanguageState(saved)
      document.documentElement.lang = saved
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr"
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: "ar" | "en") => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
  }

  if (!mounted) return <>{children}</>

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
