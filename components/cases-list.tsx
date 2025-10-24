"use client"

import { useState } from "react"
import type { ConsultationCase } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CasesListProps {
  cases: ConsultationCase[]
}

export function CasesList({ cases }: CasesListProps) {
  const { language } = useLanguage()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (cases.length === 0) {
    return (
      <Card>
        <CardContent className="pt-8 text-center">
          <p className="text-muted-foreground">{t("cases.noPreviousConsultations", language)}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {cases.map((caseItem) => (
        <Card
          key={caseItem.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setExpandedId(expandedId === caseItem.id ? null : caseItem.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{caseItem.diagnosis || t("cases.consultation", language)}</CardTitle>
                <CardDescription>
                  {new Date(caseItem.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                </CardDescription>
              </div>
              {caseItem.confidence && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t("results.confidence", language)}</p>
                  <p className="text-lg font-bold text-accent">{Math.round(caseItem.confidence * 100)}%</p>
                </div>
              )}
            </div>
          </CardHeader>
          {expandedId === caseItem.id && (
            <CardContent className="border-t border-border pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{t("cases.symptoms", language)}</h4>
                  <p className="text-sm text-muted-foreground">{caseItem.symptoms}</p>
                </div>
                {caseItem.vitals && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{t("cases.vitals", language)}</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {caseItem.vitals.temperature && (
                        <div>
                          <span className="text-muted-foreground">{t("cases.temperature", language)}:</span>
                          <p className="font-semibold">{caseItem.vitals.temperature}°C</p>
                        </div>
                      )}
                      {caseItem.vitals.bloodPressure && (
                        <div>
                          <span className="text-muted-foreground">{t("cases.bloodPressure", language)}:</span>
                          <p className="font-semibold">{caseItem.vitals.bloodPressure}</p>
                        </div>
                      )}
                      {caseItem.vitals.heartRate && (
                        <div>
                          <span className="text-muted-foreground">{t("cases.heartRate", language)}:</span>
                          <p className="font-semibold">{caseItem.vitals.heartRate}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <Button variant="outline" className="w-full bg-transparent">
                  {t("cases.viewDetails", language)}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
