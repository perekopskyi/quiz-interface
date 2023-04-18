import request from 'supertest'
import sqlite3 from 'sqlite3'
import { AnswerDB } from '../../utils/types'
import { normalizeData } from '../../utils/normalizeData'
import { app } from '../../..'

describe('GET /patient/:id', () => {
  const db = new sqlite3.Database('./questionnaire.db', err => {
    if (err) {
      console.error(err.message)
    } else {
      console.log('Connected to the questionnaire database.')
    }
  })

  it('should return patient information', async () => {
    const id = 1
    const query = `
    SELECT a.answer, q.created_at, q.updated_at, q.completed_at, qq.description, qq.short_code 
    FROM questionnaire_answer AS a
    INNER JOIN questionnaire_question AS qq ON a.question_id = qq.id
    INNER JOIN patient_questionnaire AS q ON a.questionnaire_id = q.id
    WHERE q.patient_id = ?
  `
    const expectedRows: Array<AnswerDB> = await new Promise(
      (resolve, reject) => {
        db.all(query, [id], (err, rows: Array<AnswerDB>) => {
          if (err) {
            reject(err)
          }
          resolve(rows)
        })
      }
    )
    const expectedResult = normalizeData(expectedRows)

    const response = await request(app).get(`/patient/${id}`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResult)
  })

  it('should return 404 if patient not found', async () => {
    const id = 999 // assuming this ID does not exist in the DB
    const response = await request(app).get(`/patient/${id}`)
    expect(response.status).toBe(404)
    expect(response.text).toBe(`Patient with id ${id} not found`)
  })

  afterAll(() => {
    db.close()
  })
})
