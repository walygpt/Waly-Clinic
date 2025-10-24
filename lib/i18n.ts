export const translations = {
  ar: {
    // Header
    "clinic.title": "WALY CLINIC",
    "clinic.subtitle": "العقل الإكلينيكي الرقمي",
    "clinic.changePatient": "تغيير المريض",
    "clinic.installApp": "تثبيت التطبيق",
    "clinic.installing": "جاري التثبيت...",
    "clinic.installed": "مثبت",

    // Patient Form
    "form.fullName": "الاسم الكامل",
    "form.enterFullName": "أدخل اسمك الكامل",
    "form.age": "العمر",
    "form.enterAge": "أدخل عمرك",
    "form.gender": "النوع",
    "form.male": "ذكر",
    "form.female": "أنثى",
    "form.other": "آخر",
    "form.phone": "رقم الهاتف",
    "form.enterPhone": "أدخل رقم هاتفك",
    "form.email": "البريد الإلكتروني",
    "form.enterEmail": "أدخل بريدك الإلكتروني",
    "form.medicalHistory": "السجل الطبي السابق",
    "form.enterMedicalHistory": "أدخل أي أمراض سابقة أو عمليات جراحية",
    "form.medications": "الأدوية الحالية",
    "form.enterMedications": "أدخل الأدوية التي تتناولها حالياً",
    "form.allergies": "الحساسيات",
    "form.enterAllergies": "أدخل أي حساسيات من أدوية أو مواد",
    "form.step": "الخطوة",
    "form.of": "من",
    "form.next": "التالي",
    "form.previous": "السابق",
    "form.startConsultation": "ابدأ الاستشارة",

    // Dashboard
    "dashboard.totalConsultations": "إجمالي الاستشارات",
    "dashboard.averageConfidence": "متوسط الثقة",
    "dashboard.lastConsultation": "آخر استشارة",
    "dashboard.noConsultations": "لا توجد",
    "dashboard.newConsultation": "استشارة جديدة",
    "dashboard.records": "السجلات",
    "dashboard.settings": "الإعدادات",

    // Consultation Form
    "consultation.title": "استشارة طبية جديدة",
    "consultation.description": "أدخل أعراضك والبيانات الطبية",
    "consultation.symptoms": "الأعراض",
    "consultation.enterSymptoms": "اكتب أعراضك بالتفصيل",
    "consultation.temperature": "درجة الحرارة (°C)",
    "consultation.bloodPressure": "ضغط الدم",
    "consultation.heartRate": "نبضات القلب",
    "consultation.labResults": "نتائج التحاليل (اختياري)",
    "consultation.enterLabResults": "أدخل نتائج أي تحاليل طبية",
    "consultation.analyze": "تحليل الأعراض",
    "consultation.analyzing": "جاري التحليل...",
    "consultation.error": "حدث خطأ في التحليل",

    // Loading
    "common.loading": "جاري التحميل...",
    "common.required": "*",
  },
  en: {
    // Header
    "clinic.title": "WALY CLINIC",
    "clinic.subtitle": "Digital Clinical Intelligence",
    "clinic.changePatient": "Change Patient",
    "clinic.installApp": "Install App",
    "clinic.installing": "Installing...",
    "clinic.installed": "Installed",

    // Patient Form
    "form.fullName": "Full Name",
    "form.enterFullName": "Enter your full name",
    "form.age": "Age",
    "form.enterAge": "Enter your age",
    "form.gender": "Gender",
    "form.male": "Male",
    "form.female": "Female",
    "form.other": "Other",
    "form.phone": "Phone Number",
    "form.enterPhone": "Enter your phone number",
    "form.email": "Email",
    "form.enterEmail": "Enter your email",
    "form.medicalHistory": "Medical History",
    "form.enterMedicalHistory": "Enter any previous diseases or surgeries",
    "form.medications": "Current Medications",
    "form.enterMedications": "Enter medications you are currently taking",
    "form.allergies": "Allergies",
    "form.enterAllergies": "Enter any drug or substance allergies",
    "form.step": "Step",
    "form.of": "of",
    "form.next": "Next",
    "form.previous": "Previous",
    "form.startConsultation": "Start Consultation",

    // Dashboard
    "dashboard.totalConsultations": "Total Consultations",
    "dashboard.averageConfidence": "Average Confidence",
    "dashboard.lastConsultation": "Last Consultation",
    "dashboard.noConsultations": "None",
    "dashboard.newConsultation": "New Consultation",
    "dashboard.records": "Records",
    "dashboard.settings": "Settings",

    // Consultation Form
    "consultation.title": "New Medical Consultation",
    "consultation.description": "Enter your symptoms and medical data",
    "consultation.symptoms": "Symptoms",
    "consultation.enterSymptoms": "Describe your symptoms in detail",
    "consultation.temperature": "Temperature (°C)",
    "consultation.bloodPressure": "Blood Pressure",
    "consultation.heartRate": "Heart Rate",
    "consultation.labResults": "Lab Results (Optional)",
    "consultation.enterLabResults": "Enter any lab test results",
    "consultation.analyze": "Analyze Symptoms",
    "consultation.analyzing": "Analyzing...",
    "consultation.error": "An error occurred during analysis",

    // Loading
    "common.loading": "Loading...",
    "common.required": "*",
  },
}

export function t(key: string, language: "ar" | "en"): string {
  return translations[language][key as keyof (typeof translations)["ar"]] || key
}
