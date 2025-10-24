"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function QuickTips() {
  const tips = [
    {
      title: "وصف دقيق للأعراض",
      description: "اكتب أعراضك بالتفصيل - متى بدأت، كم مرة تحدث، هل تزداد سوءاً",
    },
    {
      title: "البيانات الحيوية مهمة",
      description: "درجة الحرارة وضغط الدم ونبضات القلب تساعد في التشخيص الدقيق",
    },
    {
      title: "السجل الطبي",
      description: "أخبرنا عن أي أمراض سابقة أو أدوية تتناولها حالياً",
    },
    {
      title: "الحساسيات والتحذيرات",
      description: "أخبرنا عن أي حساسيات من أدوية أو مواد معينة",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>نصائح للحصول على أفضل النتائج</CardTitle>
        <CardDescription>اتبع هذه النصائح للحصول على تشخيص أكثر دقة</CardDescription>
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
