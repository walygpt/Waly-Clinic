"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"

export function QuickTips() {
  const { language } = useLanguage()

  const tips = [
    {
      title: t("tips.symptoms.title", language),
      description: t("tips.symptoms.description", language),
    },
    {
      title: t("tips.vitals.title", language),
      description: t("tips.vitals.description", language),
    },
    {
      title: t("tips.history.title", language),
      description: t("tips.history.description", language),
    },
    {
      title: t("tips.allergies.title", language),
      description: t("tips.allergies.description", language),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("tips.title", language)}</CardTitle>
        <CardDescription>{t("tips.subtitle", language)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">{tip.title}</h4>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
