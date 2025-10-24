"use client"

import type React from "react"

import { useState } from "react"
import { type PatientData, type ConsultationCase, storage } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResultsDisplay } from "./results-display"
import { QuickTips } from "./quick-tips"

interface ConsultationFormProps {
  patient: PatientData
  onConsultationSaved?: () => void
}

export function ConsultationForm({ patient, onConsultationSaved }: ConsultationFormProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    symptoms: "",
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    labResults: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [consultationId, setConsultationId] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Create consultation case
      const id = Math.random().toString(36).substr(2, 9)
      setConsultationId(id)

      const consultation: ConsultationCase = {
        id,
        patientId: patient.id,
        symptoms: formData.symptoms,
        vitals: {
          temperature: formData.temperature ? Number.parseFloat(formData.temperature) : undefined,
          bloodPressure: formData.bloodPressure || undefined,
          heartRate: formData.heartRate ? Number.parseInt(formData.heartRate) : undefined,
        },
        labResults: formData.labResults,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Call Gemini API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: formData.symptoms,
          vitals: consultation.vitals,
          labResults: formData.labResults,
          medicalHistory: patient.medicalHistory,
          medications: patient.currentMedications,
          allergies: patient.allergies,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze")
      }

      const analysisResult = await response.json()

      // Save consultation with results
      consultation.geminOutput = analysisResult
      consultation.diagnosis = analysisResult.differential_diagnoses?.[0]?.condition
      consultation.confidence = analysisResult.differential_diagnoses?.[0]?.confidence

      storage.saveConsultation(consultation)
      setResult(analysisResult)
      onConsultationSaved?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : t("consultation.error", language))
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (result) {
    return (
      <ResultsDisplay
        result={result}
        consultationId={consultationId}
        onNewConsultation={() => {
          setResult(null)
          setFormData({ symptoms: "", temperature: "", bloodPressure: "", heartRate: "", labResults: "" })
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("consultation.title", language)}</CardTitle>
              <CardDescription>{t("consultation.description", language)}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-destructive">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="symptoms">
                    {t("consultation.symptoms", language)} {t("common.required", language)}
                  </Label>
                  <textarea
                    id="symptoms"
                    placeholder={t("consultation.enterSymptoms", language)}
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-right resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">{t("consultation.temperature", language)}</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="37.5"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">{t("consultation.bloodPressure", language)}</Label>
                    <Input
                      id="bloodPressure"
                      placeholder="120/80"
                      value={formData.bloodPressure}
                      onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">{t("consultation.heartRate", language)}</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      placeholder="72"
                      value={formData.heartRate}
                      onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labResults">{t("consultation.labResults", language)}</Label>
                  <textarea
                    id="labResults"
                    placeholder={t("consultation.enterLabResults", language)}
                    value={formData.labResults}
                    onChange={(e) => setFormData({ ...formData, labResults: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-right resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!formData.symptoms || isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                      {t("consultation.analyzing", language)}
                    </span>
                  ) : (
                    t("consultation.analyze", language)
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <QuickTips />
        </div>
      </div>
    </div>
  )
}
