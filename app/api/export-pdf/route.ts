import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { consultation, patient } = await request.json()

    const content = `
╔════════════════════════════════════════════════════════════════╗
║                  WALY CLINIC - تقرير الاستشارة                ║
║                  Digital Clinical Brain Report                 ║
╚════════════════════════════════════════════════════════════════╝

بيانات المريض:
─────────────
الاسم: ${patient.name}
العمر: ${patient.age} سنة
النوع: ${patient.gender === "male" ? "ذكر" : patient.gender === "female" ? "أنثى" : "آخر"}
تاريخ الاستشارة: ${new Date(consultation.createdAt).toLocaleDateString("ar-EG")}

الأعراض المبلغ عنها:
──────────────────
${consultation.symptoms}

البيانات الحيوية:
───────────────
درجة الحرارة: ${consultation.vitals?.temperature || "غير محددة"}°C
ضغط الدم: ${consultation.vitals?.bloodPressure || "غير محدد"}
نبضات القلب: ${consultation.vitals?.heartRate || "غير محددة"} نبضة/دقيقة

التشخيص المحتمل:
───────────────
${consultation.geminOutput?.differential_diagnoses?.[0]?.condition || "غير محدد"}
درجة الثقة: ${Math.round((consultation.geminOutput?.differential_diagnoses?.[0]?.confidence || 0) * 100)}%

التوصيات العلاجية:
────────────────
${consultation.geminOutput?.treatment_recommendations?.map((r: any) => `• ${r.drug}: ${r.dose} ${r.route} لمدة ${r.duration}`).join("\n") || "لا توجد توصيات"}

الفحوصات المقترحة:
────────────────
${consultation.geminOutput?.recommended_tests?.map((t: any) => `• ${t.test} (${t.priority})`).join("\n") || "لا توجد فحوصات"}

تحذيرات:
───────
${consultation.geminOutput?.warnings?.join("\n") || "لا توجد تحذيرات"}

شرح التحليل:
──────────
${consultation.geminOutput?.explainability || "لا يوجد شرح"}

═════════════════════════════════════════════════════════════════
تنبيه قانوني مهم:
هذا التقرير مخصص للأغراض التعليمية والمعلوماتية فقط. لا يجب 
استخدامه كبديل للاستشارة الطبية الحقيقية من طبيب مختص معتمد.
يرجى استشارة متخصص طبي قبل اتخاذ أي قرار طبي.
═════════════════════════════════════════════════════════════════
    `

    return NextResponse.json({
      success: true,
      content,
      filename: `consultation-${consultation.id}.txt`,
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to export" }, { status: 500 })
  }
}
