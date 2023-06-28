import express from 'express'
import userRouter from './user'
import authRouter from './auth'
import requiredLogin from '../middleware/requiredLogin'

const v1Router = express.Router()

v1Router.use('/auth', authRouter)
v1Router.use('/users', requiredLogin, userRouter)

export default v1Router
