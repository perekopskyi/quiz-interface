import { AnswerDB, ShortCode } from './types'

type PatientAnswer = {
  answer: string
  date: string
}

interface PatientInfo {
  dob: string
  firstName: string
  lastName: string
  allergies: PatientAnswer[]
  medications: PatientAnswer[]
}

export const normalizeData = (rows: Array<AnswerDB>): PatientInfo => {
  // Map rows to PatientInfo object
  const patientInfo: PatientInfo = {
    dob: '',
    firstName: '',
    lastName: '',
    allergies: [],
    medications: [],
  }

  rows.forEach(row => {
    const rowShortCode = row.short_code.toLowerCase()

    if (rowShortCode === ShortCode.dob) {
      patientInfo.dob = row.answer
    } else if (rowShortCode === ShortCode.firstName) {
      patientInfo.firstName = row.answer
    } else if (rowShortCode === ShortCode.lastName) {
      patientInfo.lastName = row.answer
    } else if (rowShortCode === ShortCode.allergies) {
      patientInfo.allergies.push({ answer: row.answer, date: row.completed_at })
    } else if (rowShortCode === ShortCode.medications) {
      patientInfo.medications.push({
        answer: row.answer,
        date: row.completed_at,
      })
    }
  })

  return patientInfo
}
