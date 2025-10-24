"use client"

import { useState, useEffect } from "react"
import { PatientForm } from "@/components/patient-form"
import { PatientSelector } from "@/components/patient-selector"
import { Dashboard } from "@/components/dashboard"
import { Footer } from "@/components/footer"
import type { PatientData } from "@/lib/storage"
import { storage } from "@/lib/storage"

type AppState = "selector" | "form" | "dashboard"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("selector")
  const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isPWAInstalled, setIsPWAInstalled] = useState(false)

  useEffect(() => {
    const patient = storage.getCurrentPatient()
    if (patient) {
      setCurrentPatient(patient)
      setAppState("dashboard")
    } else {
      setAppState("selector")
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsPWAInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsPWAInstalled(true)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handlePatientSubmit = (patient: PatientData) => {
    storage.savePatient(patient)
    storage.setCurrentPatient(patient)
    setCurrentPatient(patient)
    setAppState("dashboard")
  }

  const handleSelectPatient = (patient: PatientData) => {
    storage.setCurrentPatient(patient)
    setCurrentPatient(patient)
    setAppState("dashboard")
  }

  const handleChangePatient = () => {
    storage.setCurrentPatient(null)
    setCurrentPatient(null)
    setAppState("selector")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  const content = (() => {
    if (appState === "form") {
      return <PatientForm onSubmit={handlePatientSubmit} />
    }

    if (appState === "dashboard" && currentPatient) {
      return (
        <Dashboard
          patient={currentPatient}
          onChangePatient={handleChangePatient}
          deferredPrompt={deferredPrompt}
          isPWAInstalled={isPWAInstalled}
          onPWAInstalled={() => setIsPWAInstalled(true)}
        />
      )
    }

    return <PatientSelector onSelectPatient={handleSelectPatient} onNewPatient={() => setAppState("form")} />
  })()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">{content}</div>
      <Footer />
    </div>
  )
}
