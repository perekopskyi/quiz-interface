import { Router, Request, Response } from 'express'
import sqlite3 from 'sqlite3'
import { normalizeData } from '../../utils/normalizeData'
import { AnswerDB } from '../../utils/types'

const db = new sqlite3.Database('./questionnaire.db', err => {
  if (err) {
    console.error(err.message)
  } else {
    console.log('Connected to the questionnaire database.')
  }
})

export const patientRouter = Router()

patientRouter.get('/:id', (req: Request, res: Response) => {
  const id = req.params.id

  // Retrieve patient information from database
  const query = `
  SELECT a.answer, q.created_at, q.updated_at, q.completed_at, qq.description, qq.short_code 
    FROM questionnaire_answer AS a
    INNER JOIN questionnaire_question AS qq ON a.question_id = qq.id
    INNER JOIN patient_questionnaire AS q ON a.questionnaire_id = q.id
    WHERE q.patient_id = ?
  `

  db.all(query, [id], (err, rows: Array<AnswerDB>) => {
    if (err) {
      console.error(err.message)
      return res.status(500).send('Internal server error')
    }

    if (rows.length === 0) {
      return res.status(404).send(`Patient with id ${id} not found`)
    }

    // Return patient information as JSON
    if (rows) {
      const result = normalizeData(rows)
      return res.json(result)
    }
  })
})
