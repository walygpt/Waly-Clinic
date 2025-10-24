"use client"

import { Mail, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"

export function Footer() {
  const { language } = useLanguage()

  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.about", language)}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("footer.aboutDescription", language)}</p>
          </div>

          {/* Developer Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.developer", language)}</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <span className="font-medium text-foreground">{t("footer.developerName", language)}</span>
              </p>
              <p className="text-xs">{t("footer.developerTitle", language)}</p>
              <p className="text-xs">{t("footer.developerRole", language)}</p>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.contact", language)}</h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/201040521686"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>+201040521686</span>
              </a>
              <a
                href="mailto:mwaly8715@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>mwaly8715@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6 mt-6">
          {/* Copyright Section */}
          <div className="text-center text-xs text-muted-foreground space-y-3 mb-4">
            <p className="font-semibold text-foreground">{t("footer.copyright", language)}</p>
            <p className="leading-relaxed">{t("footer.copyrightText", language)}</p>
            <p className="leading-relaxed">{t("footer.copyrightWarning", language)}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
