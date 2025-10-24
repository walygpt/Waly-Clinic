"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar"
    setLanguage(newLang)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="transition-smooth"
      title={language === "ar" ? "English" : "العربية"}
    >
      <Globe className="h-5 w-5" />
      <span className="text-xs ml-1">{language === "ar" ? "EN" : "AR"}</span>
    </Button>
  )
}
