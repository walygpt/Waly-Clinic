"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResultsDisplayProps {
  result: any
  consultationId: string
  onNewConsultation: () => void
}

export function ResultsDisplay({ result, consultationId, onNewConsultation }: ResultsDisplayProps) {
  const { language } = useLanguage()
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [notes, setNotes] = useState("")

  const primaryDiagnosis = result.differential_diagnoses?.[0]
  const recommendations = result.treatment_recommendations || []
  const tests = result.recommended_tests || []
  const warnings = result.immediate_warnings || []

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Primary Diagnosis */}
      {primaryDiagnosis && (
        <Card className="border-accent border-2">
          <CardHeader className="bg-accent/5">
            <CardTitle className="text-accent">{t("results.primaryDiagnosis", language)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">{primaryDiagnosis.condition}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t("results.confidence", language)}</span>
                  <span className="font-bold text-accent">{Math.round(primaryDiagnosis.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-accent h-3 rounded-full transition-all duration-500"
                    style={{ width: `${primaryDiagnosis.confidence * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-foreground text-sm leading-relaxed">{primaryDiagnosis.rationale}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">{t("results.warnings", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {warnings.map((warning: any, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-destructive font-bold mt-1">⚠</span>
                  <span className="text-foreground">{warning.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Differential Diagnoses */}
      {result.differential_diagnoses && result.differential_diagnoses.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("results.alternativeDiagnoses", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.differential_diagnoses.slice(1).map((diagnosis: any, idx: number) => (
                <div key={idx} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{diagnosis.condition}</h4>
                    <span className="text-sm font-bold text-muted-foreground">
                      {Math.round(diagnosis.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{diagnosis.rationale}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Tests */}
      {tests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("results.recommendedTests", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tests.map((test: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      test.priority === "High"
                        ? "bg-destructive/10 text-destructive"
                        : test.priority === "Medium"
                          ? "bg-yellow-500/10 text-yellow-700"
                          : "bg-green-500/10 text-green-700"
                    }`}
                  >
                    {test.priority}
                  </span>
                  <span className="text-foreground">{test.test}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Treatment Recommendations */}
      {recommendations.drug_therapy && recommendations.drug_therapy.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("results.treatmentRecommendations", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.drug_therapy.map((rec: any, idx: number) => (
                <div key={idx} className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">{rec.drug_name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">{t("results.dose", language)}:</span>
                      <p className="font-semibold text-foreground">{rec.dose}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t("results.duration", language)}:</span>
                      <p className="font-semibold text-foreground">{rec.duration}</p>
                    </div>
                  </div>
                  {rec.caveat && <p className="text-sm text-destructive font-semibold">{rec.caveat}</p>}
                </div>
              ))}
              {recommendations.lifestyle_advice && (
                <div className="border border-border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-semibold text-foreground mb-2">{t("results.lifestyleAdvice", language)}</h4>
                  <p className="text-sm text-foreground">{recommendations.lifestyle_advice}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explainability */}
      {result.explainability && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">{t("results.explanation", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-sm leading-relaxed">{result.explainability}</p>
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("results.feedback", language)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={() => setFeedback("correct")}
              variant={feedback === "correct" ? "default" : "outline"}
              className="flex-1"
            >
              {t("results.correct", language)}
            </Button>
            <Button
              onClick={() => setFeedback("incorrect")}
              variant={feedback === "incorrect" ? "default" : "outline"}
              className="flex-1"
            >
              {t("results.incorrect", language)}
            </Button>
          </div>
          {feedback && (
            <textarea
              placeholder={t("results.notes", language)}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-right resize-none"
              rows={2}
            />
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onNewConsultation}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6"
        >
          {t("results.newConsultation", language)}
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="text-sm text-yellow-900">
            <strong>{language === "ar" ? "تنبيه مهم:" : "Important Notice:"}</strong>{" "}
            {t("results.disclaimer", language)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
