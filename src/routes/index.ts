import express from 'express'
import userRouter from './user'
import authRouter from './auth'
import requiredLogin from '../middleware/requiredLogin'
import companyRouter from './company'

const v1Router = express.Router()

v1Router.use('/auth', authRouter)
v1Router.use('/users', requiredLogin, userRouter)
v1Router.use('/companies', authenticateUser, companyRouter)

export default v1Router
