export interface PatientData {
  id: string
  name: string
  age: number
  gender: "male" | "female" | "other"
  email?: string
  phone?: string
  medicalHistory?: string
  currentMedications?: string
  allergies?: string
  createdAt: string
}

export interface ConsultationCase {
  id: string
  patientId: string
  symptoms: string
  vitals?: {
    temperature?: number
    bloodPressure?: string
    heartRate?: number
  }
  labResults?: string
  medicalHistory?: string
  medications?: string
  allergies?: string
  geminOutput?: any
  modelOutput?: any
  diagnosis?: string
  confidence?: number
  treatment?: string
  feedback?: "correct" | "incorrect"
  notes?: string
  createdAt: string
  updatedAt: string
  fullConsultationData?: {
    inputs: {
      symptoms: string
      vitals?: any
      medicalHistory?: string
      medications?: string
      allergies?: string
      labResults?: string
    }
    output: any
  }
}

const STORAGE_KEYS = {
  PATIENTS: "waly_patients",
  CONSULTATIONS: "waly_consultations",
  CURRENT_PATIENT: "waly_current_patient",
}

export const storage = {
  // Patient operations
  savePatient: (patient: PatientData) => {
    const patients = storage.getAllPatients()
    const index = patients.findIndex((p) => p.id === patient.id)
    if (index >= 0) {
      patients[index] = patient
    } else {
      patients.push(patient)
    }
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients))
    return patient
  },

  getAllPatients: (): PatientData[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS)
    return data ? JSON.parse(data) : []
  },

  getPatient: (id: string): PatientData | null => {
    const patients = storage.getAllPatients()
    return patients.find((p) => p.id === id) || null
  },

  deletePatient: (id: string) => {
    const patients = storage.getAllPatients()
    const filtered = patients.filter((p) => p.id !== id)
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(filtered))
  },

  setCurrentPatient: (patient: PatientData) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PATIENT, JSON.stringify(patient))
  },

  getCurrentPatient: (): PatientData | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PATIENT)
    return data ? JSON.parse(data) : null
  },

  // Consultation operations
  saveConsultation: (consultation: ConsultationCase) => {
    const consultations = storage.getAllConsultations()
    const index = consultations.findIndex((c) => c.id === consultation.id)
    if (index >= 0) {
      consultations[index] = consultation
    } else {
      consultations.push(consultation)
    }
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations))
    return consultation
  },

  getAllConsultations: (): ConsultationCase[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS)
    return data ? JSON.parse(data) : []
  },

  getConsultationsByPatient: (patientId: string): ConsultationCase[] => {
    const consultations = storage.getAllConsultations()
    return consultations.filter((c) => c.patientId === patientId)
  },

  getConsultation: (id: string): ConsultationCase | null => {
    const consultations = storage.getAllConsultations()
    return consultations.find((c) => c.id === id) || null
  },

  deleteConsultation: (id: string) => {
    const consultations = storage.getAllConsultations()
    const filtered = consultations.filter((c) => c.id !== id)
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(filtered))
  },
}
