"use client"

import type { ConsultationCase } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ConsultationAnalyticsProps {
  cases: ConsultationCase[]
}

export function ConsultationAnalytics({ cases }: ConsultationAnalyticsProps) {
  if (cases.length === 0) {
    return null
  }

  const diagnoses = cases.reduce(
    (acc, c) => {
      if (c.diagnosis) {
        acc[c.diagnosis] = (acc[c.diagnosis] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const avgConfidence = cases.reduce((sum, c) => sum + (c.confidence || 0), 0) / cases.length
  const highConfidenceCases = cases.filter((c) => (c.confidence || 0) >= 0.8).length
  const recentCases = cases.slice(-5)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">متوسط الثقة</p>
              <p className="text-3xl font-bold text-accent mt-2">{Math.round(avgConfidence * 100)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">حالات عالية الثقة</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{highConfidenceCases}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">التشخيصات المختلفة</p>
              <p className="text-3xl font-bold text-primary mt-2">{Object.keys(diagnoses).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>التشخيصات الشائعة</CardTitle>
          <CardDescription>أكثر التشخيصات تكراراً</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(diagnoses)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([diagnosis, count]) => (
                <div key={diagnosis} className="flex items-center justify-between">
                  <span className="text-foreground">{diagnosis}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${(count / cases.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>آخر الاستشارات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentCases.reverse().map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2 border border-border rounded-lg">
                <div>
                  <p className="font-semibold text-foreground text-sm">{c.diagnosis}</p>
                  <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("ar-EG")}</p>
                </div>
                <span className="text-sm font-bold text-accent">{Math.round((c.confidence || 0) * 100)}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
