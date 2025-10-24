"use client"

import { useState } from "react"
import { storage } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsPanel() {
  const { language } = useLanguage()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClearData = () => {
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من رغبتك في حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه."
          : "Are you sure you want to delete all data? This action cannot be undone.",
      )
    ) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleExportData = () => {
    const patients = storage.getAllPatients()
    const consultations = storage.getAllConsultations()

    const data = {
      patients,
      consultations,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `waly-clinic-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.settings", language)}</CardTitle>
          <CardDescription>{t("settings.manageData", language)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleExportData} variant="outline" className="w-full bg-transparent">
            {t("settings.exportData", language)}
          </Button>
          <Button onClick={handleClearData} variant="destructive" className="w-full">
            {t("settings.clearData", language)}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">{t("settings.appInfo", language)}</h4>
          <p className="text-sm text-blue-800">{t("settings.appDescription", language)}</p>
          <p className="text-xs text-blue-700 mt-3">{t("settings.dataStorage", language)}</p>
        </CardContent>
      </Card>
    </div>
  )
}
