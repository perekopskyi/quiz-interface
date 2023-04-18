export type AnswerDB = {
  'answer': string
  'created_at': string
  'updated_at': string
  'completed_at': string
  'description': string
  'short_code': ShortCode
}

export enum ShortCode {
  dob = 'dob',
  firstName = 'firstname',
  lastName = 'lastname',
  allergies = 'allergies',
  medications = 'medications',
}
