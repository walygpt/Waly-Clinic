"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface PWAInstallButtonProps {
  deferredPrompt: BeforeInstallPromptEvent | null
  isInstalled: boolean
  onInstalled: () => void
}

export function PWAInstallButton({ deferredPrompt, isInstalled, onInstalled }: PWAInstallButtonProps) {
  const { language } = useLanguage()
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    // Show button only if deferredPrompt exists and app is not installed
    if (deferredPrompt && !isInstalled) {
      setShowInstallButton(true)
    } else {
      setShowInstallButton(false)
    }
  }, [deferredPrompt, isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setShowInstallButton(false)
      onInstalled()
    }
  }

  if (!showInstallButton || isInstalled) {
    return null
  }

  return (
    <Button
      onClick={handleInstall}
      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white gap-2 rounded-lg"
      title={language === "ar" ? "تثبيت التطبيق على جهازك" : "Install app on your device"}
    >
      <Download className="w-4 h-4" />
      {language === "ar" ? "تثبيت التطبيق" : "Install App"}
    </Button>
  )
}
