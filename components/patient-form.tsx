"use client"

import type React from "react"

import { useState } from "react"
import type { PatientData } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PatientFormProps {
  onSubmit: (patient: PatientData) => void
}

export function PatientForm({ onSubmit }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male" as const,
    email: "",
    phone: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
  })
  const [step, setStep] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      if (formData.name && formData.age) {
        setStep(2)
      }
      return
    }

    const patient: PatientData = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      age: Number.parseInt(formData.age),
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      medicalHistory: formData.medicalHistory,
      currentMedications: formData.currentMedications,
      allergies: formData.allergies,
      createdAt: new Date().toISOString(),
    }

    onSubmit(patient)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center border-b">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-xl font-bold">W</span>
            </div>
          </div>
          <CardTitle className="text-3xl">WALY CLINIC</CardTitle>
          <CardDescription className="text-lg mt-2">العقل الإكلينيكي الرقمي</CardDescription>
          <p className="text-sm text-muted-foreground mt-4">الخطوة {step} من 2</p>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="text-right"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">العمر *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="أدخل عمرك"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">النوع *</Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-right"
                    >
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                      <option value="other">آخر</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="أدخل رقم هاتفك"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="text-right"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">السجل الطبي السابق</Label>
                  <textarea
                    id="medicalHistory"
                    placeholder="أدخل أي أمراض سابقة أو عمليات جراحية"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-right resize-none"
                    rows={3}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">الأدوية الحالية</Label>
                  <textarea
                    id="medications"
                    placeholder="أدخل الأدوية التي تتناولها حالياً"
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-right resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">الحساسيات</Label>
                  <textarea
                    id="allergies"
                    placeholder="أدخل أي حساسيات من أدوية أو مواد"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-right resize-none"
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  السابق
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
                disabled={step === 1 ? !formData.name || !formData.age : false}
              >
                {step === 1 ? "التالي" : "ابدأ الاستشارة"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
