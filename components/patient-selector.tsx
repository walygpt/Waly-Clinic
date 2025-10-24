"use client"

import { useState, useEffect } from "react"
import { type PatientData, storage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface PatientSelectorProps {
  onSelectPatient: (patient: PatientData) => void
  onNewPatient: () => void
}

export function PatientSelector({ onSelectPatient, onNewPatient }: PatientSelectorProps) {
  const [patients, setPatients] = useState<PatientData[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const allPatients = storage.getAllPatients()
    setPatients(allPatients)
  }, [])

  const filteredPatients = patients.filter((p) => p.name.includes(searchTerm) || p.phone?.includes(searchTerm))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-bold">W</span>
              </div>
            </div>
            <CardTitle className="text-3xl">WALY CLINIC</CardTitle>
            <CardDescription className="text-lg mt-2">العقل الإكلينيكي الرقمي</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{patients.length}</p>
              <p className="text-sm text-muted-foreground">إجمالي المرضى</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-accent">
                {patients.reduce((sum, p) => sum + storage.getConsultationsByPatient(p.id).length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">إجمالي الاستشارات</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Button onClick={onNewPatient} className="w-full bg-primary hover:bg-primary/90">
                مريض جديد
              </Button>
            </CardContent>
          </Card>
        </div>

        {patients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>المرضى المسجلون</CardTitle>
              <div className="mt-4">
                <Input
                  placeholder="ابحث عن مريض..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-right"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => onSelectPatient(patient)}
                    className="w-full text-right p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.age} سنة • {patient.phone || "بدون هاتف"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-accent">
                          {storage.getConsultationsByPatient(patient.id).length} استشارة
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
