import express from 'express'
import { patientRouter } from './src/modules/patient/patient'

export const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/patient', patientRouter)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
