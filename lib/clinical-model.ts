// Custom Clinical Model - طبقة التصحيح السريري المحلية
// يعمل بالكامل في المتصفح بدون الاتصال بخوادم خارجية

interface ClinicalData {
  symptoms: string[]
  vitals: {
    temperature?: number
    bloodPressure?: string
    heartRate?: number
  }
  medicalHistory?: string[]
  medications?: string[]
  allergies?: string[]
  labResults?: string
}

interface CorrectionFactor {
  condition: string
  confidenceAdjustment: number
  warningsToAdd: string[]
  drugInteractions: string[]
}

// قاعدة بيانات سريرية محلية للتصحيح
const CLINICAL_RULES: Record<string, CorrectionFactor> = {
  // قواعد التفاعلات الدوائية
  aspirin_warfarin: {
    condition: "تفاعل دوائي خطير",
    confidenceAdjustment: 0.15,
    warningsToAdd: ["تفاعل خطير: الأسبرين والوارفارين معاً يزيد خطر النزيف", "يجب تجنب هذا التركيب أو مراقبة شديدة"],
    drugInteractions: ["Aspirin", "Warfarin"],
  },
  metformin_contrast: {
    condition: "خطر الفشل الكلوي",
    confidenceAdjustment: 0.1,
    warningsToAdd: ["يجب إيقاف الميتفورمين قبل الفحوصات بالصبغة", "خطر الفشل الكلوي الحاد"],
    drugInteractions: ["Metformin"],
  },
  statin_grapefruit: {
    condition: "زيادة السمية",
    confidenceAdjustment: 0.08,
    warningsToAdd: ["الجريب فروت يزيد تركيز الستاتينات في الدم", "قد يسبب آلام عضلية وضعف"],
    drugInteractions: ["Statin"],
  },
  // قواعد الحالات الطبية
  fever_high: {
    condition: "حمى عالية",
    confidenceAdjustment: 0.12,
    warningsToAdd: ["درجة حرارة عالية جداً - قد تشير لعدوى خطيرة", "يجب طلب رعاية طبية فورية إذا استمرت"],
    drugInteractions: [],
  },
  hypertension_severe: {
    condition: "ارتفاع ضغط دم شديد",
    confidenceAdjustment: 0.1,
    warningsToAdd: ["ضغط دم مرتفع جداً - خطر السكتة الدماغية", "يتطلب تدخل طبي فوري"],
    drugInteractions: [],
  },
  elderly_polypharmacy: {
    condition: "تعدد الأدوية في المسنين",
    confidenceAdjustment: 0.15,
    warningsToAdd: ["المريض يتناول عدة أدوية - خطر التفاعلات الدوائية", "يجب مراجعة جميع الأدوية مع الصيدلي"],
    drugInteractions: [],
  },
}

// نموذج التصحيح السريري
export class ClinicalModel {
  private trainingData: Map<string, number> = new Map()
  private isClient = false

  constructor() {
    this.isClient = typeof window !== "undefined"
    if (this.isClient) {
      this.loadTrainingData()
    }
  }

  private loadTrainingData() {
    if (!this.isClient) return

    try {
      const stored = localStorage.getItem("clinical_model_training")
      if (stored) {
        const data = JSON.parse(stored)
        this.trainingData = new Map(Object.entries(data))
      }
    } catch (e) {
      console.log("[v0] Failed to load training data, starting fresh")
    }
  }

  private saveTrainingData() {
    if (!this.isClient) return

    try {
      const data = Object.fromEntries(this.trainingData)
      localStorage.setItem("clinical_model_training", JSON.stringify(data))
    } catch (e) {
      console.log("[v0] Failed to save training data")
    }
  }

  // تحديث النموذج بناءً على التغذية الراجعة
  updateWithFeedback(diagnosis: string, isCorrect: boolean) {
    const key = `diagnosis_${diagnosis}`
    const current = this.trainingData.get(key) || 0
    const adjustment = isCorrect ? 0.05 : -0.05
    this.trainingData.set(key, Math.max(0, Math.min(1, current + adjustment)))
    this.saveTrainingData()
  }

  // تصحيح مخرجات Gemini بناءً على القواعد السريرية
  correctGeminiOutput(
    geminiResult: any,
    clinicalData: ClinicalData,
  ): {
    correctedResult: any
    corrections: string[]
    confidenceAdjustment: number
  } {
    const corrections: string[] = []
    let confidenceAdjustment = 0
    const additionalWarnings: Set<string> = new Set(geminiResult.warnings || [])

    // فحص التفاعلات الدوائية
    if (clinicalData.medications && clinicalData.medications.length > 0) {
      const medications = clinicalData.medications.map((m) => m.toLowerCase())

      // فحص التفاعلات المعروفة
      if (medications.some((m) => m.includes("aspirin")) && medications.some((m) => m.includes("warfarin"))) {
        const rule = CLINICAL_RULES["aspirin_warfarin"]
        confidenceAdjustment += rule.confidenceAdjustment
        rule.warningsToAdd.forEach((w) => additionalWarnings.add(w))
        corrections.push("تم اكتشاف تفاعل دوائي خطير: Aspirin + Warfarin")
      }

      if (medications.some((m) => m.includes("metformin")) && clinicalData.labResults?.includes("صبغة")) {
        const rule = CLINICAL_RULES["metformin_contrast"]
        confidenceAdjustment += rule.confidenceAdjustment
        rule.warningsToAdd.forEach((w) => additionalWarnings.add(w))
        corrections.push("تم اكتشاف خطر: Metformin مع فحوصات الصبغة")
      }

      if (medications.some((m) => m.includes("statin")) && clinicalData.symptoms?.some((s) => s.includes("جريب"))) {
        const rule = CLINICAL_RULES["statin_grapefruit"]
        confidenceAdjustment += rule.confidenceAdjustment
        rule.warningsToAdd.forEach((w) => additionalWarnings.add(w))
        corrections.push("تم اكتشاف تفاعل: Statin + Grapefruit")
      }
    }

    // فحص الحالات الحرجة
    if (clinicalData.vitals?.temperature && clinicalData.vitals.temperature > 39) {
      const rule = CLINICAL_RULES["fever_high"]
      confidenceAdjustment += rule.confidenceAdjustment
      rule.warningsToAdd.forEach((w) => additionalWarnings.add(w))
      corrections.push("تم اكتشاف حمى عالية جداً")
    }

    if (clinicalData.vitals?.bloodPressure) {
      const bp = clinicalData.vitals.bloodPressure.split("/")
      const systolic = Number.parseInt(bp[0])
      if (systolic > 180) {
        const rule = CLINICAL_RULES["hypertension_severe"]
        confidenceAdjustment += rule.confidenceAdjustment
        rule.warningsToAdd.forEach((w) => additionalWarnings.add(w))
        corrections.push("تم اكتشاف ارتفاع ضغط دم شديد")
      }
    }

    // فحص تعدد الأدوية في المسنين
    if (
      clinicalData.medications &&
      clinicalData.medications.length > 5 &&
      clinicalData.medicalHistory?.some((h) => h.includes("سن"))
    ) {
      const rule = CLINICAL_RULES["elderly_polypharmacy"]
      confidenceAdjustment += rule.confidenceAdjustment
      rule.warningsToAdd.forEach((w) => additionalWarnings.add(w))
      corrections.push("تم اكتشاف تعدد أدوية في مريض مسن")
    }

    // تطبيق التصحيحات على النتائج
    const correctedResult = { ...geminiResult }

    // تحديث درجات الثقة
    if (correctedResult.differential_diagnoses) {
      correctedResult.differential_diagnoses = correctedResult.differential_diagnoses.map(
        (diagnosis: any, index: number) => ({
          ...diagnosis,
          confidence: Math.max(0, Math.min(1, diagnosis.confidence + (index === 0 ? confidenceAdjustment : 0))),
        }),
      )
    }

    // إضافة التحذيرات الجديدة
    correctedResult.warnings = Array.from(additionalWarnings)

    // إضافة ملاحظة عن التصحيح
    if (corrections.length > 0) {
      correctedResult.clinical_corrections = corrections
      correctedResult.explainability = `${correctedResult.explainability}\n\n[تصحيحات سريرية تم تطبيقها]: ${corrections.join(", ")}`
    }

    return {
      correctedResult,
      corrections,
      confidenceAdjustment,
    }
  }

  // الحصول على إحصائيات النموذج
  getModelStats() {
    return {
      trainingDataPoints: this.trainingData.size,
      rulesCount: Object.keys(CLINICAL_RULES).length,
      lastUpdated: new Date().toISOString(),
    }
  }
}

// إنشاء نسخة واحدة من النموذج (Singleton)
export const clinicalModel = new ClinicalModel()
