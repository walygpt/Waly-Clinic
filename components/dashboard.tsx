"use client"

import { useState, useEffect } from "react"
import { type PatientData, storage } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConsultationForm } from "./consultation-form"
import { CasesList } from "./cases-list"
import { SettingsPanel } from "./settings-panel"
import { PWAInstallButton } from "./pwa-install-button"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface DashboardProps {
  patient: PatientData
  onChangePatient: () => void
  deferredPrompt: BeforeInstallPromptEvent | null
  isPWAInstalled: boolean
  onPWAInstalled: () => void
}

export function Dashboard({
  patient,
  onChangePatient,
  deferredPrompt,
  isPWAInstalled,
  onPWAInstalled,
}: DashboardProps) {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState<"new" | "cases" | "settings">("new")
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    const patientCases = storage.getConsultationsByPatient(patient.id)
    setCases(patientCases)
  }, [patient.id])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{t("clinic.title", language)}</h1>
            <p className="text-sm text-muted-foreground">{t("clinic.subtitle", language)}</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageToggle />
            <PWAInstallButton
              deferredPrompt={deferredPrompt}
              isInstalled={isPWAInstalled}
              onInstalled={onPWAInstalled}
            />
            <div className={`text-${language === "ar" ? "right" : "left"}`}>
              <p className="font-semibold text-foreground">{patient.name}</p>
              <p className="text-sm text-muted-foreground">
                {patient.age} {language === "ar" ? "سنة" : "years"}
              </p>
            </div>
            <Button variant="outline" onClick={onChangePatient} className="bg-transparent">
              {t("clinic.changePatient", language)}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">{t("dashboard.totalConsultations", language)}</p>
                <p className="text-3xl font-bold text-primary mt-2">{cases.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">{t("dashboard.averageConfidence", language)}</p>
                <p className="text-3xl font-bold text-accent mt-2">
                  {cases.length > 0
                    ? Math.round((cases.reduce((sum, c) => sum + (c.confidence || 0), 0) / cases.length) * 100)
                    : 0}
                  %
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">{t("dashboard.lastConsultation", language)}</p>
                <p className="text-lg font-semibold text-foreground mt-2">
                  {cases.length > 0
                    ? new Date(cases[cases.length - 1].createdAt).toLocaleDateString(
                        language === "ar" ? "ar-EG" : "en-US",
                      )
                    : t("dashboard.noConsultations", language)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "new"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("dashboard.newConsultation", language)}
          </button>
          <button
            onClick={() => setActiveTab("cases")}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "cases"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("dashboard.records", language)} ({cases.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "settings"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("dashboard.settings", language)}
          </button>
        </div>

        {/* Content */}
        {activeTab === "new" && (
          <ConsultationForm
            patient={patient}
            onConsultationSaved={() => setCases(storage.getConsultationsByPatient(patient.id))}
          />
        )}
        {activeTab === "cases" && <CasesList cases={cases} />}
        {activeTab === "settings" && <SettingsPanel />}
      </main>
    </div>
  )
}
