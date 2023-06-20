import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { User } from '../models/User'

const app = express()
app.use(bodyParser.json())
const connectionString = 'mongodb+srv://AGA:lki09bns37ANZO7U@crank-bit.00j0aqc.mongodb.net/'
const creatCompanyAccount = (): void => {
  mongoose
    .connect(connectionString)
    .then(() => {
      console.log('connected to db')
    })
    .catch((err) => {
      console.error('connect err', err)
    })
  app.post('/auth/signup', async (req: Request, res: Response) => {
    const { username, password } = req.body
    try {
      const exsitingUser = await User.findOne({ username })
      if (exsitingUser) {
        // User already exist
        res.json({ isValide: false, message: 'User exist' })
      } else {
        // Create new user
        const newUser = new User({ username, password })
        await newUser.save()
        res.json({ isValide: true, message: 'Success' })
      }
    } catch (error) {
      res.json({ error: 'server error' })
    }
  })
}
export default creatCompanyAccount
