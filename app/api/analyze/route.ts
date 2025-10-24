import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { clinicalModel } from "@/lib/clinical-model"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { symptoms, vitals, labResults, medicalHistory, medications, allergies } = await request.json()

    const prompt = `أنت مساعد استنتاج سريري رقمي متخصص باسم "WALY CLINIC". مهمتك الأساسية هي تقييم الأعراض والتاريخ الطبي للمريض، مع إعطاء الأولوية القصوى للسلامة الإكلينيكية والتحذير من حالات الطوارئ والتعارضات الدوائية قبل أي شيء آخر.

البيانات المدخلة:
- الأعراض المُعلنة: ${symptoms}
- درجة الحرارة: ${vitals?.temperature || "غير محددة"}
- ضغط الدم: ${vitals?.bloodPressure || "غير محدد"}
- نبضات القلب: ${vitals?.heartRate || "غير محددة"}
- السجل الطبي والأمراض المزمنة: ${medicalHistory || "لا يوجد"}
- الأدوية الحالية: ${medications || "لا يوجد"}
- الحساسيات والحساسيات الدوائية: ${allergies || "لا يوجد"}
- نتائج التحاليل الإضافية: ${labResults || "لا توجد"}

التعليمات المنهجية:
1. التركيز على السلامة أولاً: قبل أي تشخيص، افحص قائمة الأدوية والسجل الطبي بحثاً عن تعارضات دوائية خطيرة أو أعراض تشير إلى طوارئ (ألم الصدر، أعراض جلطة، انخفاض شديد في الضغط، أعراض الزائدة الدودية).
2. التشخيص: لا يزيد عدد التشخيصات التفريقية عن ثلاثة، مع تضمين نسبة الثقة والسبب الموجز لكل تشخيص.
3. الإخراج: يجب أن يكون الناتج في هيئة JSON فقط، بدون أي مقدمات أو شروحات نصية.

الهيكل المطلوب للإخراج (JSON Schema):
{
  "confidence_score": 0.0,
  "immediate_warnings": [
    {
      "type": "Drug_Interaction|Emergency_Referral|Critical_Symptom",
      "text": "وصف مفصل للتحذير بناءً على التعارض الدوائي أو خطر الطوارئ (يجب أن يكون التحذير صارماً وواضحاً)."
    }
  ],
  "differential_diagnoses": [
    {
      "condition": "اسم التشخيص المحتمل الأول (يجب أن يكون الأرجح)",
      "confidence": 0.0,
      "rationale": "شرح موجز لأسباب اختيار هذا التشخيص بناءً على الأعراض والتاريخ المرضي."
    }
  ],
  "recommended_tests": [
    {
      "test": "الفحص الطبي أو التحليل المطلوب (مثال: CBC, EKG, X-Ray)",
      "priority": "High|Medium|Low"
    }
  ],
  "treatment_recommendations": {
    "drug_therapy": [
      {
        "drug_name": "اسم الدواء المقترح (إذا كان آمناً وضرورياً)",
        "dose": "الجرعة المقترحة",
        "duration": "مدة العلاج المقترحة",
        "caveat": "تنبيه مثل: 'لا تبدأ العلاج قبل استشارة طبيب.'"
      }
    ],
    "lifestyle_advice": "نصائح عامة (مثل: الراحة، زيادة السوائل، تعديل النظام الغذائي)."
  },
  "explainability": "شرح مبسط (150 كلمة كحد أقصى) لكيفية الوصول للتشخيص، مع الإشارة إلى أهم ثلاثة عوامل في بيانات المريض."
}`

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const analysisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse response" }

    const clinicalData = {
      symptoms: symptoms ? symptoms.split(",").map((s: string) => s.trim()) : [],
      vitals,
      medicalHistory: medicalHistory ? medicalHistory.split(",").map((h: string) => h.trim()) : [],
      medications: medications ? medications.split(",").map((m: string) => m.trim()) : [],
      allergies: allergies ? allergies.split(",").map((a: string) => a.trim()) : [],
      labResults,
    }

    const { correctedResult, corrections } = clinicalModel.correctGeminiOutput(analysisResult, clinicalData)

    // إضافة معلومات عن التصحيح
    correctedResult.model_info = {
      gemini_model: "gemini-2.0-flash",
      clinical_corrections_applied: corrections.length > 0,
      corrections_count: corrections.length,
      local_model_version: "1.0",
    }

    return NextResponse.json(correctedResult)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 })
  }
}
