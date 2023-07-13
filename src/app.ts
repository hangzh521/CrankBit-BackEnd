import 'dotenv/config'

import express, { Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import RateLimit from 'express-rate-limit'

// import sgMail from '@sendgrid/mail'
import connectDB from './database'
import swaggerJsDoc from './utils/swagger'

import v1Router from './routes'

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = express()
app.use(express.json())
app.use(helmet())
app.use(cors())

// rate limiter
app.use(
  RateLimit({
    windowMs: 15 * 60 * 1000, // 5 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 5 minutes',
  })
)

// routes
app.use('/api/v1', v1Router)

// health check api
app.get('/health-check', (request: Request, response: Response) => response.status(200).send({ message: 'healthy' }))

// swagger api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc))
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerJsDoc)
})

const port = process.env.PORT || 8080

const start = async (): Promise<void> => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => console.log(`Server is started on ${process.env.SERVER_URL || `http://localhost:${port}`}`))
  } catch (error) {
    console.log(error)
  }
}

start()
